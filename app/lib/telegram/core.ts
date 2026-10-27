import { Connection, PublicKey } from "@solana/web3.js";
import { fetchInvoice, fetchInvoicesByCreator, RPC_URL, type InvoiceAccount } from "../program";
import { lamportsToSol, short, solscanTx } from "../format";
import { computeSplit } from "../split";
import { answerCallback, type Button, esc, sendMessage, setMyCommands } from "./api";
import { createDemoInvoice, demoAvailable, parseDemoArgs, payDemoInvoice } from "./demo";
import { kvDel, kvGet, kvSet, setAdd, setMembers } from "./store";
import { DEMO_WALLETS } from "../demoWallets";
import { isLang, langOf, T, type Lang } from "./messages";

export { langOf, T, type Lang } from "./messages";

export const siteUrl = () =>
  (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ).replace(/\/$/, "");

const conn = () => new Connection(RPC_URL, "confirmed");
const isKey = (s: string) => {
  try {
    new PublicKey(s);
    return true;
  } catch {
    return false;
  }
};

/** Deep-link payload: `i_<creator>_<id>` (Telegram allows 64 chars of [A-Za-z0-9_-]). */
export function parseWatchPayload(p: string): { creator: string; id: string } | null {
  const m = /^i_([1-9A-HJ-NP-Za-km-z]{32,44})_(\d{1,20})$/.exec(p);
  return m && isKey(m[1]) ? { creator: m[1], id: m[2] } : null;
}

export function draftUrl(d: { title: string; amount: string; client: string }) {
  const q = new URLSearchParams({ title: d.title, amount: d.amount, client: d.client });
  return `${siteUrl()}/create?${q}`;
}

/** Tell watchers (and the creator's linked chats) once that an invoice is paid. Idempotent. */
export async function notifyIfPaid(creator: string, id: string): Promise<boolean> {
  let inv: InvoiceAccount | null;
  try {
    inv = await fetchInvoice(conn(), new PublicKey(creator), BigInt(id));
  } catch {
    return false;
  }
  if (!inv?.isPaid) return false;
  if (!(await setAdd("notified", `${creator}:${id}`))) return false;

  const chats = new Set([
    ...(await setMembers(`watch:${creator}:${id}`)),
    ...(await setMembers(`wallet-chats:${creator}`)),
  ]);
  const sigs = await conn().getSignaturesForAddress(inv.address, { limit: 5 }, "confirmed").catch(() => []);
  const sig = sigs.find((s) => !s.err)?.signature;
  const you = lamportsToSol(computeSplit(inv.amount, inv.vaultBps, inv.collaboratorBps).creator);
  for (const chat of chats) {
    const lang = ((await kvGet(`lang:${chat}`)) as Lang) || "ru";
    const l = T[lang];
    await sendMessage(chat, l.paid(inv.title, lamportsToSol(inv.amount), you, sig ? solscanTx(sig) : siteUrl()), [
      [{ text: l.openAct, url: `${siteUrl()}/invoice/${creator}/${id}/act` }],
    ]);
  }
  return true;
}

/** Cron fallback: sweep every linked wallet for newly paid invoices. */
export async function pollLinkedWallets(): Promise<number> {
  let n = 0;
  for (const w of await setMembers("wallets")) {
    const list = await fetchInvoicesByCreator(conn(), new PublicKey(w)).catch(() => []);
    for (const inv of list) if (inv.isPaid && (await notifyIfPaid(w, inv.invoiceId.toString()))) n++;
  }
  return n;
}

async function rate() {
  const r = await fetch(`${siteUrl()}/api/rate`)
    .then((x) => x.json())
    .catch(() => null);
  return r && Number.isFinite(r.usd) ? (r as { usd: number; kzt: number }) : null;
}

/** The main menu: every action is one tap, so nobody has to remember commands. */
function mainMenu(l: (typeof T)[Lang]): Button[][] {
  const rows: Button[][] = [
    ...(demoAvailable() ? [[{ text: l.btn.demo, callback_data: "cmd:/demo" }]] : []),
    [{ text: l.btn.create, callback_data: "cmd:/new" }, { text: l.btn.mine, callback_data: "cmd:/my" }],
    [{ text: l.btn.tax, callback_data: "cmd:/tax" }, { text: l.btn.rate, callback_data: "cmd:/rate" }],
    ...(demoAvailable() ? [[{ text: l.btn.wallet, callback_data: "cmd:/wallet demo" }]] : []),
    [
      { text: "RU", callback_data: "cmd:/lang ru" },
      { text: "KZ", callback_data: "cmd:/lang kk" },
      { text: "EN", callback_data: "cmd:/lang en" },
    ],
  ];
  // Telegram rejects URL buttons that point at localhost.
  if (!siteUrl().startsWith("http://localhost")) rows.push([{ text: l.btn.site, url: siteUrl() }]);
  return rows;
}

/** Inline-button presses. Only the demo "pay" button exists today. */
export async function handleCallback(cbId: string, chatId: number, data: string, langCode?: string) {
  const pref = await kvGet(`langpref:${chatId}`);
  const l = T[pref && isLang(pref) ? pref : langOf(langCode)];
  if (data.startsWith("cmd:")) {
    await answerCallback(cbId);
    return handleMessage(chatId, data.slice(4), langCode);
  }
  const m = /^pay:([1-9A-HJ-NP-Za-km-z]{32,44}):(\d{1,20})$/.exec(data);
  if (!m || !demoAvailable()) return answerCallback(cbId);
  await answerCallback(cbId, l.demoPaying);
  const result = await payDemoInvoice(m[1], m[2]);
  if (result === "ok") {
    await notifyIfPaid(m[1], m[2]); // sends the "Paid" message with the act button
    return;
  }
  const text = { already_paid: l.demoAlready, not_found: l.demoNotFound, no_funds: l.demoNoFunds, failed: l.demoFailed }[result];
  await sendMessage(chatId, text);
}

type Draft = { step: "title" | "amount" | "client"; title?: string; amount?: string };

// Localized command menu (the "/" button), registered once per server process on the first /start.
let commandsRegistered = false;
async function ensureCommands() {
  if (commandsRegistered) return;
  commandsRegistered = true;
  await setMyCommands(T.en.commands);
  for (const lang of ["ru", "kk"] as const) await setMyCommands(T[lang].commands, lang);
}

export async function handleMessage(chatId: number, text: string, langCode?: string, name = "") {
  const [cmd, ...rest] = text.trim().split(/\s+/);
  let arg = rest.join(" ");

  const pref = await kvGet(`langpref:${chatId}`);
  let lang: Lang = pref && isLang(pref) ? pref : langOf(langCode);
  if (cmd === "/lang") {
    const wanted = arg.toLowerCase();
    if (!isLang(wanted)) return sendMessage(chatId, T[lang].langUsage);
    lang = wanted;
    await kvSet(`langpref:${chatId}`, lang);
  }
  const l = T[lang];
  const menuRow: Button[] = [{ text: `☰ ${l.btn.menu}`, callback_data: "cmd:/menu" }];
  const send = (text: string, buttons: Button[][] = []) => sendMessage(chatId, text, [...buttons, menuRow]);
  await kvSet(`lang:${chatId}`, lang);
  if (cmd === "/lang") return sendMessage(chatId, `${l.langSet}\n\n${l.welcome}`, mainMenu(l));

  if (cmd.startsWith("/start")) {
    await ensureCommands();
    // Website login: the browser holds a nonce, tapping Start in the bot confirms it (private chat id = user id).
    const login = /^login_([a-f0-9]{24})$/.exec(arg);
    if (login) {
      await kvSet(`login:${login[1]}`, JSON.stringify({ id: String(chatId), name }), 300);
      return sendMessage(chatId, l.loginOk);
    }
    const w = parseWatchPayload(arg);
    if (w) {
      const inv = await fetchInvoice(conn(), new PublicKey(w.creator), BigInt(w.id)).catch(() => null);
      if (!inv) return send(l.notFound);
      await setAdd(`watch:${w.creator}:${w.id}`, String(chatId));
      await send(l.watching(inv.title));
      if (inv.isPaid) await notifyIfPaid(w.creator, w.id);
      return;
    }
    return sendMessage(chatId, l.welcome, mainMenu(l));
  }
  if (cmd === "/menu") return sendMessage(chatId, l.welcome, mainMenu(l));
  if (cmd === "/demo") {
    if (!demoAvailable()) return send(l.demoUnavailable);
    if (await kvGet(`demo-cd:${chatId}`)) return send(l.demoWait);
    await kvSet(`demo-cd:${chatId}`, "1", 20);
    await send(l.demoCreating);
    const { title, amountSol } = parseDemoArgs(arg, l.demoDefaultTitle);
    try {
      const { creator, id } = await createDemoInvoice(title, amountSol);
      await setAdd(`watch:${creator}:${id}`, String(chatId));
      return send(l.demoReady(title, amountSol), [
        [{ text: l.demoPayBtn, callback_data: `pay:${creator}:${id}` }],
        [{ text: l.demoWebBtn, url: `${siteUrl()}/pay/${creator}/${id}` }],
      ]);
    } catch {
      return send(l.demoFailed);
    }
  }
  if (cmd === "/new") {
    await kvSet(`draft:${chatId}`, JSON.stringify({ step: "title" } satisfies Draft), 3600);
    return send(l.askTitle);
  }
  if (cmd === "/wallet") {
    if (!arg) return send(l.walletUsage);
    if (arg.toLowerCase() === "demo" && demoAvailable()) arg = DEMO_WALLETS.find((w) => w.id === "freelancer")!.publicKey;
    if (!isKey(arg)) return send(l.walletBad);
    const list = await fetchInvoicesByCreator(conn(), new PublicKey(arg)).catch(() => []);
    // Mark what is already paid as notified so linking does not replay history.
    for (const i of list) if (i.isPaid) await setAdd("notified", `${arg}:${i.invoiceId}`);
    await kvSet(`wallet:${chatId}`, arg);
    await setAdd("wallets", arg);
    await setAdd(`wallet-chats:${arg}`, String(chatId));
    return send(l.walletOk(short(arg), list.length));
  }
  if (cmd === "/my" || cmd === "/tax") {
    const w = await kvGet(`wallet:${chatId}`);
    if (!w) return send(l.needWallet);
    const list = await fetchInvoicesByCreator(conn(), new PublicKey(w)).catch(() => []);
    if (cmd === "/my") {
      if (!list.length) return send(l.noInvoices);
      const lines = list.slice(0, 10).map((i) => `${i.isPaid ? "✅" : "⏳"} ${esc(i.title)} — ${lamportsToSol(i.amount)} SOL`);
      return sendMessage(
        chatId,
        lines.join("\n"),
        list.slice(0, 5).map((i) => [
          {
            text: `${i.isPaid ? "📄" : "🔗"} ${i.title.slice(0, 28)}`,
            url: `${siteUrl()}${i.isPaid ? `/invoice/${w}/${i.invoiceId}/act` : `/pay/${w}/${i.invoiceId}`}`,
          },
        ]),
      );
    }
    const gross = list.filter((i) => i.isPaid).reduce((s, i) => s + i.amount, 0n);
    const r = await rate();
    const kzt = r ? Math.round((Number(gross) / 1e9) * r.kzt) : 0;
    return sendMessage(
      chatId,
      l.tax(lamportsToSol(gross), kzt.toLocaleString("ru-RU"), Math.round(kzt * 0.04).toLocaleString("ru-RU")),
    );
  }
  if (cmd === "/rate") {
    const r = await rate();
    return send(r ? l.rate(r.usd.toFixed(2), Math.round(r.kzt).toLocaleString("ru-RU")) : l.rateFail);
  }

  // Free text: continue the /new wizard.
  const raw = await kvGet(`draft:${chatId}`);
  if (!raw) return sendMessage(chatId, l.welcome, mainMenu(l));
  const d = JSON.parse(raw) as Draft;
  if (d.step === "title") {
    await kvSet(`draft:${chatId}`, JSON.stringify({ step: "amount", title: text.slice(0, 80) }), 3600);
    return send(l.askAmount);
  }
  if (d.step === "amount") {
    const amount = text.trim().replace(",", ".");
    if (!/^\d+(\.\d{1,9})?$/.test(amount) || Number(amount) <= 0) return send(l.badAmount);
    await kvSet(`draft:${chatId}`, JSON.stringify({ ...d, step: "client", amount }), 3600);
    return send(l.askClient);
  }
  await kvDel(`draft:${chatId}`);
  return send(l.ready, [
    [{ text: l.open, url: draftUrl({ title: d.title!, amount: d.amount!, client: text.slice(0, 80) }) }],
  ]);
}

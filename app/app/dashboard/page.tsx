"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { fetchInvoicesByCreator } from "@/lib/program";
import { computeSplit } from "@/lib/split";
import { useI18n } from "@/lib/i18n/I18nContext";
import { dash } from "@/lib/i18n/dashboard";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMode } from "@/lib/mode/ModeContext";
import { deadlines, estimate, type Regime } from "@/lib/tax/kz2026";

type Currency = "KZT" | "USD" | "SOL";
type Entry = { id: string; date: string; amount: number; currency: Currency; note: string };
type Doc = { entries: Entry[]; regime: Regime; bornAfter1975: boolean; declaredBase: number; paid: number; includeChain: boolean };
type ChainIncome = { id: string; date: string; sol: number; title: string };

const STORAGE_KEY = "steppe_finance_v1";
const DEFAULT: Doc = { entries: [], regime: "self_employed", bornAfter1975: true, declaredBase: 85000, paid: 0, includeChain: true };
const SOURCES = [
  ["uchet.kz", "https://uchet.kz"],
  ["mybuh.kz", "https://mybuh.kz/useful/uproshchyennaya-deklaratsiya-v-kazakhstane-usloviya-i-osobennosti-vedeniya.html"],
  ["finance.kz", "https://finance.kz/articles/samozanyatyy-kazakhstan-2026"],
  ["itsheff.kz", "https://itsheff.kz/howto/stati/platezhi-ip-za-sebya-v-2026-godu-polnyy-razbor-dlya-biznesa.html"],
  ["kgd.gov.kz", "https://kgd.gov.kz"],
] as const;

const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");

export default function DashboardPage() {
  const { lang } = useI18n();
  const d = dash[lang];
  const { user, ready, status, login, logout } = useAuth();
  const { connection } = useConnection();
  const { net } = useMode();
  const { publicKey } = useWallet();

  const [doc, setDoc] = useState<Doc>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);
  const [rate, setRate] = useState<{ usd: number; kzt: number } | null>(null);
  const [chain, setChain] = useState<ChainIncome[]>([]);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), amount: "", currency: "KZT" as Currency, note: "" });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load: local first, then the server copy (wins) when signed in.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDoc({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!user) return;
    fetch("/api/finance").then((r) => r.json()).then((x) => x.doc && setDoc({ ...DEFAULT, ...x.doc })).catch(() => {});
  }, [user]);

  const update = useCallback((patch: Partial<Doc>) => setDoc((p) => ({ ...p, ...patch })), []);

  // Persist (debounced for the network copy).
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(doc)); } catch {}
    if (!user) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/finance", { method: "PUT", body: JSON.stringify(doc) }).catch(() => {});
    }, 800);
  }, [doc, hydrated, user]);

  useEffect(() => {
    fetch("/api/rate").then((r) => r.json()).then(setRate).catch(() => setRate({ usd: 110, kzt: 49500 }));
  }, []);

  // On-chain income: the creator's share of every paid invoice.
  useEffect(() => {
    if (!publicKey || !doc.includeChain) return setChain([]);
    fetchInvoicesByCreator(connection, publicKey, net)
      .then((list) =>
        setChain(
          list.filter((i) => i.isPaid && i.paidAt).map((i) => ({
            id: i.invoiceId.toString(),
            date: new Date((i.paidAt as number) * 1000).toISOString().slice(0, 10),
            sol: Number(computeSplit(i.amount, i.vaultBps, i.collaboratorBps).creator) / 1e9,
            title: i.title,
          })),
        ),
      )
      .catch(() => setChain([]));
  }, [connection, publicKey, doc.includeChain]);

  const year = new Date().getFullYear();
  const toKzt = useCallback(
    (amount: number, c: Currency) => (c === "KZT" ? amount : !rate ? 0 : c === "USD" ? amount * (rate.kzt / rate.usd) : amount * rate.kzt),
    [rate],
  );

  const rows = useMemo(() => {
    const manual = doc.entries.map((e) => ({ key: e.id, date: e.date, kzt: toKzt(e.amount, e.currency), label: e.note, src: "manual" as const, entry: e }));
    const onchain = chain.map((c) => ({ key: `c${c.id}`, date: c.date, kzt: toKzt(c.sol, "SOL"), label: c.title, src: "chain" as const, entry: null }));
    return [...manual, ...onchain].filter((r) => r.date.startsWith(String(year))).sort((a, b) => b.date.localeCompare(a.date));
  }, [doc.entries, chain, toKzt, year]);

  const monthly = useMemo(() => {
    const m = Array(12).fill(0) as number[];
    for (const r of rows) m[Number(r.date.slice(5, 7)) - 1] += r.kzt;
    return m;
  }, [rows]);

  const now = new Date();
  const monthsElapsed = now.getMonth() + 1;
  const opts = { bornAfter1975: doc.bornAfter1975, activeMonths: monthsElapsed, declaredBase: doc.declaredBase };
  const est = estimate(doc.regime, monthly, opts);
  const other = estimate(doc.regime === "self_employed" ? "ip_simplified" : "self_employed", monthly, opts);
  const left = Math.max(0, est.total - doc.paid);
  const projected = estimate(doc.regime, Array(12).fill(est.income / monthsElapsed), { ...opts, activeMonths: 12 });
  const upcoming = deadlines(doc.regime, now).slice(0, 4);
  const maxBar = Math.max(1, ...monthly);

  function addEntry(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(form.amount.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) return;
    update({ entries: [...doc.entries, { id: crypto.randomUUID(), date: form.date, amount, currency: form.currency, note: form.note.slice(0, 80) }] });
    setForm((f) => ({ ...f, amount: "", note: "" }));
  }

  const regimeLabel = (r: Regime) => (r === "self_employed" ? d.regimeSe : d.regimeIp);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-white">{d.title}</h1>
          <p className="max-w-2xl text-sm text-slate-400">{d.subtitle}</p>
        </div>
        {user && (
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span>{d.hello}, <b className="text-white">{user.name || user.id}</b></span>
            <button onClick={logout} className="btn btn-ghost px-3 py-1.5 text-xs">{d.logout}</button>
          </div>
        )}
      </header>

      {ready && !user && (
        <div className="card flex flex-wrap items-center justify-between gap-4 border-sky-400/20 bg-sky-400/5">
          <div className="space-y-1">
            <div className="font-bold text-white">{d.loginTitle}</div>
            <p className="max-w-xl text-sm text-slate-400">{d.loginDesc}</p>
            <p className="text-xs text-slate-500">{d.localOnly}</p>
            {status === "waiting" && <p className="text-xs text-sky-300">{d.loginWaiting}</p>}
            {status === "unavailable" && <p className="text-xs text-amber-300">{d.loginUnavailable}</p>}
          </div>
          <button onClick={login} className="btn btn-purple px-5 py-2.5">{d.loginBtn}</button>
        </div>
      )}

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={d.kpiIncome} value={`${fmt(est.income)} ₸`} />
        <Kpi label={d.kpiTaxDue} value={`${fmt(est.total)} ₸`} sub={`${d.effective}: ${(est.effectiveRate * 100).toFixed(1)}%`} tone="amber" />
        <Kpi label={d.kpiPaid} value={`${fmt(doc.paid)} ₸`} />
        <Kpi label={d.kpiLeft} value={`${fmt(left)} ₸`} tone="teal" sub={`${d.kpiProjection}: ${fmt(projected.total)} ₸ — ${d.kpiProjectionHint}`} />
      </section>

      {(est.warnings.includes("se_monthly_limit") || est.warnings.includes("ip_annual_limit")) && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {est.warnings.includes("se_monthly_limit") && <p>⚠️ {d.warnSe}</p>}
          {est.warnings.includes("ip_annual_limit") && <p>⚠️ {d.warnIp}</p>}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {/* Monthly chart */}
          <section className="card space-y-4">
            <h2 className="font-bold text-white">{d.monthly}</h2>
            <div className="flex h-40 items-end gap-2" role="img" aria-label={d.monthly}>
              {monthly.map((v, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center gap-1.5" title={`${d.months[i]}: ${fmt(v)} ₸`}>
                  <div className="flex w-full flex-1 items-end">
                    <div className={`w-full rounded-t-sm ${i < monthsElapsed ? "bg-teal-400/80" : "bg-white/10"}`} style={{ height: `${(v / maxBar) * 100}%`, minHeight: v ? 4 : 2 }} />
                  </div>
                  <span className="text-[10px] text-slate-500">{d.months[i]}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Entries */}
          <section className="card space-y-4">
            <h2 className="font-bold text-white">{d.income}</h2>
            <form onSubmit={addEntry} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:grid-cols-12">
              <div className="sm:col-span-12 text-xs font-semibold text-slate-300">{d.addIncome}</div>
              <label className="sm:col-span-3"><span className="label">{d.date}</span>
                <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
              <label className="sm:col-span-3"><span className="label">{d.amount}</span>
                <input inputMode="decimal" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="500000" required /></label>
              <label className="sm:col-span-2"><span className="label">{d.currency}</span>
                <select className="input" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}>
                  <option>KZT</option><option>USD</option><option>SOL</option></select></label>
              <label className="sm:col-span-4"><span className="label">{d.note}</span>
                <input className="input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder={d.notePh} /></label>
              <div className="sm:col-span-12"><button className="btn px-5 py-2 text-sm">{d.add}</button></div>
            </form>

            {rows.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500">{d.empty}</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {rows.map((r) => (
                  <li key={r.key} className="flex items-center gap-3 py-2.5 text-sm">
                    <span className="w-24 shrink-0 font-mono text-xs text-slate-500">{r.date}</span>
                    <span className="flex-1 truncate text-slate-200">{r.label || "—"}</span>
                    <span className={`badge ${r.src === "chain" ? "badge-solana" : "badge-purple"}`}>{r.src === "chain" ? d.chain : d.manual}</span>
                    <span className="w-28 text-right font-mono text-slate-100">{fmt(r.kzt)} ₸</span>
                    {r.entry ? (
                      <button aria-label={d.remove} title={d.remove} className="text-slate-500 hover:text-red-400"
                        onClick={() => update({ entries: doc.entries.filter((x) => x.id !== r.entry!.id) })}>✕</button>
                    ) : <span className="w-3" />}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6 lg:col-span-5">
          {/* Settings */}
          <section className="card space-y-4">
            <h2 className="font-bold text-white">{d.settings}</h2>
            <div className="grid grid-cols-2 gap-2">
              {(["self_employed", "ip_simplified"] as const).map((r) => (
                <button key={r} type="button" onClick={() => update({ regime: r })} aria-pressed={doc.regime === r}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${doc.regime === r ? "border-teal-400 bg-teal-400/15 text-teal-200" : "border-white/10 text-slate-400 hover:text-white"}`}>
                  {regimeLabel(r)}
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-slate-400">{doc.regime === "self_employed" ? d.regimeSeHint : d.regimeIpHint}</p>
            {doc.regime === "self_employed" && <p className="text-xs text-amber-300/90">{d.seActivities}</p>}
            {doc.regime === "ip_simplified" && (
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={doc.bornAfter1975} onChange={(e) => update({ bornAfter1975: e.target.checked })} /> {d.born}
              </label>
            )}
            {doc.regime === "ip_simplified" && (
              <label className="block"><span className="label">{d.declared}</span>
                <input inputMode="numeric" className="input" value={doc.declaredBase || ""} placeholder="85000"
                  onChange={(e) => update({ declaredBase: Math.max(0, Number(e.target.value.replace(/\D/g, "")) || 0) })} />
                <span className="mt-1 block text-xs text-slate-500">{d.declaredHint}</span></label>
            )}
            <label className="block"><span className="label">{d.alreadyPaid}</span>
              <input inputMode="numeric" className="input" value={doc.paid || ""} placeholder="0"
                onChange={(e) => update({ paid: Math.max(0, Number(e.target.value.replace(/\D/g, "")) || 0) })} />
              <span className="mt-1 block text-xs text-slate-500">{d.alreadyPaidHint}</span></label>
            <label className="flex items-start gap-2 text-sm text-slate-300">
              <input type="checkbox" className="mt-1" checked={doc.includeChain} onChange={(e) => update({ includeChain: e.target.checked })} />
              <span>{d.onchain}<span className="block text-xs text-slate-500">{publicKey ? d.onchainHint : d.connectWallet}</span></span>
            </label>
          </section>

          {/* Breakdown */}
          <section className="card space-y-3">
            <h2 className="font-bold text-white">{d.breakdown}</h2>
            <dl className="space-y-2 text-sm">
              {doc.regime === "self_employed" ? (
                <Line k={d.seBundle} v={est.tax} />
              ) : (
                <>
                  <Line k={d.tax} v={est.tax} />
                  <Line k={d.opv} v={est.contributions.opv} />
                  {doc.bornAfter1975 && <Line k={d.opvr} v={est.contributions.opvr} />}
                  <Line k={d.so} v={est.contributions.so} />
                  <Line k={d.vosms} v={est.contributions.vosms} />
                </>
              )}
              <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-white"><dt>{d.total}</dt><dd className="font-mono">{fmt(est.total)} ₸</dd></div>
            </dl>
          </section>

          {/* Compare */}
          <section className="card space-y-3">
            <div><h2 className="font-bold text-white">{d.compare}</h2><p className="text-xs text-slate-500">{d.compareHint}</p></div>
            {[est, other].map((e) => (
              <div key={e.regime} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm">
                <span className="text-slate-200">{regimeLabel(e.regime)}</span>
                <span className="flex items-center gap-2 font-mono text-slate-100">
                  {fmt(e.total)} ₸ {e.total <= Math.min(est.total, other.total) && e.income > 0 && <span className="badge badge-solana">{d.cheaper}</span>}
                </span>
              </div>
            ))}
          </section>

          {/* Deadlines */}
          <section className="card space-y-3">
            <h2 className="font-bold text-white">{d.deadlines}</h2>
            <ul className="space-y-2 text-sm">
              {upcoming.map((x) => (
                <li key={x.date + x.kind} className="flex gap-3">
                  <span className="w-24 shrink-0 font-mono text-xs text-amber-300">{x.date}</span>
                  <span className="text-slate-300">{d.dl[x.kind]}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <footer className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-400">
        <div className="font-semibold text-slate-200">{d.disclaimerTitle}</div>
        <p>{d.disclaimer}</p>
        <p>{d.asOf}{rate && ` · ${d.rateNote}: ${fmt(rate.kzt)} ₸`}</p>
        <p>{d.sources}: {SOURCES.map(([n, u], i) => (
          <span key={u}>{i > 0 && " · "}<a className="underline hover:text-white" href={u} target="_blank" rel="noreferrer">{n}</a></span>
        ))}</p>
      </footer>
    </div>
  );
}

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "amber" | "teal" }) {
  const color = tone === "amber" ? "text-amber-300" : tone === "teal" ? "text-teal-300" : "text-white";
  return (
    <div className="card space-y-1.5 p-5">
      <div className="text-xs font-medium text-slate-400">{label}</div>
      <div className={`font-mono text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-[11px] leading-snug text-slate-500">{sub}</div>}
    </div>
  );
}

function Line({ k, v }: { k: string; v: number }) {
  return <div className="flex justify-between text-slate-300"><dt>{k}</dt><dd className="font-mono">{fmt(v)} ₸</dd></div>;
}

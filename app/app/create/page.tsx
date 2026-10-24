"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import SplitDonut from "@/components/SplitDonut";
import BlinkPreview from "@/components/BlinkPreview";
import ShareCard from "@/components/ShareCard";
import { initializeInvoiceIx, PROGRAM_ID } from "@/lib/program";
import { computeSplit, validateSplit } from "@/lib/split";
import { lamportsToSol, solToLamports } from "@/lib/format";
import { errText, log } from "@/lib/log";
import { demoById } from "@/lib/demoWallets";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useProfile } from "@/lib/profile/ProfileContext";
import { useMode } from "@/lib/mode/ModeContext";

const parseKey = (s: string): PublicKey | null => {
  try { return s.trim() ? new PublicKey(s.trim()) : null; } catch { return null; }
};

export default function CreatePage() {
  const { t } = useI18n();
  const { profile } = useProfile();
  const { isDemo } = useMode();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [title, setTitle] = useState("UI/UX Дизайн мобильного приложения");
  const [client, setClient] = useState("Acme Inc. (USA)");
  const [amountStr, setAmountStr] = useState("1.5");
  const [vaultPct, setVaultPct] = useState(1); // 1% Steppe Protocol Fee
  const [useCollab, setUseCollab] = useState(false);
  const [collabPct, setCollabPct] = useState(15);
  const [collabAddr, setCollabAddr] = useState("");
  const [vaultAddr, setVaultAddr] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ creator: string; id: string; sig: string } | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<"blink" | "checkout">("blink");

  // Rates for SOL -> USD -> KZT
  const [rate, setRate] = useState<{ kzt: number; usd: number } | null>(null);

  useEffect(() => {
    fetch("/api/rate")
      .then((r) => r.json())
      .then(setRate)
      .catch(() => setRate({ kzt: 75000, usd: 150 }));
  }, []);

  // Pre-fill collaborator from profile if available
  useEffect(() => {
    if (profile.defaultCollabWallet && !collabAddr) {
      setCollabAddr(profile.defaultCollabWallet);
      setCollabPct(profile.defaultCollabPct || 15);
    }
  }, [profile, collabAddr]);

  const amount = solToLamports(amountStr);
  const vaultBps = Math.round(vaultPct * 100);
  const collabBps = useCollab ? Math.round(collabPct * 100) : 0;
  const collabKey = useCollab ? parseKey(collabAddr) : null;
  // Treasury vault address (or demo vault in demo mode)
  const defaultVaultKey = isDemo ? new PublicKey(demoById("vault").publicKey) : (publicKey || new PublicKey("11111111111111111111111111111111"));
  const vaultKey = parseKey(vaultAddr) || defaultVaultKey;

  const problem = useMemo(() => {
    if (!title.trim()) return t.create.errTitleEmpty;
    if (title.length > 64) return "Заголовок должен содержать не более 64 символов";
    if (!amount || amount <= 0n) return t.create.errAmountInvalid;
    if (vaultAddr.trim() && !parseKey(vaultAddr)) return "Некорректный адрес для отчислений";
    if (useCollab && collabBps > 0 && !collabKey) return t.create.errCollabAddr;
    return validateSplit(vaultBps, collabBps, !!collabKey);
  }, [title, amount, vaultAddr, useCollab, collabBps, collabKey, vaultBps, t]);

  const split = amount ? computeSplit(amount, vaultBps, collabBps) : null;
  const creatorPct = 100 - vaultPct - (useCollab ? collabPct : 0);

  const applyTemplate = (tmplTitle: string, tmplAmount: string) => {
    setTitle(tmplTitle);
    setAmountStr(tmplAmount);
  };

  async function deploy() {
    if (!publicKey || !amount || !vaultKey) return;
    setBusy(true);
    setError(null);
    try {
      const invoiceId = BigInt(Date.now());
      log("info", `Creating invoice #${invoiceId} as ${publicKey.toBase58()} (${lamportsToSol(amount)} SOL, fee ${vaultBps / 100}%, collab ${collabBps / 100}%)`);
      const ix = initializeInvoiceIx({
        creator: publicKey, invoiceId, amount, title: title.trim(), vault: vaultKey,
        vaultBps, collaborator: collabKey, collaboratorBps: collabBps,
      });
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      log("info", "Built transaction, asking wallet to sign and send...");
      const tx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add(ix);
      const sig = await sendTransaction(tx, connection);
      log("info", `Sent: ${sig}. Waiting for confirmation...`);
      const res = await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
      if (res.value.err) throw new Error("Transaction failed on-chain: " + JSON.stringify(res.value.err));
      log("ok", `Invoice created on Devnet. https://solscan.io/tx/${sig}?cluster=devnet`);
      setCreated({ creator: publicKey.toBase58(), id: invoiceId.toString(), sig });
    } catch (e) {
      log("error", `Create failed: ${errText(e)}`);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (created) {
    return (
      <ShareCard
        creator={created.creator} id={created.id} sig={created.sig} title={title}
        amountSol={lamportsToSol(amount ?? 0n)} client={client} vaultPct={vaultPct} collabPct={useCollab ? collabPct : 0}
      />
    );
  }

  const programMissing = PROGRAM_ID.toBase58() === "11111111111111111111111111111111";
  const solNum = parseFloat(amountStr) || 0;
  const usdEst = rate ? (solNum * rate.usd).toFixed(2) : "...";
  const kztEst = rate ? Math.round(solNum * rate.kzt).toLocaleString() : "...";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">{t.create.title}</h1>
        <p className="mt-1 text-sm text-slate-400">{t.create.subtitle}</p>
      </div>

      {/* Preset templates */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400">{t.create.templateQuick}</span>
        <button
          type="button"
          onClick={() => applyTemplate("UI/UX Дизайн мобильного приложения", "1.5")}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-teal-300 hover:bg-white/10 transition-colors"
        >
          {t.create.templateDesign}
        </button>
        <button
          type="button"
          onClick={() => applyTemplate("Разработка смарт-контракта", "5")}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-sky-300 hover:bg-white/10 transition-colors"
        >
          {t.create.templateDev}
        </button>
        <button
          type="button"
          onClick={() => applyTemplate("Техническая консультация и аудит", "0.5")}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-amber-300 hover:bg-white/10 transition-colors"
        >
          {t.create.templateAudit}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left column: Form */}
        <section className="card space-y-4 lg:col-span-7">
          {/* Profile notice */}
          <div className="flex items-center justify-between rounded-xl bg-teal-500/10 border border-teal-500/20 px-3.5 py-2 text-xs">
            <span className="text-teal-300">
              <b>{t.create.contractorProfileNotice}</b> {profile.companyOrName} ({profile.iinBin})
            </span>
            <Link href="/profile" className="text-white underline hover:text-teal-200">
              {t.create.editProfileLink} ↗
            </Link>
          </div>

          <div>
            <label className="label">{t.create.taskTitle}</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.create.taskTitlePlaceholder}
              maxLength={64}
            />
          </div>

          <div>
            <label className="label">{t.create.clientName}</label>
            <input
              className="input"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder={t.create.clientPlaceholder}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="label mb-0">{t.create.amountLabel}</label>
              <span className="text-xs text-slate-400 font-mono">
                {t.create.amountHint} ≈ ${usdEst} USD (≈ {kztEst} ₸)
              </span>
            </div>
            <input
              className="input text-lg font-mono font-semibold"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="1.0"
            />
          </div>

          {/* Steppe Protocol Fee (1%) */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-teal-300">⚡ Steppe Protocol Fee (Комиссия сервиса)</span>
              <span className="font-mono font-bold text-white">{vaultPct}%</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Фиксированная комиссия 1% удерживается смарт-контрактом только в момент успешной оплаты счета. Никаких скрытых платежей.
            </p>
          </div>

          {/* Collaborator split */}
          <div className="rounded-xl border border-white/10 p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-white cursor-pointer">
              <input
                type="checkbox"
                checked={useCollab}
                onChange={(e) => setUseCollab(e.target.checked)}
                className="h-4 w-4 rounded accent-teal-400"
              />
              {t.create.collabCheckbox}
            </label>

            {useCollab && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{t.create.collabShare}</span>
                  <span className="font-bold text-sky-400 font-mono">{collabPct}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={collabPct}
                  onChange={(e) => setCollabPct(+e.target.value)}
                  className="w-full accent-sky-400"
                />
                <div>
                  <label className="label">{t.create.collabAddr}</label>
                  <input
                    className="input font-mono text-xs"
                    placeholder={t.create.collabPlaceholder}
                    value={collabAddr}
                    onChange={(e) => setCollabAddr(e.target.value)}
                  />
                  {isDemo && (
                    <button
                      type="button"
                      className="mt-1.5 text-xs text-teal-300 underline"
                      onClick={() => setCollabAddr(demoById("collaborator").publicKey)}
                    >
                      {t.create.useDemoCollab}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Button & Errors */}
          <div>
            {programMissing && (
              <p className="mb-3 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-300">
                Program ID не сконфигурирован (NEXT_PUBLIC_PROGRAM_ID).
              </p>
            )}
            {!publicKey && (
              <p className="mb-3 text-xs text-slate-400">
                Кошелек не подключен. Подключите Phantom/Solflare или включите Демо-режим в шапке.
              </p>
            )}
            {problem && <p className="mb-3 text-xs text-amber-300">{problem}</p>}
            {error && <p className="mb-3 break-words text-xs text-red-400">{error}</p>}

            <button
              className="btn w-full text-base py-3"
              disabled={!publicKey || !!problem || busy || programMissing}
              onClick={deploy}
            >
              {busy ? t.create.deploying : publicKey ? t.create.deployBtn : t.create.needWallet}
            </button>
          </div>
        </section>

        {/* Right column: Live Auto-split & Live Previews */}
        <section className="space-y-6 lg:col-span-5">
          {/* Donut & Breakdown */}
          <div className="card space-y-4">
            <h2 className="font-bold text-white text-base">⚡ Авто-распределение платежа (Ончейн)</h2>
            <SplitDonut
              center={amount ? `${lamportsToSol(amount)} SOL` : "—"}
              parts={[
                { label: "Исполнитель", value: creatorPct, color: "#14c8a4" },
                { label: "Steppe Fee", value: vaultPct, color: "#f59e0b" },
                ...(useCollab ? [{ label: "Напарник", value: collabPct, color: "#38bdf8" }] : []),
              ]}
            />
            {split && (
              <div className="space-y-2 text-xs border-t border-white/5 pt-3">
                <div className="flex justify-between">
                  <span className="text-teal-300 font-semibold">Вам на кошелек ({creatorPct}%):</span>
                  <span className="font-mono text-white font-bold">{lamportsToSol(split.creator)} SOL</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Комиссия протокола ({vaultPct}%):</span>
                  <span className="font-mono">{lamportsToSol(split.vault)} SOL</span>
                </div>
                {useCollab && (
                  <div className="flex justify-between text-sky-300">
                    <span>Напарнику ({collabPct}%):</span>
                    <span className="font-mono font-bold">{lamportsToSol(split.collaborator)} SOL</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live Preview Tabs */}
          <div className="space-y-3">
            <div className="flex rounded-lg bg-black/40 p-1 border border-white/5 text-xs">
              <button
                onClick={() => setActivePreviewTab("blink")}
                className={`flex-1 py-1 font-semibold rounded-md transition-all ${
                  activePreviewTab === "blink"
                    ? "bg-teal-400 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t.create.previewBlink}
              </button>
              <button
                onClick={() => setActivePreviewTab("checkout")}
                className={`flex-1 py-1 font-semibold rounded-md transition-all ${
                  activePreviewTab === "checkout"
                    ? "bg-teal-400 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t.create.previewCheckout}
              </button>
            </div>

            {activePreviewTab === "blink" ? (
              <BlinkPreview
                iconUrl="/preview-banner.svg"
                domain="steppeinvoice.app"
                title={`${title || "Инвойс"} — ${amount ? lamportsToSol(amount) : "..."} SOL`}
                description={`⚡ Авто-сплит: ${creatorPct}% Исполнителю${useCollab ? ` · ${collabPct}% Напарнику` : ""} · 1% Steppe Fee`}
              />
            ) : (
              <div className="card space-y-3 border-dashed border-teal-500/30 text-center py-6">
                <span className="badge badge-solana">Превью чекаута для клиента</span>
                <div className="text-lg font-bold text-white">{title || "Название задачи"}</div>
                <div className="text-3xl font-extrabold font-mono text-teal-300">
                  {amount ? lamportsToSol(amount) : "0"} SOL
                </div>
                <p className="text-xs text-slate-400">
                  Заказчик: {client || "Acme Inc."} · Оплата в 1 клик через Phantom
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

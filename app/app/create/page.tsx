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
import { lamportsToSol, solToLamports, solscanTx } from "@/lib/format";
import { IS_MAINNET, NETWORK_LABEL, TREASURY } from "@/lib/cluster";
import { errText, log } from "@/lib/log";
import { demoById } from "@/lib/demoWallets";
import { useI18n } from "@/lib/i18n/I18nContext";
import { extra } from "@/lib/i18n/extra";
import { useProfile } from "@/lib/profile/ProfileContext";
import { useMode } from "@/lib/mode/ModeContext";
import { getSavedCollaborators, SavedCollaborator } from "@/lib/profile/collaborators";

const parseKey = (s: string): PublicKey | null => {
  try {
    return s.trim() ? new PublicKey(s.trim()) : null;
  } catch {
    return null;
  }
};

export default function CreatePage() {
  const { t, lang } = useI18n();
  const X = extra[lang];
  const { profile, saveProfile } = useProfile();
  const { isDemo } = useMode();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [title, setTitle] = useState("");
  // The default title follows the interface language until the user (or the Telegram bot) sets one.
  const [titleTouched, setTitleTouched] = useState(false);
  useEffect(() => {
    if (!titleTouched) setTitle(extra[lang].create.templateDesign);
  }, [lang, titleTouched]);
  const [client, setClient] = useState("Acme Inc. (USA)");
  const [amountStr, setAmountStr] = useState("1.5");
  const [vaultPct, setVaultPct] = useState(1); // 1% Steppe Protocol Fee
  const [useCollab, setUseCollab] = useState(false);
  const [collabPct, setCollabPct] = useState(15);
  const [collabAddr, setCollabAddr] = useState("");
  const [collabName, setCollabName] = useState("");
  const [showCollabInAct, setShowCollabInAct] = useState(true);
  const [vaultAddr, setVaultAddr] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{
    creator: string;
    id: string;
    sig: string;
  } | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<"blink" | "checkout">("blink");

  // Requisites for unauthenticated users or inline editing
  const [contractorName, setContractorName] = useState(profile.companyOrName || "");
  const [contractorIin, setContractorIin] = useState(profile.iinBin || "");
  const [savedRequisitesNotice, setSavedRequisitesNotice] = useState(false);

  // Saved collaborators from directory
  const [savedCollabs, setSavedCollabs] = useState<SavedCollaborator[]>([]);

  // Exchange rate for fiat estimates
  const [rate, setRate] = useState<{ kzt: number; usd: number } | null>(null);

  useEffect(() => {
    fetch("/api/rate")
      .then((r) => r.json())
      .then(setRate)
      .catch(() => setRate({ kzt: 75000, usd: 150 }));
  }, []);

  // Draft handed over from the Telegram bot (/new): /create?title=…&amount=…&client=…
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const qt = q.get("title"), qa = q.get("amount"), qc = q.get("client");
    if (qt) {
      setTitleTouched(true);
      setTitle(qt.slice(0, 80));
    }
    if (qa && /^\d+(\.\d{1,9})?$/.test(qa)) setAmountStr(qa);
    if (qc) setClient(qc.slice(0, 80));
  }, []);

  useEffect(() => {
    if (profile.companyOrName) setContractorName(profile.companyOrName);
    if (profile.iinBin) setContractorIin(profile.iinBin);
  }, [profile]);

  // Load collaborators when wallet is connected
  useEffect(() => {
    if (publicKey) {
      const list = getSavedCollaborators(publicKey.toBase58());
      setSavedCollabs(list);
    } else {
      setSavedCollabs([]);
    }
  }, [publicKey]);

  // Read URL query params (e.g. from Collaborator Directory "/create?collabWallet=...&collabPct=...")
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qWallet = params.get("collabWallet");
      const qPct = params.get("collabPct");
      if (qWallet) {
        setUseCollab(true);
        setCollabAddr(qWallet);
        if (qPct) setCollabPct(Number(qPct));
      }
    }
  }, []);

  const handleSelectSavedCollab = (collabId: string) => {
    const found = savedCollabs.find((c) => c.id === collabId);
    if (found) {
      setCollabAddr(found.wallet);
      setCollabPct(found.defaultPct);
      setCollabName(found.name);
    }
  };

  const handleSaveInlineRequisites = () => {
    saveProfile({
      ...profile,
      companyOrName: contractorName.trim() || profile.companyOrName,
      iinBin: contractorIin.trim() || profile.iinBin,
    });
    setSavedRequisitesNotice(true);
    setTimeout(() => setSavedRequisitesNotice(false), 3000);
  };

  const amount = solToLamports(amountStr);
  const vaultBps = Math.round(vaultPct * 100);
  const collabBps = useCollab ? Math.round(collabPct * 100) : 0;
  const collabKey = useCollab ? parseKey(collabAddr) : null;

  // The service fee goes to the platform treasury. Without one (devnet only) it falls back to the creator.
  const treasuryKey = parseKey(TREASURY);
  const defaultVaultKey = isDemo
    ? new PublicKey(demoById("vault").publicKey)
    : treasuryKey || publicKey || new PublicKey("11111111111111111111111111111111");
  const vaultKey = parseKey(vaultAddr) || defaultVaultKey;

  const problem = useMemo(() => {
    if (!title.trim()) return t.create.errTitleEmpty;
    if (new TextEncoder().encode(title.trim()).length > 64) return X.create.errTitleLong;
    if (!amount || amount <= 0n) return t.create.errAmountInvalid;
    if (vaultAddr.trim() && !parseKey(vaultAddr)) return X.create.errVaultAddr;
    if (IS_MAINNET && !treasuryKey) return X.create.noTreasury;
    if (useCollab && collabBps > 0 && !collabKey) return t.create.errCollabAddr;
    return validateSplit(vaultBps, collabBps, !!collabKey);
  }, [title, amount, vaultAddr, useCollab, collabBps, collabKey, vaultBps, treasuryKey, t, X]);

  const split = amount ? computeSplit(amount, vaultBps, collabBps) : null;
  const creatorPct = 100 - vaultPct - (useCollab ? collabPct : 0);

  const applyTemplate = (tmplTitle: string, tmplAmount: string) => {
    setTitleTouched(true);
    setTitle(tmplTitle);
    setAmountStr(tmplAmount);
  };

  async function deploy() {
    if (!publicKey || !amount || !vaultKey) return;
    setBusy(true);
    setError(null);
    try {
      const invoiceId = BigInt(Date.now());
      log(
        "info",
        `Creating invoice #${invoiceId} as ${publicKey.toBase58()} (${lamportsToSol(
          amount
        )} SOL, fee ${vaultBps / 100}%, collab ${collabBps / 100}%)`
      );
      const ix = initializeInvoiceIx({
        creator: publicKey,
        invoiceId,
        amount,
        title: title.trim(),
        vault: vaultKey,
        vaultBps,
        collaborator: collabKey,
        collaboratorBps: collabBps,
      });
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const tx = new Transaction({
        feePayer: publicKey,
        blockhash,
        lastValidBlockHeight,
      }).add(ix);
      const sig = await sendTransaction(tx, connection);
      log("info", `Sent: ${sig}. Waiting for confirmation...`);
      const res = await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        "confirmed"
      );
      if (res.value.err)
        throw new Error("Transaction failed on-chain: " + JSON.stringify(res.value.err));
      log("ok", `Invoice created on ${NETWORK_LABEL}. ${solscanTx(sig)}`);

      // Store invoice metadata for the Act of Completed Works
      try {
        const metadata = {
          client,
          contractorName: contractorName || profile.companyOrName,
          contractorIin: contractorIin || profile.iinBin,
          collabInAct: useCollab ? showCollabInAct : false,
          collabName: collabName || (collabKey ? collabKey.toBase58() : ""),
          collabPct: useCollab ? collabPct : 0,
        };
        localStorage.setItem(`steppe_inv_meta_${invoiceId.toString()}`, JSON.stringify(metadata));
      } catch (e) {
        console.error("Failed to store invoice metadata", e);
      }

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
        creator={created.creator}
        id={created.id}
        sig={created.sig}
        title={title}
        amountSol={lamportsToSol(amount ?? 0n)}
        client={client}
        vaultPct={vaultPct}
        collabPct={useCollab ? collabPct : 0}
        collabInAct={useCollab ? showCollabInAct : false}
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
        <h1 className="text-3xl font-semibold text-white">{t.create.title}</h1>
        <p className="mt-1 text-sm text-slate-400">{t.create.subtitle}</p>
      </div>

      {/* Preset templates */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400">{t.create.templateQuick}</span>
        <button
          type="button"
          onClick={() => applyTemplate(X.create.templateDesign, "1.5")}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-teal-300 hover:bg-white/10 transition-colors"
        >
          {t.create.templateDesign}
        </button>
        <button
          type="button"
          onClick={() => applyTemplate(X.create.templateDev, "5")}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-sky-300 hover:bg-white/10 transition-colors"
        >
          {t.create.templateDev}
        </button>
        <button
          type="button"
          onClick={() => applyTemplate(X.create.templateConsult, "0.5")}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-amber-300 hover:bg-white/10 transition-colors"
        >
          {t.create.templateAudit}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left column: Form */}
        <section className="card space-y-4 lg:col-span-7">
          {/* Notice: If connected, show contractor profile summary; if not, show inline requisites inputs */}
          {publicKey ? (
            <div className="flex items-center justify-between rounded-xl bg-teal-500/10 border border-teal-500/20 px-3.5 py-2.5 text-xs">
              <div className="space-y-0.5">
                <span className="text-teal-300 font-semibold">
                  {t.create.contractorProfileNotice}
                </span>
                <p className="text-white font-medium">
                  {profile.companyOrName} · {X.create.iinWord}: {profile.iinBin}
                </p>
              </div>
              <Link href="/profile" className="text-teal-300 underline hover:text-white shrink-0 ml-3">
                {t.create.editProfileLink} ↗
              </Link>
            </div>
          ) : (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3.5 text-xs space-y-2.5">
              <div className="text-amber-300 font-bold flex items-center gap-1.5">
                <span>⚠️</span> {t.create.notAuthorizedNotice}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label text-[11px]">{X.create.reqName}</label>
                  <input
                    className="input text-xs"
                    placeholder={X.create.reqNamePh}
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label text-[11px]">{X.create.reqIin}</label>
                  <input
                    className="input font-mono text-xs"
                    placeholder="940512301824"
                    maxLength={12}
                    value={contractorIin}
                    onChange={(e) => setContractorIin(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 text-[11px]">{t.create.saveRequisitesPrompt}</span>
                <button
                  type="button"
                  onClick={handleSaveInlineRequisites}
                  className="text-xs text-amber-300 underline font-semibold hover:text-white"
                >
                  {t.create.saveRequisitesBtn}
                </button>
              </div>
              {savedRequisitesNotice && (
                <div className="text-[11px] text-teal-300">{X.create.reqSaved}</div>
              )}
            </div>
          )}

          <div>
            <label className="label">{t.create.taskTitle}</label>
            <input
              id="input-task-title"
              className="input"
              value={title}
              onChange={(e) => {
                setTitleTouched(true);
                setTitle(e.target.value);
              }}
              placeholder={t.create.taskTitlePlaceholder}
            />
          </div>

          <div>
            <label className="label">{t.create.clientName}</label>
            <input
              id="input-client-name"
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
              id="input-amount"
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
              <span className="font-semibold text-teal-300">{t.create.feeTitle}</span>
              <span className="font-mono font-bold text-white">{vaultPct}%</span>
            </div>
            <p className="text-slate-400 leading-relaxed">{t.create.feeDesc}</p>
          </div>

          {/* Collaborator split section */}
          <div className="rounded-xl border border-white/10 p-4 space-y-3.5 bg-black/20">
            <label className="flex items-center gap-2 text-sm font-semibold text-white cursor-pointer">
              <input
                id="checkbox-use-collab"
                type="checkbox"
                checked={useCollab}
                onChange={(e) => setUseCollab(e.target.checked)}
                className="h-4 w-4 rounded accent-teal-400 cursor-pointer"
              />
              {t.create.collabCheckbox}
            </label>

            {useCollab && (
              <div className="space-y-3.5 pt-2 border-t border-white/10">
                {/* Saved Collaborator Dropdown */}
                {savedCollabs.length > 0 && (
                  <div>
                    <label className="label">{t.create.selectSavedCollab}</label>
                    <select
                      id="select-saved-collab"
                      onChange={(e) => handleSelectSavedCollab(e.target.value)}
                      defaultValue=""
                      className="input text-xs bg-[#171b21] cursor-pointer"
                    >
                      <option value="" disabled>
                        {t.create.selectSavedCollabPlaceholder}
                      </option>
                      {savedCollabs.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.defaultPct}% ({c.wallet.slice(0, 6)}...{c.wallet.slice(-4)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
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
                </div>

                <div>
                  <label className="label">{t.create.collabAddr}</label>
                  <input
                    id="input-collab-addr"
                    className="input font-mono text-xs"
                    placeholder={t.create.collabPlaceholder}
                    value={collabAddr}
                    onChange={(e) => setCollabAddr(e.target.value)}
                  />
                  {isDemo && (
                    <button
                      id="btn-use-demo-collab"
                      type="button"
                      className="mt-1.5 text-xs text-teal-300 underline hover:text-white"
                      onClick={() => {
                        const demoCollab = demoById("collaborator");
                        setCollabAddr(demoCollab.publicKey);
                        setCollabName(X.create.demoCollabName);
                      }}
                    >
                      {t.create.useDemoCollab}
                    </button>
                  )}
                </div>

                {/* Checkbox: Show Collaborator in Act of Completed Works */}
                <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 space-y-1.5">
                  <label className="flex items-start gap-2.5 text-xs font-semibold text-white cursor-pointer">
                    <input
                      id="checkbox-show-collab-in-act"
                      type="checkbox"
                      checked={showCollabInAct}
                      onChange={(e) => setShowCollabInAct(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded accent-sky-400 cursor-pointer shrink-0"
                    />
                    <span>{t.create.showCollabInAct}</span>
                  </label>
                  <p className="text-[11px] text-slate-300 pl-6 leading-relaxed">
                    {t.create.showCollabInActHint}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Button & Errors */}
          <div>
            {programMissing && (
              <p className="mb-3 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-300">
                {X.create.noProgram}
              </p>
            )}
            {!publicKey && (
              <p className="mb-3 text-xs text-slate-400">
                {X.create.noWallet}
              </p>
            )}
            {problem && <p className="mb-3 text-xs text-amber-300">{problem}</p>}
            {error && <p className="mb-3 break-words text-xs text-red-400">{error}</p>}

            <button
              id="btn-deploy-invoice"
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
            <h2 className="font-bold text-white text-base">{X.create.splitTitle}</h2>
            <SplitDonut
              center={amount ? `${lamportsToSol(amount)} SOL` : "—"}
              parts={[
                { label: X.create.partYou, value: creatorPct, color: "#8fb5a6" },
                { label: X.create.partFee, value: vaultPct, color: "#c7b186" },
                ...(useCollab ? [{ label: X.create.partCollab, value: collabPct, color: "#8ba3c1" }] : []),
              ]}
            />
            {split && (
              <div className="space-y-2 text-xs border-t border-white/5 pt-3">
                <div className="flex justify-between">
                  <span className="text-teal-300 font-semibold">{X.create.youGet(creatorPct)}</span>
                  <span className="font-mono text-white font-bold">
                    {lamportsToSol(split.creator)} SOL
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{X.create.feeLine(vaultPct)}</span>
                  <span className="font-mono">{lamportsToSol(split.vault)} SOL</span>
                </div>
                {useCollab && (
                  <div className="flex justify-between text-sky-300">
                    <span>{X.create.collabLine(collabPct)}</span>
                    <span className="font-mono font-bold">
                      {lamportsToSol(split.collaborator)} SOL
                    </span>
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
                title={`${title || X.create.invoiceFallback} — ${amount ? lamportsToSol(amount) : "..."} SOL`}
                description={X.share.blinkDesc(creatorPct, useCollab ? collabPct : 0, vaultPct)}
              />
            ) : (
              <div className="card space-y-3 border-dashed border-teal-500/30 text-center py-6">
                <span className="badge badge-solana">{X.create.checkoutPreview}</span>
                <div className="text-lg font-bold text-white">{title || X.create.taskFallback}</div>
                <div className="text-3xl font-semibold font-mono text-teal-300">
                  {amount ? lamportsToSol(amount) : "0"} SOL
                </div>
                <p className="text-xs text-slate-400">
                  {X.create.clientLine(client || "Acme Inc.")}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

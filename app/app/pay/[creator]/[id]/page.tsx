"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { use, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import confetti from "canvas-confetti";
import type { WalletName } from "@solana/wallet-adapter-base";
import { payInvoiceIx } from "@/lib/program";
import { useInvoice } from "@/lib/useInvoice";
import { computeSplit } from "@/lib/split";
import { lamportsToSol, pct, short, solscanAddr, solscanTx } from "@/lib/format";
import { errText, log } from "@/lib/log";
import { useI18n } from "@/lib/i18n/I18nContext";
import { extra } from "@/lib/i18n/extra";
import { useMode } from "@/lib/mode/ModeContext";

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function PayPage({ params }: { params: Promise<{ creator: string; id: string }> }) {
  const { creator, id } = use(params);
  const { t, lang } = useI18n();
  const X = extra[lang];
  const { isDemo } = useMode();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, select, connect } = useWallet();
  const { invoice, loading, error, paySig, reload } = useInvoice(creator, id);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [justPaid, setJustPaid] = useState<string | null>(null);
  const [rate, setRate] = useState<{ kzt: number; usd: number } | null>(null);

  useEffect(() => {
    fetch("/api/rate")
      .then((r) => r.json())
      .then(setRate)
      .catch(() => setRate({ kzt: 75000, usd: 150 }));
  }, []);

  if (loading && !invoice) {
    return (
      <div className="card mx-auto max-w-lg text-center py-12 space-y-3">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-400 border-t-transparent"></div>
        </div>
        <p className="text-slate-400 text-sm">{t.common.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card mx-auto max-w-lg text-center py-8 space-y-3">
        <div className="text-3xl text-red-400">⚠️</div>
        <h1 className="text-lg font-bold text-white">{t.common.error}</h1>
        <p className="text-red-400 text-xs">{error}</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="card mx-auto max-w-lg text-center py-10 space-y-3">
        <div className="text-4xl"></div>
        <h1 className="text-xl font-bold text-white">{t.pay.notFoundTitle}</h1>
        <p className="text-slate-400 text-xs">{t.pay.notFoundDesc}</p>
      </div>
    );
  }

  const split = computeSplit(invoice.amount, invoice.vaultBps, invoice.collaboratorBps);
  const sig = justPaid ?? paySig;
  const paid = invoice.isPaid || !!justPaid;

  const solVal = Number(invoice.amount) / 1e9;
  const usdVal = rate ? (solVal * rate.usd).toFixed(2) : "...";
  const kztVal = rate ? Math.round(solVal * rate.kzt).toLocaleString() : "...";

  async function pay() {
    if (!publicKey || !invoice) return;
    setBusy(true);
    setErr(null);
    try {
      log("info", `Paying invoice #${invoice.invoiceId} (${lamportsToSol(invoice.amount)} SOL) from ${publicKey.toBase58()}`);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const tx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add(
        payInvoiceIx(invoice, publicKey)
      );
      const s = await sendTransaction(tx, connection);
      log("info", `Sent: ${s}. Waiting for confirmation...`);
      const res = await connection.confirmTransaction({ signature: s, blockhash, lastValidBlockHeight }, "confirmed");
      if (res.value.err) throw new Error("Payment failed on-chain: " + JSON.stringify(res.value.err));
      log("ok", `Paid. Split settled atomically. https://solscan.io/tx/${s}?cluster=devnet`);
      setJustPaid(s);
      // Server re-verifies on-chain, then pings the freelancer's Telegram. Best effort.
      fetch("/api/telegram/paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creator, id }),
      }).catch(() => {});
      confetti({ colors: ["#8fb5a6", "#c7b186", "#e9e7e2"], particleCount: 160, spread: 90, origin: { y: 0.6 } });
      setTimeout(() => confetti({ colors: ["#8fb5a6", "#c7b186", "#e9e7e2"], particleCount: 100, angle: 60, spread: 70, origin: { x: 0 } }), 250);
      setTimeout(() => confetti({ colors: ["#8fb5a6", "#c7b186", "#e9e7e2"], particleCount: 100, angle: 120, spread: 70, origin: { x: 1 } }), 250);
      await reload();
    } catch (e) {
      log("error", `Payment failed: ${errText(e)}`);
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  // Demo 1-click test payment
  const payAsDemoClient = async () => {
    select("Demo Client 1" as WalletName);
    setTimeout(async () => {
      try {
        await connect();
        await pay();
      } catch {
        // connect error
      }
    }, 200);
  };

  const rows: [string, string, bigint][] = [
    [t.pay.creatorShare, invoice.creator.toBase58(), split.creator],
    [t.pay.protocolFee, invoice.vaultRecipient.toBase58(), split.vault],
    ...(invoice.collaborator
      ? [
          [
            t.pay.collabShare + " (" + pct(invoice.collaboratorBps) + ")",
            invoice.collaborator.toBase58(),
            split.collaborator,
          ] as [string, string, bigint],
        ]
      : []),
  ];

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Checkout Card */}
      <div className="card space-y-5 text-center p-8">
        <div className="flex justify-center">
          <span className="badge badge-solana">{t.pay.verifiedBadge}</span>
        </div>

        <h1 className="text-2xl font-bold text-white">{invoice.title}</h1>

        <div className="space-y-1">
          <div className="text-5xl font-black font-mono tracking-tight text-white">
            {lamportsToSol(invoice.amount)} <span className="text-2xl text-teal-400">SOL</span>
          </div>
          <div className="text-sm font-mono text-slate-400">
            ≈ ${usdVal} USD <span className="text-slate-600">|</span> ≈ {kztVal} ₸
          </div>
        </div>

        <div className="text-xs text-slate-400">
          {t.pay.fromCreator}{" "}
          <a
            className="font-mono text-teal-300 underline hover:text-white"
            href={solscanAddr(invoice.creator.toBase58())}
            target="_blank"
            rel="noreferrer"
          >
            {short(invoice.creator.toBase58())}
          </a>
        </div>

        {paid ? (
          <div className="space-y-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-6 animate-fadeIn">
            <div className="text-4xl"></div>
            <div className="text-lg font-bold text-emerald-300">{t.pay.paidTitle}</div>
            <p className="text-xs text-slate-300">{t.pay.paidDesc}</p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              {sig && (
                <a className="btn btn-ghost text-xs" href={solscanTx(sig)} target="_blank" rel="noreferrer">
                  {t.common.solscan}
                </a>
              )}
              <Link
                className="btn bg-emerald-400 text-slate-950 text-xs font-bold"
                href={`/invoice/${creator}/${id}/act`}
              >
                {t.pay.openActBtn} →
              </Link>
            </div>
          </div>
        ) : publicKey ? (
          <div className="space-y-2">
            <button id="btn-pay-invoice" className="btn w-full text-base py-3 font-bold" onClick={pay} disabled={busy}>
              {busy ? t.pay.payingBtn : `${t.pay.payBtn} ${lamportsToSol(invoice.amount)} SOL`}
            </button>
            <p className="text-[11px] text-slate-500">
              {X.pay.signNote}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 pt-2">
            <WalletMultiButton>{t.pay.connectPrompt}</WalletMultiButton>
            {isDemo && (
              <button
                id="btn-demo-pay"
                onClick={payAsDemoClient}
                className="btn btn-ghost text-xs border-amber-400/40 text-amber-300 hover:bg-amber-400/20"
              >
                {t.pay.demoPayBtn}
              </button>
            )}
            <span className="text-[11px] text-slate-500">Phantom, Solflare, Backpack</span>
          </div>
        )}

        {err && <p className="break-words rounded-lg bg-red-500/10 p-2.5 text-xs text-red-400">{err}</p>}
      </div>

      {/* On-chain split breakdown */}
      <div className="card space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-teal-300">
          {t.pay.splitBreakdown}
        </h2>
        <ul className="divide-y divide-white/5 text-xs">
          {rows.map(([label, addr, amt]) => (
            <li key={label + addr} className="flex items-center justify-between py-2.5">
              <div>
                <span className="text-white font-medium">{label}</span>
                <span className="ml-2 font-mono text-[10px] text-slate-500">{short(addr)}</span>
              </div>
              <span className="font-mono font-bold text-teal-400">{lamportsToSol(amt)} SOL</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

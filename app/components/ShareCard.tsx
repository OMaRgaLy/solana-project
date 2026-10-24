"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BlinkPreview from "./BlinkPreview";
import { solscanTx } from "@/lib/format";
import { fetchInvoice } from "@/lib/program";
import { useI18n } from "@/lib/i18n/I18nContext";

type Props = {
  creator: string;
  id: string;
  sig: string;
  title: string;
  amountSol: string;
  client: string;
  vaultPct: number;
  collabPct: number;
};

export default function ShareCard(p: Props) {
  const { t } = useI18n();
  const { connection } = useConnection();
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isPaidOnChain, setIsPaidOnChain] = useState(false);

  useEffect(() => {
    if (!origin) setOrigin(window.location.origin);
  }, [origin]);

  const payPath = `/pay/${p.creator}/${p.id}?client=${encodeURIComponent(p.client)}`;
  const payUrl = `${origin}${payPath}`;
  const actionUrl = `${origin}/api/actions/invoice/${p.creator}/${p.id}`;
  const blinkUrl = `https://dial.to/?action=${encodeURIComponent(`solana-action:${actionUrl}`)}`;

  const readyMessage = t.share.shareMsgTemplate(p.title, p.amountSol, payUrl);

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `💸 Invoice "${p.title}" — ${p.amountSol} SOL. Pay in 1-click on Solana:`
  )}&url=${encodeURIComponent(blinkUrl)}&hashtags=${encodeURIComponent("Solana,Blinks,SteppeInvoice")}`;

  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(payUrl)}&text=${encodeURIComponent(
    `💸 Инвойс "${p.title}" на ${p.amountSol} SOL.\nОплата в 1 клик:`
  )}`;

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(readyMessage)}`;

  const creatorPct = 100 - p.vaultPct - p.collabPct;

  // Generate QR Code
  useEffect(() => {
    if (payUrl) {
      QRCode.toDataURL(payUrl, { width: 240, margin: 1, color: { dark: "#000000", light: "#ffffff" } })
        .then(setQrCodeDataUrl)
        .catch(() => {});
    }
  }, [payUrl]);

  // Payment Radar: listen on-chain for payment
  const checkPaymentStatus = useCallback(async () => {
    if (isPaidOnChain) return;
    try {
      const inv = await fetchInvoice(connection, new PublicKey(p.creator), BigInt(p.id));
      if (inv && inv.isPaid) {
        setIsPaidOnChain(true);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => confetti({ particleCount: 100, angle: 60, spread: 60, origin: { x: 0 } }), 300);
        setTimeout(() => confetti({ particleCount: 100, angle: 120, spread: 60, origin: { x: 1 } }), 300);
      }
    } catch {
      // ignore
    }
  }, [connection, p.creator, p.id, isPaidOnChain]);

  useEffect(() => {
    const interval = setInterval(checkPaymentStatus, 4000);
    return () => clearInterval(interval);
  }, [checkPaymentStatus]);

  const copy = async (k: string, v: string) => {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(k);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header alert */}
      <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xl font-bold text-teal-300 flex items-center gap-2">
            <span>✅</span> {t.share.titleSuccess}
          </div>
          <p className="text-xs text-slate-300 mt-0.5">{t.share.subtitleSuccess}</p>
        </div>
        <a
          className="btn btn-ghost text-xs py-2 px-3.5 border-teal-500/30 text-teal-300"
          href={solscanTx(p.sig)}
          target="_blank"
          rel="noreferrer"
        >
          {t.share.viewSolscan}
        </a>
      </div>

      {/* Realtime payment radar notice */}
      {isPaidOnChain ? (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/20 p-5 text-center space-y-3 animate-bounce">
          <div className="text-3xl">🎉</div>
          <div className="text-xl font-bold text-emerald-300">{t.share.paidDetected}</div>
          <Link
            href={`/invoice/${p.creator}/${p.id}/act`}
            className="btn bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 shadow-lg inline-block"
          >
            {t.share.openAct}
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center gap-3 text-xs text-slate-400">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping"></span>
          <span>{t.share.waitingPayment}</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Multi-channel sharing suite */}
        <section className="card space-y-5 lg:col-span-7">
          <h2 className="text-lg font-bold text-white">{t.share.shareHeading}</h2>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href={tgUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/15 py-3 text-xs font-bold text-sky-300 hover:bg-sky-500/25 transition-all"
            >
              <span className="text-base">✈️</span> {t.share.shareTg}
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 py-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all"
            >
              <span className="text-base">💬</span> {t.share.shareWa}
            </a>
            <a
              href={xUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-bold text-white hover:bg-white/20 transition-all"
            >
              <span className="text-base">𝕏</span> {t.share.shareX}
            </a>
          </div>

          {/* Copy Links */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="label">{t.share.copyCheckout}</label>
              <div className="flex gap-2">
                <input readOnly className="input font-mono text-xs text-slate-300" value={payUrl} />
                <button className="btn btn-ghost text-xs whitespace-nowrap" onClick={() => copy("pay", payUrl)}>
                  {copied === "pay" ? t.common.copied : t.common.copy}
                </button>
              </div>
            </div>

            <div>
              <label className="label">{t.share.copyBlink}</label>
              <div className="flex gap-2">
                <input readOnly className="input font-mono text-xs text-slate-300" value={blinkUrl} />
                <button className="btn btn-ghost text-xs whitespace-nowrap" onClick={() => copy("blink", blinkUrl)}>
                  {copied === "blink" ? t.common.copied : t.common.copy}
                </button>
              </div>
            </div>

            <div>
              <label className="label">{t.share.copyMessage}</label>
              <div className="flex gap-2">
                <textarea
                  readOnly
                  rows={2}
                  className="input font-sans text-xs text-slate-300 resize-none"
                  value={readyMessage}
                />
                <button className="btn btn-ghost text-xs whitespace-nowrap self-stretch" onClick={() => copy("msg", readyMessage)}>
                  {copied === "msg" ? t.common.copied : t.common.copy}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <Link href={payPath} className="btn text-xs py-2 px-4">
              {t.share.openCheckout} →
            </Link>
            <Link href={`/invoice/${p.creator}/${p.id}/act`} className="text-xs text-teal-300 underline hover:text-white">
              {t.share.openAct}
            </Link>
          </div>
        </section>

        {/* Right Column: QR Code & Blink Preview */}
        <section className="space-y-6 lg:col-span-5">
          {/* QR Code Card */}
          <div className="card text-center space-y-3 flex flex-col items-center">
            <h3 className="font-bold text-white text-sm">{t.share.qrTitle}</h3>
            {qrCodeDataUrl ? (
              <div className="rounded-2xl bg-white p-3 shadow-lg">
                <img src={qrCodeDataUrl} alt="Invoice QR Code" className="h-44 w-44" />
              </div>
            ) : (
              <div className="h-44 w-44 bg-white/5 rounded-2xl animate-pulse"></div>
            )}
            <p className="text-xs text-slate-400 max-w-xs">{t.share.qrHint}</p>
          </div>

          {/* Blink Preview */}
          <BlinkPreview
            iconUrl={`${origin}/api/og/invoice?creator=${p.creator}&id=${p.id}`}
            domain={origin.replace(/^https?:\/\//, "") || "steppeinvoice.app"}
            title={`${p.title} — ${p.amountSol} SOL`}
            description={`⚡ Авто-сплит: ${creatorPct}% Исполнителю${p.collabPct ? ` · ${p.collabPct}% Напарнику` : ""} · 1% Steppe Fee`}
          />
        </section>
      </div>
    </div>
  );
}

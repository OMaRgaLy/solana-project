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
import { extra } from "@/lib/i18n/extra";

type Props = {
  creator: string;
  id: string;
  sig: string;
  title: string;
  amountSol: string;
  client: string;
  vaultPct: number;
  collabPct: number;
  collabInAct?: boolean;
};

export default function ShareCard(p: Props) {
  const { t, lang } = useI18n();
  const X = extra[lang];
  const { connection } = useConnection();
  const [origin, setOrigin] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isPaidOnChain, setIsPaidOnChain] = useState(false);

  useEffect(() => {
    if (!origin) setOrigin(window.location.origin);
  }, [origin]);

  const payPath = `/pay/${p.creator}/${p.id}?client=${encodeURIComponent(p.client)}`;
  const payUrl = `${origin}${payPath}`;
  const actionUrl = `${origin}/api/actions/invoice/${p.creator}/${p.id}`;
  const blinkUrl = `https://dial.to/?action=${encodeURIComponent(`solana-action:${actionUrl}`)}`;
  const actPath = `/invoice/${p.creator}/${p.id}/act?client=${encodeURIComponent(p.client)}${
    p.collabInAct ? "&collabInAct=1" : ""
  }`;

  const readyMessage = t.share.shareMsgTemplate(p.title, p.amountSol, payUrl);

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    X.share.xText(p.title, p.amountSol)
  )}&url=${encodeURIComponent(blinkUrl)}&hashtags=${encodeURIComponent("Solana,Blinks,SteppeInvoice")}`;

  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(payUrl)}&text=${encodeURIComponent(
    X.share.tgText(p.title, p.amountSol)
  )}`;

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(readyMessage)}`;

  const creatorPct = 100 - p.vaultPct - p.collabPct;

  // Generate QR Code
  useEffect(() => {
    if (payUrl) {
      QRCode.toDataURL(payUrl, {
        width: 260,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
      })
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
        confetti({ colors: ["#8fb5a6", "#c7b186", "#e9e7e2"], particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(
          () => confetti({ colors: ["#8fb5a6", "#c7b186", "#e9e7e2"], particleCount: 100, angle: 60, spread: 60, origin: { x: 0 } }),
          300
        );
        setTimeout(
          () => confetti({ colors: ["#8fb5a6", "#c7b186", "#e9e7e2"], particleCount: 100, angle: 120, spread: 60, origin: { x: 1 } }),
          300
        );
      }
    } catch {
      // ignore
    }
  }, [connection, p.creator, p.id, isPaidOnChain]);

  useEffect(() => {
    const interval = setInterval(checkPaymentStatus, 4000);
    return () => clearInterval(interval);
  }, [checkPaymentStatus]);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xl font-bold text-teal-300 flex items-center gap-2">
            <span></span> {t.share.titleSuccess}
          </div>
          <p className="text-xs text-slate-300">{t.share.subtitleSuccess}</p>
        </div>
        <a
          className="btn btn-ghost text-xs py-2 px-3.5 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20"
          href={solscanTx(p.sig)}
          target="_blank"
          rel="noreferrer"
        >
          {t.share.viewSolscan}
        </a>
      </div>

      {/* Realtime payment radar notice */}
      {isPaidOnChain ? (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/20 p-6 text-center space-y-3 shadow-xl">
          
          <div className="text-2xl font-semibold text-emerald-300">{t.share.paidDetected}</div>
          <p className="text-xs text-slate-200">
            {X.share.paidNote}
          </p>
          <div className="pt-2">
            <Link
              href={actPath}
              className="btn bg-emerald-400 text-slate-950 font-bold px-8 py-3 text-sm shadow-xl inline-block hover:bg-emerald-300 transition-transform hover:scale-105"
            >
              {t.share.openAct}
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 flex items-center gap-3 text-xs text-slate-300">
          <span className="flex h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="flex-1">{t.share.waitingPayment}</span>
          {process.env.NEXT_PUBLIC_TELEGRAM_BOT && (
            <a
              id="btn-notify-telegram"
              href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT}?start=i_${p.creator}_${p.id}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-lg border border-sky-500/40 bg-sky-500/15 px-3 py-1.5 font-bold text-sky-300 hover:bg-sky-500/25"
            >
              Telegram
            </a>
          )}
        </div>
      )}

      {/* Main Grid: Left = Sharing Suite, Right = QR & Preview */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column */}
        <section className="card space-y-5 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white">{t.share.shareHeading}</h2>
            <span className="text-xs font-mono text-teal-300 font-semibold">{p.amountSol} SOL</span>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-3 gap-2.5">
            <a
              href={tgUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/15 py-3 text-xs font-bold text-sky-300 hover:bg-sky-500/25 transition-all text-center"
            >
              {t.share.shareTg}
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 py-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all text-center"
            >
              {t.share.shareWa}
            </a>
            <a
              href={xUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-bold text-white hover:bg-white/20 transition-all text-center"
            >
              <span className="text-base">𝕏</span> {t.share.shareX}
            </a>
          </div>

          {/* Copy Cards Suite */}
          <div className="space-y-3.5 pt-1">
            {/* 1. Checkout Link */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">{t.share.copyCheckout}</span>
                <button
                  id="btn-copy-checkout"
                  type="button"
                  onClick={() => copy("checkout", payUrl)}
                  className="font-bold text-teal-300 hover:underline flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === "checkout" ? X.common.copied : X.common.copy}
                </button>
              </div>
              <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 font-mono text-xs text-slate-300 border border-white/5">
                <span className="truncate flex-1">{payUrl}</span>
                <Link
                  id="link-open-checkout-small"
                  href={payPath}
                  className="text-xs text-teal-300 hover:text-white shrink-0 font-sans font-semibold underline"
                >
                  {X.common.open}
                </Link>
              </div>
            </div>

            {/* 2. Blink URL */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">{t.share.copyBlink}</span>
                <button
                  id="btn-copy-blink"
                  type="button"
                  onClick={() => copy("blink", blinkUrl)}
                  className="font-bold text-teal-300 hover:underline flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === "blink" ? X.common.copied : X.common.copy}
                </button>
              </div>
              <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 font-mono text-xs text-slate-300 border border-white/5">
                <span className="truncate flex-1">{blinkUrl}</span>
                <a
                  href={blinkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-purple-300 hover:text-white shrink-0 font-sans font-semibold underline"
                >
                  Dial.to ↗
                </a>
              </div>
            </div>

            {/* 3. Ready Message */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">{t.share.copyMessage}</span>
                <button
                  id="btn-copy-msg"
                  type="button"
                  onClick={() => copy("msg", readyMessage)}
                  className="font-bold text-teal-300 hover:underline flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === "msg" ? X.common.copied : X.common.copyText}
                </button>
              </div>
              <div className="bg-black/40 rounded-lg p-2.5 font-sans text-xs text-slate-300 whitespace-pre-line border border-white/5 leading-relaxed">
                {readyMessage}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
            <Link id="btn-open-checkout" href={payPath} className="btn text-xs py-2.5 px-5">
              {t.share.openCheckout} →
            </Link>
            <Link
              id="btn-open-act"
              href={actPath}
              className="text-xs text-sky-300 hover:text-white underline font-semibold flex items-center gap-1"
            >
              {t.share.openAct}
            </Link>
          </div>
        </section>

        {/* Right Column: QR Code & Blink Preview */}
        <section className="space-y-5 lg:col-span-5">
          {/* QR Code Card */}
          <div className="card text-center space-y-3 flex flex-col items-center p-6 border border-white/10">
            <h3 className="font-bold text-white text-sm">{t.share.qrTitle}</h3>
            {qrCodeDataUrl ? (
              <div className="rounded-2xl bg-white p-3.5 shadow-xl">
                <img src={qrCodeDataUrl} alt={X.share.qrAlt} className="h-44 w-44" />
              </div>
            ) : (
              <div className="h-44 w-44 bg-white/5 rounded-2xl animate-pulse flex items-center justify-center">
                <span className="text-xs text-slate-500">{X.share.qrLoading}</span>
              </div>
            )}
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{t.share.qrHint}</p>
          </div>

          {/* Blink Preview */}
          <BlinkPreview
            iconUrl={`${origin}/api/og/invoice?creator=${p.creator}&id=${p.id}&lang=${lang}`}
            domain={origin.replace(/^https?:\/\//, "") || "steppeinvoice.app"}
            title={`${p.title} — ${p.amountSol} SOL`}
            description={X.share.blinkDesc(creatorPct, p.collabPct, p.vaultPct)}
          />
        </section>
      </div>
    </div>
  );
}

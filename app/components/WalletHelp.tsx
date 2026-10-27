"use client";

import Link from "next/link";
import { guide } from "@/lib/i18n/guide";
import { useI18n } from "@/lib/i18n/I18nContext";

/** Shown next to "connect wallet" on a live invoice: a payer without a wallet sees the way in without leaving the page. */
export default function WalletHelp() {
  const { lang } = useI18n();
  const Q = guide[lang].quick;
  return (
    <div id="wallet-help" className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left">
      <div className="text-sm font-semibold text-white">{Q.title}</div>
      <ol className="mt-3 space-y-2 text-xs text-slate-300">
        {Q.steps.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/20 text-[11px] font-bold text-teal-300">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[11px] text-slate-500">{Q.cardNote}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href="https://phantom.com/download" target="_blank" rel="noreferrer" className="btn text-xs font-bold">{Q.install}</a>
        <Link href="/guide" className="btn btn-ghost text-xs">{Q.fullGuide}</Link>
      </div>
    </div>
  );
}

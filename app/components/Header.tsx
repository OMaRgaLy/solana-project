"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { extra } from "@/lib/i18n/extra";
import { Language } from "@/lib/i18n/translations";
import { useMode } from "@/lib/mode/ModeContext";

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const { isDemo, setMode } = useMode();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0f1216]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/15 bg-[#171b21] text-teal-400 transition-colors group-hover:border-teal-400/50">
              {/* monogram: an invoice split into two shares */}
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 3h9l4 4v14H6z" />
                <path d="M9.5 12h6M9.5 16h6" />
              </svg>
            </span>
            <span className="text-base font-semibold tracking-tight text-white">SteppeInvoice</span>
            {/* Both modes run on Solana Devnet today; say so instead of implying real money. */}
            <span className="badge badge-amber" title="Solana Devnet">Devnet</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3.5 text-sm font-medium">
            <Link
              id="nav-create"
              href="/create"
              className="text-slate-300 hover:text-white transition-colors text-xs font-semibold"
            >
              {t.header.createInvoice}
            </Link>

            <Link
              id="nav-dashboard"
              href="/dashboard"
              className="text-slate-300 hover:text-white transition-colors text-xs font-semibold"
            >
              {extra[lang].nav.finance}
            </Link>

            <Link
              id="nav-profile"
              href="/profile"
              className="text-slate-300 hover:text-white transition-colors text-xs font-semibold"
            >
              {t.header.myProfile}
            </Link>

            <Link
              id="nav-how-it-works"
              href="/#how"
              className="text-slate-400 hover:text-teal-300 transition-colors text-xs flex items-center gap-1 font-semibold"
            >
              {t.header.howItWorks}
            </Link>

            {/* Mode Switcher Toggle */}
            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
              <button
                id="mode-live"
                type="button"
                onClick={() => setMode("live")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  !isDemo
                    ? "bg-teal-400 text-slate-950 shadow-sm font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
                title={t.header.switchToLive}
              >
                Live
              </button>
              <button
                id="mode-demo"
                type="button"
                onClick={() => setMode("demo")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  isDemo
                    ? "bg-amber-400 text-slate-950 shadow-sm font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
                title={t.header.switchToDemo}
              >
                Demo
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <select
                id="lang-selector"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="appearance-none rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 outline-none hover:bg-white/10 cursor-pointer"
              >
                <option value="ru" className="bg-[#171b21] text-white">RU · Русский</option>
                <option value="kk" className="bg-[#171b21] text-white">KZ · Қазақша</option>
                <option value="en" className="bg-[#171b21] text-white">EN · English</option>
              </select>
            </div>

            {/* Wallet Button */}
            <WalletMultiButton />
          </nav>
        </div>
      </header>
    </>
  );
}

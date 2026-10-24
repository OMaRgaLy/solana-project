"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Language } from "@/lib/i18n/translations";
import { useMode } from "@/lib/mode/ModeContext";
import OnboardingModal from "./OnboardingModal";

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const { mode, toggleMode, isDemo } = useMode();
  const { publicKey } = useWallet();
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b14]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-teal-400 to-cyan-400 p-0.5 text-xl shadow-md transition-transform group-hover:scale-105">
              <span className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#070b14]">
                🏹
              </span>
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                SteppeInvoice
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Solana Pay & Split
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link
              href="/create"
              className="hidden sm:inline text-slate-300 hover:text-white transition-colors"
            >
              {t.header.createInvoice}
            </Link>

            <Link
              href="/profile"
              className="hidden md:inline text-slate-300 hover:text-white transition-colors"
            >
              {t.header.myProfile}
            </Link>

            <button
              onClick={() => setShowOnboarding(true)}
              className="text-slate-400 hover:text-teal-300 transition-colors text-xs flex items-center gap-1"
            >
              💡 {t.header.howItWorks}
            </button>

            {/* Mode Switcher Toggle */}
            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
              <button
                onClick={() => isDemo && toggleMode()}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  !isDemo
                    ? "bg-teal-400 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Реальные кошельки и блокчейн"
              >
                ⚡ Live
              </button>
              <button
                onClick={() => !isDemo && toggleMode()}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  isDemo
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Песочница с тест-кошельками без расширений"
              >
                🧪 Demo
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="appearance-none rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 outline-none hover:bg-white/10 cursor-pointer"
              >
                <option value="ru" className="bg-[#0f172a] text-white">🇷🇺 Рус</option>
                <option value="kk" className="bg-[#0f172a] text-white">🇰🇿 Қаз</option>
                <option value="en" className="bg-[#0f172a] text-white">🇬🇧 Eng</option>
              </select>
            </div>

            {/* Wallet Button */}
            <WalletMultiButton />
          </nav>
        </div>
      </header>

      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </>
  );
}

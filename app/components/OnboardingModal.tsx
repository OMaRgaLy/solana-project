"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"tour" | "tips">("tour");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="card max-w-2xl w-full border border-white/20 bg-[#0d1627] p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏹</span>
            <div>
              <h3 className="text-xl font-bold text-white">{t.onboarding.welcomeTitle}</h3>
              <p className="text-xs text-slate-400">{t.onboarding.welcomeSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-black/40 p-1 border border-white/5">
          <button
            onClick={() => setActiveTab("tour")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "tour"
                ? "bg-teal-400 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🚀 Пошаговый тур (3 шага)
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "tips"
                ? "bg-teal-400 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            💡 {t.onboarding.tipsTitle}
          </button>
        </div>

        {activeTab === "tour" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400 text-slate-950 font-bold text-sm">
                1
              </div>
              <h4 className="font-semibold text-white text-sm">{t.onboarding.step1Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.onboarding.step1Desc}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400 text-slate-950 font-bold text-sm">
                2
              </div>
              <h4 className="font-semibold text-white text-sm">{t.onboarding.step2Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.onboarding.step2Desc}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-slate-950 font-bold text-sm">
                3
              </div>
              <h4 className="font-semibold text-white text-sm">{t.onboarding.step3Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.onboarding.step3Desc}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1">
              <div className="font-bold text-amber-300">🇰🇿 {t.onboarding.tipTaxTitle}</div>
              <p className="text-slate-300 leading-relaxed">{t.onboarding.tipTaxDesc}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1">
              <div className="font-bold text-sky-300">🤝 {t.onboarding.tipCollabTitle}</div>
              <p className="text-slate-300 leading-relaxed">{t.onboarding.tipCollabDesc}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1">
              <div className="font-bold text-teal-300">⚡ {t.onboarding.tipBlinkTitle}</div>
              <p className="text-slate-300 leading-relaxed">{t.onboarding.tipBlinkDesc}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="btn text-sm py-2 px-5">
            {t.onboarding.gotItBtn} →
          </button>
        </div>
      </div>
    </div>
  );
}

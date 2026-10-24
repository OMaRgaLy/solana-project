"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"tour" | "tax" | "split" | "blinks">("tour");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="card max-w-2xl w-full border border-white/20 bg-[#0d1627] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-xl shadow-md">
              🏹
            </span>
            <div>
              <h3 className="text-xl font-bold text-white">{t.onboarding.welcomeTitle}</h3>
              <p className="text-xs text-slate-400">{t.onboarding.welcomeSubtitle}</p>
            </div>
          </div>
          <button
            id="onboarding-close-btn"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 4 Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xl bg-black/40 p-1.5 border border-white/5 text-xs font-semibold">
          <button
            id="onboarding-tab-tour"
            onClick={() => setActiveTab("tour")}
            className={`py-2 px-2 rounded-lg transition-all text-center ${
              activeTab === "tour"
                ? "bg-teal-400 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.onboarding.tourTab}
          </button>
          <button
            id="onboarding-tab-tax"
            onClick={() => setActiveTab("tax")}
            className={`py-2 px-2 rounded-lg transition-all text-center ${
              activeTab === "tax"
                ? "bg-amber-400 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.onboarding.taxTab}
          </button>
          <button
            id="onboarding-tab-split"
            onClick={() => setActiveTab("split")}
            className={`py-2 px-2 rounded-lg transition-all text-center ${
              activeTab === "split"
                ? "bg-sky-400 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.onboarding.splitTab}
          </button>
          <button
            id="onboarding-tab-blinks"
            onClick={() => setActiveTab("blinks")}
            className={`py-2 px-2 rounded-lg transition-all text-center ${
              activeTab === "blinks"
                ? "bg-purple-500 text-white shadow-md font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.onboarding.blinksTab}
          </button>
        </div>

        {/* Tab 1: Step-by-Step Tour */}
        {activeTab === "tour" && (
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 space-y-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-400 text-slate-950 font-bold text-xs">
                1
              </div>
              <h4 className="font-bold text-white text-sm">{t.onboarding.step1Title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{t.onboarding.step1Desc}</p>
            </div>

            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 space-y-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-400 text-slate-950 font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-white text-sm">{t.onboarding.step2Title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{t.onboarding.step2Desc}</p>
            </div>

            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-400 text-slate-950 font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-white text-sm">{t.onboarding.step3Title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{t.onboarding.step3Desc}</p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400 text-slate-950 font-bold text-xs">
                4
              </div>
              <h4 className="font-bold text-white text-sm">{t.onboarding.step4Title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{t.onboarding.step4Desc}</p>
            </div>
          </div>
        )}

        {/* Tab 2: Kazakhstan Tax Regime 3% */}
        {activeTab === "tax" && (
          <div className="space-y-3.5 text-xs">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
              <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <span>🏛️</span> {t.onboarding.taxTitle}
              </div>
              <p className="text-slate-200 leading-relaxed">{t.onboarding.taxDesc1}</p>
              <p className="text-slate-300 leading-relaxed">{t.onboarding.taxDesc2}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 flex items-center gap-3">
              <span className="text-xl">🧮</span>
              <div>
                <span className="font-bold text-white">{t.onboarding.taxFormulaTitle}</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Например: 10 SOL ≈ 750 000 ₸. Налог 3% составит 22 500 ₸.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: On-Chain Atomic Split */}
        {activeTab === "split" && (
          <div className="space-y-3.5 text-xs">
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 space-y-2">
              <div className="font-bold text-sky-300 text-sm flex items-center gap-2">
                <span>⚡</span> {t.onboarding.splitTitle}
              </div>
              <p className="text-slate-200 leading-relaxed">{t.onboarding.splitDesc1}</p>
              <p className="text-slate-300 leading-relaxed">{t.onboarding.splitDesc2}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2">
              <div className="text-white font-semibold flex items-center justify-between">
                <span>Пример распределения (10 SOL):</span>
                <span className="font-mono text-teal-300">100% за 400 мс</span>
              </div>
              <div className="flex h-3 w-full rounded-full overflow-hidden bg-black/50">
                <div style={{ width: "84%" }} className="bg-teal-400" title="Вам (84%)" />
                <div style={{ width: "15%" }} className="bg-sky-400" title="Напарнику (15%)" />
                <div style={{ width: "1%" }} className="bg-amber-400" title="Steppe Fee (1%)" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span className="text-teal-300">● 8.4 SOL (Исполнитель)</span>
                <span className="text-sky-300">● 1.5 SOL (Напарник)</span>
                <span className="text-amber-300">● 0.1 SOL (Steppe 1%)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Solana Actions & Blinks */}
        {activeTab === "blinks" && (
          <div className="space-y-3.5 text-xs">
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-2">
              <div className="font-bold text-purple-300 text-sm flex items-center gap-2">
                <span>🔗</span> {t.onboarding.blinksTitle}
              </div>
              <p className="text-slate-200 leading-relaxed">{t.onboarding.blinksDesc1}</p>
              <p className="text-slate-300 leading-relaxed">{t.onboarding.blinksDesc2}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-slate-300 space-y-1">
              <span className="font-semibold text-white">Где работают ссылки SteppeInvoice:</span>
              <ul className="list-disc list-inside text-slate-400 space-y-0.5 pt-1">
                <li><b className="text-white">X (Twitter):</b> Разворачивается в интерактивный карточный Blink с кнопкой оплаты.</li>
                <li><b className="text-white">Telegram:</b> Отправляется как кликабельная карточка WebApp чекаута.</li>
                <li><b className="text-white">WhatsApp / Email:</b> Прямая защищенная ссылка на оплату и Акт.</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-white/10">
          <button id="onboarding-got-it-btn" onClick={onClose} className="btn text-xs py-2 px-6">
            {t.onboarding.gotItBtn} →
          </button>
        </div>
      </div>
    </div>
  );
}

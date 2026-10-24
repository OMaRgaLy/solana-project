"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useMode } from "@/lib/mode/ModeContext";

export default function Home() {
  const { t } = useI18n();
  const { isDemo, setMode } = useMode();

  const steps = [
    { n: "1", title: t.home.howStep1Title, desc: t.home.howStep1Desc },
    { n: "2", title: t.home.howStep2Title, desc: t.home.howStep2Desc },
    { n: "3", title: t.home.howStep3Title, desc: t.home.howStep3Desc },
    { n: "4", title: t.home.howStep4Title, desc: t.home.howStep4Desc },
  ];

  const features = [
    { title: t.home.feat1Title, desc: t.home.feat1Desc, color: "border-teal-500/30" },
    { title: t.home.feat2Title, desc: t.home.feat2Desc, color: "border-purple-500/30" },
    { title: t.home.feat3Title, desc: t.home.feat3Desc, color: "border-sky-500/30" },
  ];

  return (
    <div className="space-y-20 py-4">
      {/* Hero Section */}
      <section className="grid items-center gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-300">
            <span>🇰🇿</span> {t.home.badge}
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl text-white">
            {t.home.heroTitle1}
            <br />
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              {t.home.heroTitleAccent}
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {t.home.heroDesc}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link id="hero-create-cta" href="/create" className="btn text-base py-3 px-6 shadow-xl">
              {t.home.createCta}
            </Link>
            {!isDemo ? (
              <button
                id="hero-demo-cta"
                type="button"
                onClick={() => setMode("demo")}
                className="btn btn-ghost text-base py-3 px-6 border-amber-400/30 text-amber-300 hover:bg-amber-400/15"
              >
                🧪 {t.home.demoCta}
              </button>
            ) : (
              <Link href="/create" className="btn btn-ghost text-base py-3 px-6">
                {t.home.howTitle} ↓
              </Link>
            )}
          </div>
        </div>

        {/* Settlement Simulator Card */}
        <div className="lg:col-span-5">
          <div className="card space-y-4 border-white/15 bg-gradient-to-b from-[#0f172a]/90 to-[#070b14]/90 p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-teal-300 font-bold">
                ⚡ Пример расщепления · Инвойс 1 SOL
              </span>
              <span className="badge badge-solana">400 ms finality</span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-white">🧑‍💻 Исполнитель</span>
                  <span className="font-mono text-teal-300">84% (0.84 SOL)</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-teal-400 w-[84%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-white">🤝 Напарник (Дизайнер)</span>
                  <span className="font-mono text-sky-300">15% (0.15 SOL)</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-sky-400 w-[15%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-white">⚡ Steppe Protocol Fee</span>
                  <span className="font-mono text-amber-300">1% (0.01 SOL)</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400 w-[1%]"></div>
                </div>
              </div>
            </div>

            <p className="pt-2 text-xs text-slate-400 border-t border-white/5">
              Все 3 перевода происходят мгновенно и атомарно внутри смарт-контракта в момент подтверждения платежа заказчиком.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="badge badge-purple uppercase">Процесс</span>
          <h2 className="text-3xl font-extrabold text-white">{t.home.howTitle}</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card space-y-3 hover:border-teal-400/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-teal-400 font-black text-slate-950 text-base shadow-md">
                {s.n}
              </div>
              <h3 className="font-bold text-white text-base">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="grid gap-6 md:grid-cols-3">
        {features.map((f, i) => (
          <div key={i} className={`card space-y-2 ${f.color}`}>
            <h3 className="font-bold text-white text-base">{f.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nContext";
import { landing } from "@/lib/i18n/landing";
import { useMode } from "@/lib/mode/ModeContext";

const SPLIT = [
  { key: "you", pct: 84, bar: "bg-teal-400", text: "text-teal-300" },
  { key: "partner", pct: 15, bar: "bg-sky-400", text: "text-sky-300" },
  { key: "fee", pct: 1, bar: "bg-amber-400", text: "text-amber-300" },
] as const;

export default function Home() {
  const { lang } = useI18n();
  const L = landing[lang];
  const { isDemo, setMode } = useMode();
  const router = useRouter();
  // Always lands somewhere useful: enters demo mode if needed, then opens the invoice form.
  const startDemo = () => {
    setMode("demo");
    router.push("/create");
  };

  return (
    <div className="space-y-24 pb-8">
      {/* Hero */}
      <section className="grid items-center gap-12 pt-6 lg:grid-cols-12">
        <div className="space-y-7 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> {L.eyebrow}
          </div>

          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
            {L.title1}
            <br />
            <span className="text-slate-400">
              {L.title2}
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{L.sub}</p>

          <div className="flex flex-wrap gap-3">
            <Link id="hero-create-cta" href="/create" className="btn px-7 py-3.5 text-base">
              {L.cta} →
            </Link>
            {/* Already in demo: the main button above does the same thing, so this one would only look dead. */}
            {!isDemo && (
              <button id="hero-demo-cta" type="button" onClick={startDemo} className="btn btn-ghost px-6 py-3.5 text-base">
                {L.demo}
              </button>
            )}
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-400">
            {L.trust.map((x) => (
              <li key={x} className="flex items-center gap-1.5">
                <span className="text-teal-400">✓</span> {x}
              </li>
            ))}
          </ul>
        </div>

        {/* Split visual */}
        <div className="lg:col-span-5">
          <div className="card space-y-5 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-bold text-white">{L.splitHead}</span>
              <span className="badge badge-solana">~400 ms</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-black/40">
              {SPLIT.map((s) => (
                <div key={s.key} style={{ width: `${s.pct}%` }} className={s.bar} />
              ))}
            </div>
            <ul className="space-y-2.5">
              {SPLIT.map((s) => (
                <li key={s.key} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-200">
                    <span className={`h-2.5 w-2.5 rounded-full ${s.bar}`} /> {L.roles[s.key]}
                  </span>
                  <span className={`font-mono font-semibold ${s.text}`}>
                    {(s.pct / 100).toFixed(2)} SOL
                  </span>
                </li>
              ))}
            </ul>
            <p className="border-t border-white/10 pt-3 text-xs leading-relaxed text-slate-400">{L.splitNote}</p>
          </div>
        </div>
      </section>

      {/* Why not just an address */}
      <section className="space-y-8">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <span className="badge badge-amber">{L.whyEyebrow}</span>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{L.whyTitle}</h2>
        </div>
        <div className="card overflow-hidden p-0">
          <div className="hidden grid-cols-12 border-b border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 sm:grid">
            <span className="col-span-3" />
            <span className="col-span-4">{L.walletCol}</span>
            <span className="col-span-5 text-teal-300">{L.usCol}</span>
          </div>
          {L.whyRows.map((r) => (
            <div key={r.label} className="grid gap-1 border-b border-white/5 px-5 py-4 text-sm last:border-0 sm:grid-cols-12 sm:gap-4">
              <span className="font-semibold text-white sm:col-span-3">{r.label}</span>
              <span className="text-slate-500 sm:col-span-4">
                <span className="mr-1.5 text-red-400/80">✕</span>
                {r.wallet}
              </span>
              <span className="text-slate-100 sm:col-span-5">
                <span className="mr-1.5 text-teal-400">✓</span>
                {r.us}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {L.feats.map((f) => (
            <div key={f.title} className="card space-y-2 hover:border-teal-400/30">
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-24 space-y-8">
        <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">{L.howTitle}</h2>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {L.steps.map((s, i) => (
            <li key={s.title} className="card space-y-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-teal-300">
                {i + 1}
              </div>
              <h3 className="font-bold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Final CTA */}
      <section className="card flex flex-col items-center gap-5 bg-[#171b21] py-14 text-center">
        <h2 className="max-w-xl text-2xl font-semibold text-white sm:text-3xl">{L.finalTitle}</h2>
        <button id="final-demo-cta" type="button" onClick={startDemo} className="btn px-8 py-3.5 text-base">
          {L.finalCta}
        </button>
      </section>
    </div>
  );
}

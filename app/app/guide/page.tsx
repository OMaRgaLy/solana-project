"use client";

import { useI18n } from "@/lib/i18n/I18nContext";
import { guide } from "@/lib/i18n/guide";

export default function GuidePage() {
  const { lang } = useI18n();
  const G = guide[lang];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">{G.title}</h1>
        <p className="text-slate-400">{G.lead}</p>
      </header>

      <ol className="space-y-4">
        {G.steps.map((s, i) => (
          <li key={s.title} className="card flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-teal-300">
              {i + 1}
            </span>
            <div className="space-y-2">
              <h2 className="font-semibold text-white">{s.title}</h2>
              <p className="text-sm leading-relaxed text-slate-300">{s.body}</p>
              {s.bullets && (
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-300">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {i === 0 && (
                <a
                  href="https://phantom.com/download"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-sm text-teal-300 underline hover:text-white"
                >
                  {G.officialSite} ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>

      <section className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
        <h2 className="mb-2 font-semibold text-amber-300">{G.noteTitle}</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-300">
          {G.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>

      <button type="button" onClick={() => history.back()} className="btn btn-ghost">
        ← {G.backToPay}
      </button>
    </div>
  );
}

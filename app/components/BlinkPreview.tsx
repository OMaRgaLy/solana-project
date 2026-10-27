"use client";

import { useI18n } from "@/lib/i18n/I18nContext";
import { extra } from "@/lib/i18n/extra";

export default function BlinkPreview(props: { iconUrl: string; title: string; description: string; domain: string }) {
  const { lang } = useI18n();
  const B = extra[lang].blink;
  return (
    <div className="rounded-2xl border border-white/10 bg-[#12161b] p-4 text-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-700" />
        <div>
          <div className="font-semibold">{B.you} <span className="font-normal text-slate-500">@freelancer · now</span></div>
          <div className="text-slate-200">{B.tweet}</div>
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-[#0f1216]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={props.iconUrl} alt={B.bannerAlt} className="aspect-[1200/630] w-full object-cover" />
        <div className="space-y-1 p-3">
          <div className="text-xs text-slate-500">{props.domain}</div>
          <div className="font-semibold">{props.title}</div>
          <div className="text-xs text-slate-400">{props.description}</div>
          <div className="pt-2">
            <span className="inline-block w-full rounded-lg bg-teal-400 py-2 text-center font-semibold text-[#0f1216]">{B.pay}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

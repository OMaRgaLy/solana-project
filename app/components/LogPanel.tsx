"use client";

import { useState } from "react";
import { clearLog, useLog } from "@/lib/log";

export default function LogPanel() {
  const entries = useLog();
  const [open, setOpen] = useState(true);
  const color = { info: "text-slate-300", ok: "text-emerald-300", error: "text-red-300" } as const;
  const copy = () => navigator.clipboard?.writeText(entries.map((e) => `${new Date(e.t).toLocaleTimeString()} ${e.msg}`).join("\n")).catch(() => {});
  if (entries.length === 0 && !open) return null;
  return (
    <div className="no-print fixed bottom-3 right-3 z-30 w-[min(30rem,calc(100vw-1.5rem))] rounded-xl border border-white/15 bg-black/90 text-xs shadow-2xl">
      <div className="flex items-center justify-between px-3 py-2">
        <button className="font-semibold" onClick={() => setOpen(!open)}>📋 Activity log ({entries.length}) {open ? "▾" : "▸"}</button>
        <span className="space-x-3">
          <button onClick={copy} className="text-slate-400 hover:text-white">copy</button>
          <button onClick={clearLog} className="text-slate-400 hover:text-white">clear</button>
        </span>
      </div>
      {open && (
        <ul className="max-h-60 space-y-1 overflow-auto border-t border-white/10 p-3 font-mono">
          {entries.length === 0 && <li className="text-slate-500">Nothing yet. Every wallet and network step will appear here.</li>}
          {entries.map((e) => (
            <li key={e.id} className={`whitespace-pre-wrap break-all ${color[e.level]}`}>
              <span className="text-slate-500">{new Date(e.t).toLocaleTimeString()}</span> {e.msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

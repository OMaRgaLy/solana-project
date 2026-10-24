"use client";

import { useSyncExternalStore } from "react";

export type LogEntry = { id: number; t: number; level: "info" | "ok" | "error"; msg: string };

let entries: LogEntry[] = [];
let seq = 0;
const listeners = new Set<() => void>();
const EMPTY: LogEntry[] = [];

/** Visible activity log: every wallet / RPC step is shown on screen and mirrored to the console. */
export function log(level: LogEntry["level"], msg: string) {
  entries = [...entries, { id: ++seq, t: Date.now(), level, msg }].slice(-200);
  (level === "error" ? console.error : console.log)("[SteppeInvoice]", msg);
  listeners.forEach((l) => l());
}

export function clearLog() { entries = []; listeners.forEach((l) => l()); }

export function useLog(): LogEntry[] {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => entries,
    () => EMPTY,
  );
}

export function errText(e: unknown): string {
  const anyE = e as { message?: string; logs?: string[] };
  const base = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  return anyE?.logs?.length ? `${base}\n${anyE.logs.slice(-6).join("\n")}` : base || String(anyE?.message);
}

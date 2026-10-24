import { computeSplit } from "./split";
import type { InvoiceAccount } from "./program";

export const LAMPORTS = 1_000_000_000n;

export function lamportsToSol(l: bigint): string {
  const whole = l / LAMPORTS;
  const frac = (l % LAMPORTS).toString().padStart(9, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : `${whole}`;
}

export function solToLamports(sol: string): bigint | null {
  if (!/^\d+(\.\d{1,9})?$/.test(sol.trim())) return null;
  const [w, f = ""] = sol.trim().split(".");
  return BigInt(w) * LAMPORTS + BigInt(f.padEnd(9, "0"));
}

export const pct = (bps: number) => `${(bps / 100).toFixed(bps % 100 === 0 ? 0 : 2)}%`;

export function splitLabel(inv: Pick<InvoiceAccount, "amount" | "vaultBps" | "collaboratorBps">): string {
  const s = computeSplit(inv.amount, inv.vaultBps, inv.collaboratorBps);
  const total = Number(inv.amount) || 1;
  const creatorPct = (Number(s.creator) / total) * 100;
  const parts = [`${creatorPct.toFixed(creatorPct % 1 ? 2 : 0)}% Freelancer`, `${pct(inv.vaultBps)} Savings Vault`];
  if (inv.collaboratorBps > 0) parts.push(`${pct(inv.collaboratorBps)} Collaborator`);
  return `⚡ Auto-split: ${parts.join(" · ")}`;
}

export const short = (s: string) => `${s.slice(0, 4)}…${s.slice(-4)}`;
export const solscanTx = (sig: string) => `https://solscan.io/tx/${sig}?cluster=devnet`;
export const solscanAddr = (a: string) => `https://solscan.io/account/${a}?cluster=devnet`;

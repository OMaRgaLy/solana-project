"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlinkPreview from "./BlinkPreview";
import { solscanTx } from "@/lib/format";

type Props = {
  creator: string; id: string; sig: string; title: string; amountSol: string;
  client: string; vaultPct: number; collabPct: number;
};

export default function ShareCard(p: Props) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  useEffect(() => {
    if (!origin) setOrigin(window.location.origin);
  }, [origin]);

  const payPath = `/pay/${p.creator}/${p.id}?client=${encodeURIComponent(p.client)}`;
  const payUrl = `${origin}${payPath}`;
  const actionUrl = `${origin}/api/actions/invoice/${p.creator}/${p.id}`;
  const blinkUrl = `https://dial.to/?action=${encodeURIComponent(`solana-action:${actionUrl}`)}`;
  const text = `💸 Invoice "${p.title}" — ${p.amountSol} SOL. Pay in one click with a Solana Blink ⚡`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(blinkUrl)}&hashtags=${encodeURIComponent("Solana,Blinks,SteppeInvoice")}`;
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(blinkUrl)}&text=${encodeURIComponent(text)}`;
  const creatorPct = 100 - p.vaultPct - p.collabPct;

  const copy = async (k: string, v: string) => {
    try { await navigator.clipboard.writeText(v); setCopied(k); setTimeout(() => setCopied(null), 1500); } catch { /* clipboard unavailable */ }
  };

  const rows: [string, string, string][] = [
    ["blink", "Blink link (dial.to)", blinkUrl],
    ["pay", "Checkout page", payUrl],
    ["action", "Action endpoint", actionUrl],
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card space-y-4">
        <div className="text-2xl font-bold">✅ Invoice deployed to Devnet</div>
        <a className="text-sm text-teal-300 underline" href={solscanTx(p.sig)} target="_blank" rel="noreferrer">View creation transaction on Solscan ↗</a>
        {rows.map(([k, label, v]) => (
          <div key={k}>
            <div className="label">{label}</div>
            <div className="flex gap-2">
              <input readOnly className="input font-mono text-xs" value={v} />
              <button className="btn btn-ghost" onClick={() => copy(k, v)}>{copied === k ? "Copied" : "Copy"}</button>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-3 pt-2">
          <a className="btn" href={xUrl} target="_blank" rel="noreferrer">𝕏 Share to Twitter/X</a>
          <a className="btn btn-ghost" href={tgUrl} target="_blank" rel="noreferrer">✈ Share to Telegram</a>
          <Link className="btn btn-ghost" href={payPath}>Open checkout →</Link>
        </div>
        <p className="text-xs text-slate-500">
          Tip: Blinks unfurl on X only from a public https domain registered with Dialect. Locally, use the simulator or open the dial.to link.
        </p>
      </section>
      <section>
        <div className="label">How your client sees it in the feed</div>
        <BlinkPreview
          iconUrl={`${origin}/api/og/invoice?creator=${p.creator}&id=${p.id}`}
          domain={origin.replace(/^https?:\/\//, "") || "steppeinvoice.app"}
          title={`${p.title} — ${p.amountSol} SOL`}
          description={`⚡ Auto-split: ${creatorPct}% Freelancer · ${p.vaultPct}% Savings Vault${p.collabPct ? ` · ${p.collabPct}% Collaborator` : ""}`}
        />
      </section>
    </div>
  );
}

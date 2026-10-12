"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { use, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import confetti from "canvas-confetti";
import { payInvoiceIx } from "@/lib/program";
import { useInvoice } from "@/lib/useInvoice";
import { computeSplit } from "@/lib/split";
import { lamportsToSol, pct, short, solscanAddr, solscanTx } from "@/lib/format";
import { errText, log } from "@/lib/log";

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

export default function PayPage({ params }: { params: Promise<{ creator: string; id: string }> }) {
  const { creator, id } = use(params);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { invoice, loading, error, paySig, reload } = useInvoice(creator, id);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [justPaid, setJustPaid] = useState<string | null>(null);

  if (loading && !invoice) return <p className="text-slate-400">Loading invoice from Devnet…</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!invoice)
    return (
      <div className="card mx-auto max-w-lg text-center">
        <div className="text-4xl">🔍</div>
        <h1 className="mt-2 text-xl font-bold">Invoice not found</h1>
        <p className="mt-1 text-slate-400">It may have been cancelled by the freelancer, or the link is wrong.</p>
      </div>
    );

  const split = computeSplit(invoice.amount, invoice.vaultBps, invoice.collaboratorBps);
  const sig = justPaid ?? paySig;
  const paid = invoice.isPaid || !!justPaid;

  async function pay() {
    if (!publicKey || !invoice) return;
    setBusy(true);
    setErr(null);
    try {
      log("info", `Paying invoice #${invoice.invoiceId} (${lamportsToSol(invoice.amount)} SOL) from ${publicKey.toBase58()}`);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const tx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add(payInvoiceIx(invoice, publicKey));
      log("info", "Built pay_invoice transaction, asking wallet to sign and send...");
      const s = await sendTransaction(tx, connection);
      log("info", `Sent: ${s}. Waiting for confirmation...`);
      const res = await connection.confirmTransaction({ signature: s, blockhash, lastValidBlockHeight }, "confirmed");
      if (res.value.err) throw new Error("Payment failed on-chain: " + JSON.stringify(res.value.err));
      log("ok", `Paid. Split settled atomically. https://solscan.io/tx/${s}?cluster=devnet`);
      setJustPaid(s);
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 100, angle: 60, spread: 70, origin: { x: 0 } }), 250);
      setTimeout(() => confetti({ particleCount: 100, angle: 120, spread: 70, origin: { x: 1 } }), 250);
      await reload();
    } catch (e) {
      log("error", `Payment failed: ${errText(e)}`);
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const rows: [string, string, bigint][] = [
    ["Freelancer", invoice.creator.toBase58(), split.creator],
    ["Savings Vault · " + pct(invoice.vaultBps), invoice.vaultRecipient.toBase58(), split.vault],
    ...(invoice.collaborator ? [["Collaborator · " + pct(invoice.collaboratorBps), invoice.collaborator.toBase58(), split.collaborator] as [string, string, bigint]] : []),
  ];

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="card space-y-5 text-center">
        <div className="text-xs uppercase tracking-widest text-teal-300">SteppeInvoice · Verified</div>
        <h1 className="text-2xl font-bold">{invoice.title}</h1>
        <div className="text-6xl font-extrabold">{lamportsToSol(invoice.amount)} <span className="text-3xl text-slate-400">SOL</span></div>
        <div className="text-sm text-slate-400">From <a className="underline" href={solscanAddr(invoice.creator.toBase58())} target="_blank" rel="noreferrer">{short(invoice.creator.toBase58())}</a></div>

        {paid ? (
          <div className="space-y-3 rounded-xl bg-emerald-500/10 p-5">
            <div className="text-4xl">🎉</div>
            <div className="text-xl font-bold text-emerald-300">Paid — split settled on-chain</div>
            {sig && <a className="btn btn-ghost" href={solscanTx(sig)} target="_blank" rel="noreferrer">View on Solscan ↗</a>}
            <div>
              <Link className="text-sm text-teal-300 underline" href={`/invoice/${creator}/${id}/act`}>📄 Open Act of Completed Works</Link>
            </div>
          </div>
        ) : publicKey ? (
          <button className="btn w-full text-lg" onClick={pay} disabled={busy}>
            {busy ? "Confirm in wallet…" : `Pay ${lamportsToSol(invoice.amount)} SOL`}
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <WalletMultiButton>Connect &amp; Pay</WalletMultiButton>
            <span className="text-xs text-slate-500">Phantom, Solflare, or a built-in test wallet</span>
            <Link className="text-sm text-teal-300 underline" href="/demo">Use a demo wallet (no extension)</Link>
          </div>
        )}
        {err && <p className="break-words text-sm text-red-400">{err}</p>}
      </div>

      <div className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-300">⚡ Where your payment goes — instantly, atomically</h2>
        <ul className="divide-y divide-white/5 text-sm">
          {rows.map(([label, addr, amt]) => (
            <li key={label + addr} className="flex items-center justify-between py-2">
              <span>{label}<span className="ml-2 font-mono text-xs text-slate-500">{short(addr)}</span></span>
              <span className="font-semibold">{lamportsToSol(amt)} SOL</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

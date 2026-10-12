"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { cancelInvoiceIx, fetchInvoicesByCreator, type InvoiceAccount } from "@/lib/program";
import { computeSplit } from "@/lib/split";
import { lamportsToSol, short, solscanAddr } from "@/lib/format";

export default function ProfilePage({ params }: { params: Promise<{ wallet: string }> }) {
  const { wallet } = use(params);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [items, setItems] = useState<InvoiceAccount[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setItems(await fetchInvoicesByCreator(connection, new PublicKey(wallet)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load profile");
    }
  }, [connection, wallet]);
  useEffect(() => { void load(); }, [load]);

  const isOwner = publicKey?.toBase58() === wallet;

  async function cancel(inv: InvoiceAccount) {
    if (!publicKey) return;
    setBusyId(inv.invoiceId.toString());
    setError(null);
    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const tx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add(cancelInvoiceIx(inv));
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyId(null);
    }
  }

  let valid = true;
  try { new PublicKey(wallet); } catch { valid = false; }
  if (!valid) return <p className="text-red-400">Invalid wallet address.</p>;

  const paid = (items ?? []).filter((i) => i.isPaid);
  const open = (items ?? []).filter((i) => !i.isPaid);
  const gross = paid.reduce((s, i) => s + i.amount, 0n);
  const net = paid.reduce((s, i) => s + computeSplit(i.amount, i.vaultBps, i.collaboratorBps).creator, 0n);
  const saved = paid.reduce((s, i) => s + computeSplit(i.amount, i.vaultBps, i.collaboratorBps).vault, 0n);

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-sky-600 text-3xl">🏹</div>
        <div className="flex-1">
          <div className="inline-block rounded-full bg-teal-400/15 px-3 py-1 text-xs font-semibold text-teal-300">★ Verified Steppe Nomad (Kazakhstan)</div>
          <h1 className="mt-1 break-all font-mono text-lg">{wallet}</h1>
          <a className="text-xs text-slate-400 underline" href={solscanAddr(wallet)} target="_blank" rel="noreferrer">View wallet on Solscan ↗</a>
        </div>
      </div>

      {!items && !error && <p className="text-slate-400">Reading on-chain reputation…</p>}
      {error && <p className="break-words text-red-400">{error}</p>}

      {items && (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              ["Paid invoices", String(paid.length)],
              ["Total billed", `${lamportsToSol(gross)} SOL`],
              ["Net to freelancer", `${lamportsToSol(net)} SOL`],
              ["Auto-saved in vault", `${lamportsToSol(saved)} SOL`],
            ].map(([k, v]) => (
              <div key={k} className="card"><div className="text-xs text-slate-400">{k}</div><div className="mt-1 text-2xl font-bold">{v}</div></div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Computed live from this wallet&apos;s on-chain invoice accounts — portable reputation, not a platform rating. Cancelled invoices are closed on-chain and never count against the record.
          </p>

          <div className="card">
            <h2 className="mb-3 font-semibold">Invoices</h2>
            {items.length === 0 && <p className="text-sm text-slate-400">No invoices yet.</p>}
            <ul className="divide-y divide-white/5">
              {items.map((i) => (
                <li key={i.address.toBase58()} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${i.isPaid ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>{i.isPaid ? "PAID" : "OPEN"}</span>
                  <span className="flex-1 font-medium">{i.title}</span>
                  <span className="font-mono">{lamportsToSol(i.amount)} SOL</span>
                  <Link className="text-teal-300 underline" href={`/pay/${wallet}/${i.invoiceId}`}>{i.isPaid ? "Receipt" : "Checkout"}</Link>
                  {i.isPaid && <Link className="text-teal-300 underline" href={`/invoice/${wallet}/${i.invoiceId}/act`}>Акт</Link>}
                  {!i.isPaid && isOwner && (
                    <button className="btn btn-ghost !py-1" disabled={busyId === i.invoiceId.toString()} onClick={() => cancel(i)}>
                      {busyId === i.invoiceId.toString() ? "Cancelling…" : "Cancel & reclaim rent"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {open.length > 0 && <p className="mt-2 text-xs text-slate-500">{open.length} open · {short(wallet)}</p>}
          </div>
        </>
      )}
    </div>
  );
}

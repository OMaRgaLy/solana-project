"use client";

import { useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import SplitDonut from "@/components/SplitDonut";
import BlinkPreview from "@/components/BlinkPreview";
import ShareCard from "@/components/ShareCard";
import { initializeInvoiceIx, PROGRAM_ID } from "@/lib/program";
import { computeSplit, validateSplit } from "@/lib/split";
import { lamportsToSol, solToLamports } from "@/lib/format";

const parseKey = (s: string): PublicKey | null => {
  try { return s.trim() ? new PublicKey(s.trim()) : null; } catch { return null; }
};

export default function CreatePage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [title, setTitle] = useState("Landing page design");
  const [client, setClient] = useState("Acme Inc. (USA)");
  const [amountStr, setAmountStr] = useState("1");
  const [vaultPct, setVaultPct] = useState(10);
  const [useCollab, setUseCollab] = useState(false);
  const [collabPct, setCollabPct] = useState(5);
  const [collabAddr, setCollabAddr] = useState("");
  const [vaultAddr, setVaultAddr] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ creator: string; id: string; sig: string } | null>(null);

  const amount = solToLamports(amountStr);
  const vaultBps = Math.round(vaultPct * 100);
  const collabBps = useCollab ? Math.round(collabPct * 100) : 0;
  const collabKey = useCollab ? parseKey(collabAddr) : null;
  const vaultKey = parseKey(vaultAddr) || publicKey;

  const problem = useMemo(() => {
    if (!title.trim()) return "Enter a task title";
    if (title.length > 64) return "Title must be 64 characters or fewer";
    if (!amount || amount <= 0n) return "Enter a valid SOL amount (up to 9 decimals)";
    if (vaultAddr.trim() && !parseKey(vaultAddr)) return "Vault address is not a valid Solana address";
    if (useCollab && collabBps > 0 && !collabKey) return "Enter a valid collaborator wallet address";
    return validateSplit(vaultBps, collabBps, !!collabKey);
  }, [title, amount, vaultAddr, useCollab, collabBps, collabKey, vaultBps]);

  const split = amount ? computeSplit(amount, vaultBps, collabBps) : null;
  const creatorPct = 100 - vaultPct - (useCollab ? collabPct : 0);

  async function deploy() {
    if (!publicKey || !amount || !vaultKey) return;
    setBusy(true);
    setError(null);
    try {
      const invoiceId = BigInt(Date.now());
      const ix = initializeInvoiceIx({
        creator: publicKey, invoiceId, amount, title: title.trim(), vault: vaultKey,
        vaultBps, collaborator: collabKey, collaboratorBps: collabBps,
      });
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const tx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add(ix);
      const sig = await sendTransaction(tx, connection);
      const res = await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
      if (res.value.err) throw new Error("Transaction failed on-chain: " + JSON.stringify(res.value.err));
      setCreated({ creator: publicKey.toBase58(), id: invoiceId.toString(), sig });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (created) {
    return (
      <ShareCard
        creator={created.creator} id={created.id} sig={created.sig} title={title}
        amountSol={lamportsToSol(amount ?? 0n)} client={client} vaultPct={vaultPct} collabPct={useCollab ? collabPct : 0}
      />
    );
  }

  const programMissing = PROGRAM_ID.toBase58() === "11111111111111111111111111111111";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card space-y-4">
        <h1 className="text-2xl font-bold">New invoice</h1>
        <div>
          <label className="label">Task title (stored on-chain, ≤ 64 chars)</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={64} />
        </div>
        <div>
          <label className="label">Client</label>
          <input className="input" value={client} onChange={(e) => setClient(e.target.value)} />
        </div>
        <div>
          <label className="label">Amount (SOL)</label>
          <input className="input" inputMode="decimal" value={amountStr} onChange={(e) => setAmountStr(e.target.value)} />
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">🏦 Yield / Tax Savings Vault</span>
            <span>{vaultPct}%</span>
          </div>
          <input type="range" min={0} max={50} step={1} value={vaultPct} onChange={(e) => setVaultPct(+e.target.value)} className="mt-2 w-full accent-teal-400" />
          <label className="label mt-2">Vault wallet (defaults to your wallet)</label>
          <input className="input" placeholder={publicKey?.toBase58() ?? "Connect wallet"} value={vaultAddr} onChange={(e) => setVaultAddr(e.target.value)} />
          <p className="mt-1 text-xs text-slate-500">Point this at your savings / tax wallet. Roadmap: route into Kamino / Jito / Lulo yield vaults.</p>
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={useCollab} onChange={(e) => setUseCollab(e.target.checked)} /> 🤝 Collaborator split
          </label>
          {useCollab && (
            <>
              <div className="mt-2 flex justify-between text-sm"><span>Share</span><span>{collabPct}%</span></div>
              <input type="range" min={0} max={50} step={1} value={collabPct} onChange={(e) => setCollabPct(+e.target.value)} className="w-full accent-sky-400" />
              <input className="input mt-2" placeholder="Collaborator wallet address" value={collabAddr} onChange={(e) => setCollabAddr(e.target.value)} />
            </>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="card">
          <h2 className="mb-4 font-semibold">Live auto-split</h2>
          <SplitDonut
            center={amount ? `${lamportsToSol(amount)} SOL` : "—"}
            parts={[
              { label: "Freelancer", value: creatorPct, color: "#14c8a4" },
              { label: "Savings Vault", value: vaultPct, color: "#f59e0b" },
              ...(useCollab ? [{ label: "Collaborator", value: collabPct, color: "#38bdf8" }] : []),
            ]}
          />
          {split && (
            <p className="mt-4 text-xs text-slate-400">
              You: {lamportsToSol(split.creator)} · Vault: {lamportsToSol(split.vault)}
              {useCollab && <> · Collaborator: {lamportsToSol(split.collaborator)}</>} SOL — transferred atomically in the same transaction as the payment.
            </p>
          )}
        </div>

        <div className="card">
          {programMissing && <p className="mb-3 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-300">Program ID not configured (NEXT_PUBLIC_PROGRAM_ID).</p>}
          {problem && <p className="mb-3 text-sm text-amber-300">{problem}</p>}
          {error && <p className="mb-3 break-words text-sm text-red-400">{error}</p>}
          <button className="btn w-full" disabled={!publicKey || !!problem || busy || programMissing} onClick={deploy}>
            {busy ? "Waiting for wallet / network…" : publicKey ? "Deploy Invoice to Devnet" : "Connect wallet to continue"}
          </button>
        </div>

        <BlinkPreview
          iconUrl="/preview-banner.svg"
          domain="steppeinvoice.app"
          title={`${title || "Invoice"} — ${amount ? lamportsToSol(amount) : "…"} SOL`}
          description={`⚡ Auto-split: ${creatorPct}% Freelancer · ${vaultPct}% Savings Vault${useCollab ? ` · ${collabPct}% Collaborator` : ""}`}
        />
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import type { WalletName } from "@solana/wallet-adapter-base";
import { DEMO_WALLETS } from "@/lib/demoWallets";
import { lamportsToSol, solscanAddr } from "@/lib/format";
import { errText, log } from "@/lib/log";

const SIGNERS = ["freelancer", "client1", "client2"];

export default function DemoPage() {
  const { connection } = useConnection();
  const { wallet, select, connect, connected, connecting, publicKey, disconnect } = useWallet();
  const [balances, setBalances] = useState<Record<string, number | null>>({});
  const [pending, setPending] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const next: Record<string, number | null> = {};
    await Promise.all(
      DEMO_WALLETS.map(async (w) => {
        try {
          next[w.id] = await connection.getBalance(new PublicKey(w.publicKey), "confirmed");
        } catch {
          next[w.id] = null;
        }
      }),
    );
    setBalances(next);
  }, [connection]);

  useEffect(() => {
    void refresh();
    const t = setInterval(refresh, 10000);
    return () => clearInterval(t);
  }, [refresh]);

  // select() is async state; connect once the chosen adapter is active.
  useEffect(() => {
    if (pending && wallet?.adapter.name === pending && !connected && !connecting) {
      const name = pending;
      setPending(null);
      // Child effects run before the wallet provider attaches its "connect" listener; wait a tick so the event is not lost.
      setTimeout(() => {
        connect()
          .then(() => log("ok", `Connected demo wallet "${name}"`))
          .catch((e) => log("error", `Connect failed: ${errText(e)}`));
      }, 100);
    }
  }, [pending, wallet, connected, connecting, connect]);

  function switchTo(label: string) {
    log("info", `Switching to demo wallet "${label}"…`);
    void (async () => {
      if (connected) await disconnect();
      setPending(label);
      select(label as WalletName);
    })();
  }

  return (
    <div className="space-y-6">
      <div className="card space-y-2">
        <h1 className="text-2xl font-bold">Demo wallets — no extension, no real money</h1>
        <p className="text-sm text-slate-300">
          These are public wallets on <b>Solana Devnet</b> (a test network). Their coins are worthless test SOL, and their keys are published on purpose so anyone can try the product.
          Everything you do is a real transaction on the test blockchain: click any address to inspect it on Solscan.
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-300">
          <li>Press <b>Use this wallet</b> on <b>Demo Freelancer</b>, open <Link className="text-teal-300 underline" href="/create">Create invoice</Link> and deploy it (use the “Demo Savings Vault” and “Demo Collaborator” links to see the split).</li>
          <li>Copy the checkout link, come back here, press <b>Use this wallet</b> on <b>Demo Client 1</b>, open the link and pay.</li>
          <li>Watch the balances below change, then open the <b>Act of Completed Works</b>.</li>
        </ol>
        <p className="text-xs text-slate-400">
          Currently connected: {connected && publicKey ? <b>{wallet?.adapter.name} · {publicKey.toBase58().slice(0, 6)}…</b> : "nobody"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {DEMO_WALLETS.map((w) => {
          const active = connected && wallet?.adapter.name === w.label;
          const bal = balances[w.id];
          return (
            <div key={w.id} className={`card space-y-2 ${active ? "ring-2 ring-teal-400" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{w.label}</div>
                <div className="font-mono text-lg">{bal == null ? "…" : `${lamportsToSol(BigInt(bal))} SOL`}</div>
              </div>
              <div className="text-xs text-slate-400">{w.role}</div>
              <a className="block break-all font-mono text-xs text-teal-300 underline" href={solscanAddr(w.publicKey)} target="_blank" rel="noreferrer">{w.publicKey}</a>
              {SIGNERS.includes(w.id) ? (
                <button className="btn w-full" disabled={active} onClick={() => switchTo(w.label)}>
                  {active ? "Connected ✓" : "Use this wallet"}
                </button>
              ) : (
                <div className="text-xs text-slate-500">Receive-only address (paste it into the invoice form).</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

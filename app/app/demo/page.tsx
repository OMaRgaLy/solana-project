"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import type { WalletName } from "@solana/wallet-adapter-base";
import { DEMO_WALLETS } from "@/lib/demoWallets";
import { lamportsToSol, solscanAddr } from "@/lib/format";
import { errText, log } from "@/lib/log";
import { useI18n } from "@/lib/i18n/I18nContext";
import { extra } from "@/lib/i18n/extra";

const SIGNERS = ["freelancer", "client1", "client2"];

export default function DemoPage() {
  const { lang } = useI18n();
  const D = extra[lang].demo;
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
        <h1 className="text-2xl font-bold">{D.title}</h1>
        <p className="text-sm text-slate-300">
          {D.intro}
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-300">
          <li>{D.step1}</li>
          <li>{D.step2}</li>
          <li>{D.step3}</li>
        </ol>
        <p className="text-xs text-slate-400">
          {D.connected}: {connected && publicKey ? <b>{wallet?.adapter.name} · {publicKey.toBase58().slice(0, 6)}…</b> : D.nobody}
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
              <div className="text-xs text-slate-400">{D.roles[w.id] ?? w.role}</div>
              <a className="block break-all font-mono text-xs text-teal-300 underline" href={solscanAddr(w.publicKey)} target="_blank" rel="noreferrer">{w.publicKey}</a>
              {SIGNERS.includes(w.id) ? (
                <button className="btn w-full" disabled={active} onClick={() => switchTo(w.label)}>
                  {active ? D.usedNow : D.use}
                </button>
              ) : (
                <div className="text-xs text-slate-500">{D.receiveOnly}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

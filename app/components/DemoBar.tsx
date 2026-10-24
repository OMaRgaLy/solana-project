"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import type { WalletName } from "@solana/wallet-adapter-base";
import { DEMO_WALLETS } from "@/lib/demoWallets";
import { lamportsToSol, short, solscanAddr } from "@/lib/format";
import { useMode } from "@/lib/mode/ModeContext";
import { useI18n } from "@/lib/i18n/I18nContext";

const SIGNERS = ["freelancer", "client1", "client2"];

export default function DemoBar() {
  const { isDemo, setMode } = useMode();
  const { t } = useI18n();
  const { connection } = useConnection();
  const { wallet, select, connect, connected, connecting, disconnect } = useWallet();
  const [balances, setBalances] = useState<Record<string, number | null>>({});
  const [pending, setPending] = useState<string | null>(null);

  const refreshBalances = useCallback(async () => {
    const next: Record<string, number | null> = {};
    await Promise.all(
      DEMO_WALLETS.map(async (w) => {
        try {
          next[w.id] = await connection.getBalance(new PublicKey(w.publicKey), "confirmed");
        } catch {
          next[w.id] = null;
        }
      })
    );
    setBalances(next);
  }, [connection]);

  useEffect(() => {
    if (!isDemo) return;
    void refreshBalances();
    const interval = setInterval(refreshBalances, 10000);
    return () => clearInterval(interval);
  }, [isDemo, refreshBalances]);

  useEffect(() => {
    if (pending && wallet?.adapter.name === pending && !connected && !connecting) {
      setPending(null);
      setTimeout(() => {
        connect().catch(() => {});
      }, 100);
    }
  }, [pending, wallet, connected, connecting, connect]);

  function switchWallet(label: string) {
    void (async () => {
      if (connected) await disconnect();
      setPending(label);
      select(label as WalletName);
    })();
  }

  if (!isDemo) return null;

  return (
    <div className="demo-bar border-b border-amber-500/20 bg-amber-500/10 px-4 py-2.5 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>🧪 {t.header.demoNotice}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 mr-1">Переключить тест-кошелек:</span>
          {DEMO_WALLETS.filter((w) => SIGNERS.includes(w.id)).map((w) => {
            const active = connected && wallet?.adapter.name === w.label;
            const bal = balances[w.id];
            return (
              <button
                key={w.id}
                onClick={() => switchWallet(w.label)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                  active
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                {w.label} {bal != null ? `(${lamportsToSol(BigInt(bal))} SOL)` : ""}
              </button>
            );
          })}

          <button
            onClick={() => setMode("live")}
            className="ml-2 rounded-lg border border-white/20 bg-black/40 px-2 py-1 text-slate-300 hover:text-white"
            title="Выйти из демо-режима"
          >
            ✕ {t.common.liveMode}
          </button>
        </div>
      </div>
    </div>
  );
}

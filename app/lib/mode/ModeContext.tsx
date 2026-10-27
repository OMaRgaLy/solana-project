"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_NET, MAINNET_READY, NETS, type NetConfig, type NetName } from "../cluster";

export type AppMode = "live" | "demo";

interface ModeContextType {
  /** "live" = mainnet (real money), "demo" = devnet (test SOL, demo wallets). */
  mode: AppMode;
  isDemo: boolean;
  net: NetName;
  config: NetConfig;
  /** False until the contract is deployed on mainnet: then there is nothing to switch back to. */
  mainnetReady: boolean;
  setMode: (m: AppMode) => void;
  setNet: (n: NetName) => void;
}

const toMode = (n: NetName): AppMode => (n === "devnet" ? "demo" : "live");
const toNet = (m: AppMode): NetName => (m === "demo" ? "devnet" : "mainnet");

const ModeContext = createContext<ModeContextType>({
  mode: toMode(DEFAULT_NET),
  isDemo: DEFAULT_NET === "devnet",
  net: DEFAULT_NET,
  config: NETS[DEFAULT_NET],
  mainnetReady: MAINNET_READY,
  setMode: () => {},
  setNet: () => {},
});

const KEY = "steppe_net";

export function ModeProvider({ children }: { children: React.ReactNode }) {
  // Every visit starts on the default network (mainnet once it is live). Demo mode lasts for the tab session only.
  const [net, setNetState] = useState<NetName>(DEFAULT_NET);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(KEY) as NetName | null;
      if (saved && NETS[saved]?.configured) setNetState(saved);
    } catch {
      /* private mode: stay on the default */
    }
  }, []);

  const setNet = useCallback((next: NetName) => {
    if (!NETS[next].configured) return;
    setNetState(next);
    try {
      sessionStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const setMode = useCallback((m: AppMode) => setNet(toNet(m)), [setNet]);

  return (
    <ModeContext.Provider
      value={{ mode: toMode(net), isDemo: net === "devnet", net, config: NETS[net], mainnetReady: MAINNET_READY, setMode, setNet }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}

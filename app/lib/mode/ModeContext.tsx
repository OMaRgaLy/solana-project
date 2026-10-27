"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { IS_MAINNET } from "../cluster";

export type AppMode = "live" | "demo";

/** Demo wallets hold public keys, so demo mode only exists off mainnet. */
export const DEMO_ALLOWED = !IS_MAINNET;

interface ModeContextType {
  mode: AppMode;
  isDemo: boolean;
  setMode: (m: AppMode) => void;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType>({
  mode: "live",
  isDemo: false,
  setMode: () => {},
  toggleMode: () => {},
});

export function ModeProvider({ children }: { children: React.ReactNode }) {
  // Live mode is DEFAULT as requested by user
  const [mode, setModeState] = useState<AppMode>("live");

  useEffect(() => {
    const saved = localStorage.getItem("steppe_mode") as AppMode | null;
    if ((saved === "demo" && DEMO_ALLOWED) || saved === "live") {
      setModeState(saved);
    }
  }, []);

  const setMode = (next: AppMode) => {
    if (next === "demo" && !DEMO_ALLOWED) return;
    setModeState(next);
    localStorage.setItem("steppe_mode", next);
  };

  const toggleMode = () => {
    setMode(mode === "live" ? "demo" : "live");
  };

  return (
    <ModeContext.Provider value={{ mode, isDemo: mode === "demo", setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AppMode = "live" | "demo";

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
    if (saved === "demo" || saved === "live") {
      setModeState(saved);
    }
  }, []);

  const setMode = (next: AppMode) => {
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

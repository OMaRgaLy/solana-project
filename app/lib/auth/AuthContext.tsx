"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type User = { id: string; name: string };
type AuthState = {
  user: User | null;
  ready: boolean;
  /** "idle" → "waiting" (bot opened, polling for confirmation) → "unavailable" when the bot is not configured. */
  status: "idle" | "waiting" | "unavailable";
  botUrl: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthState>({
  user: null, ready: false, status: "idle", botUrl: null, login: async () => {}, logout: async () => {},
});

export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<AuthState["status"]>("idle");
  const [botUrl, setBotUrl] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => {})
      .finally(() => setReady(true));
    return stop;
  }, []);

  const login = useCallback(async () => {
    stop();
    const r = await fetch("/api/auth/start", { method: "POST" });
    if (!r.ok) return setStatus("unavailable");
    const { nonce, url } = await r.json();
    setBotUrl(url);
    setStatus("waiting");
    window.open(url, "_blank", "noopener");
    const startedAt = Date.now();
    timer.current = setInterval(async () => {
      if (Date.now() - startedAt > 5 * 60_000) {
        stop();
        return setStatus("idle");
      }
      const c = await fetch(`/api/auth/check?nonce=${nonce}`).then((x) => x.json()).catch(() => null);
      if (c?.confirmed) {
        stop();
        setUser(c.user);
        setStatus("idle");
      }
    }, 2000);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/me", { method: "DELETE" }).catch(() => {});
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, ready, status, botUrl, login, logout }}>{children}</Ctx.Provider>;
}

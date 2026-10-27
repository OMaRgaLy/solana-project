import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "steppe_session";
const TTL_SEC = 60 * 60 * 24 * 30;

export type SessionUser = { id: string; name: string };

// SESSION_SECRET is preferred; the bot token is a safe fallback because it is already a server-only secret.
const secret = () => process.env.SESSION_SECRET || process.env.TELEGRAM_BOT_TOKEN || "";

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function newNonce(): string {
  return randomBytes(12).toString("hex");
}

export function makeToken(user: SessionUser): string {
  const body = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + TTL_SEC })).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readToken(token: string | undefined): SessionUser | null {
  if (!token || !secret()) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof p.id !== "string" || p.exp < Date.now() / 1000) return null;
    return { id: p.id, name: String(p.name ?? "") };
  } catch {
    return null;
  }
}

export async function currentUser(): Promise<SessionUser | null> {
  return readToken((await cookies()).get(SESSION_COOKIE)?.value);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: TTL_SEC,
};

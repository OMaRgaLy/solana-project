import { NextResponse } from "next/server";

export const ACTIONS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Action-Version, X-Blockchain-Ids",
  "Access-Control-Expose-Headers": "X-Action-Version, X-Blockchain-Ids",
  "X-Action-Version": "2.4",
  // Devnet genesis hash (CAIP-2)
  "X-Blockchain-Ids": "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
  "Content-Type": "application/json",
};

export function actionJson(body: unknown, status = 200) {
  return new NextResponse(JSON.stringify(body), { status, headers: ACTIONS_HEADERS });
}

export function actionError(message: string, status = 400) {
  return actionJson({ message }, status);
}

export const actionOptions = () => new NextResponse(null, { status: 204, headers: ACTIONS_HEADERS });

export function originOf(req: Request): string {
  const env = process.env.NEXT_PUBLIC_APP_URL;
  if (env) return env.replace(/\/$/, "");
  const u = new URL(req.url);
  const proto = req.headers.get("x-forwarded-proto") || u.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || u.host;
  return `${proto}://${host}`;
}

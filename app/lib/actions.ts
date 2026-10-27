import { NextResponse } from "next/server";
import { CHAIN_ID, DEFAULT_NET, NETS, type NetName } from "./cluster";

export const ACTIONS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Action-Version, X-Blockchain-Ids",
  "Access-Control-Expose-Headers": "X-Action-Version, X-Blockchain-Ids",
  "X-Action-Version": "2.4",
  "X-Blockchain-Ids": CHAIN_ID,
  "Content-Type": "application/json",
};

export function actionJson(body: unknown, status = 200, net: NetName = DEFAULT_NET) {
  // The chain id tells the Blink client which network the transaction is for.
  return new NextResponse(JSON.stringify(body), { status, headers: { ...ACTIONS_HEADERS, "X-Blockchain-Ids": NETS[net].chainId } });
}

export function actionError(message: string, status = 400, net: NetName = DEFAULT_NET) {
  return actionJson({ message }, status, net);
}

export const actionOptions = () => new NextResponse(null, { status: 204, headers: ACTIONS_HEADERS });

export function originOf(req: Request): string {
  // Always use the host the request came in on, so banners point at the domain that is actually serving the app.
  const u = new URL(req.url);
  const proto = req.headers.get("x-forwarded-proto") || u.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || u.host;
  return `${proto}://${host}`;
}

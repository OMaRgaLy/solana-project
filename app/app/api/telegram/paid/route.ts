import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { notifyIfPaid } from "@/lib/telegram/core";
import { botEnabled } from "@/lib/telegram/api";
import { proxyIfRemote } from "@/lib/proxy";

// Called by the pay page right after a payment. The server re-reads the invoice from chain,
// so a forged call cannot trigger a notification for an unpaid invoice.
export async function POST(req: Request) {
  const remote = await proxyIfRemote(req);
  if (remote) return remote;
  if (!botEnabled()) return NextResponse.json({ sent: false });
  const body = await req.json().catch(() => null);
  try {
    new PublicKey(body?.creator);
    BigInt(body?.id);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  return NextResponse.json({ sent: await notifyIfPaid(body.creator, String(body.id)) });
}

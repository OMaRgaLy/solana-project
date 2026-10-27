import { NextResponse } from "next/server";
import { pollLinkedWallets } from "@/lib/telegram/core";

// Cron fallback for payments made while no browser tab is open. Protected by CRON_SECRET.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("forbidden", { status: 403 });
  }
  return NextResponse.json({ notified: await pollLinkedWallets() });
}

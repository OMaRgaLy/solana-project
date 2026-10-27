import { NextResponse } from "next/server";
import { newNonce } from "@/lib/auth/session";
import { botEnabled, botUsername } from "@/lib/telegram/api";
import { storeIsPersistent } from "@/lib/telegram/store";

// Step 1 of Telegram login: hand the browser a one-time nonce and the bot deep-link that confirms it.
export async function POST() {
  if (!botEnabled() || !botUsername()) return NextResponse.json({ error: "bot_not_configured" }, { status: 503 });
  // On serverless hosting the nonce must outlive one request: without a real database, login would work only
  // when both requests happen to hit the same warm instance. Fail clearly instead of flaking.
  if (!storeIsPersistent()) return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  const nonce = newNonce();
  return NextResponse.json({ nonce, url: `https://t.me/${botUsername()}?start=login_${nonce}` });
}

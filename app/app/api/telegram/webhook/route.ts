import { NextResponse } from "next/server";
import { handleCallback, handleMessage } from "@/lib/telegram/core";

// Register once:
//   https://api.telegram.org/bot<TOKEN>/setWebhook?url=<SITE>/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>
export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return new NextResponse("forbidden", { status: 403 });
  }
  const update = await req.json().catch(() => null);
  const msg = update?.message;
  if (msg?.chat?.id && typeof msg.text === "string") {
    await handleMessage(msg.chat.id, msg.text, msg.from?.language_code, msg.from?.first_name ?? "");
  }
  const cq = update?.callback_query;
  if (cq?.id && cq.message?.chat?.id && typeof cq.data === "string") {
    await handleCallback(cq.id, cq.message.chat.id, cq.data, cq.from?.language_code);
  }
  return NextResponse.json({ ok: true });
}

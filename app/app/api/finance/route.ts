import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth/session";
import { kvGet, kvSet } from "@/lib/telegram/store";

// Per-user finance document (manual income entries + tax settings), stored under the Telegram id.
const MAX_BYTES = 200_000;

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const raw = await kvGet(`finance:${user.id}`);
  return NextResponse.json({ doc: raw ? JSON.parse(raw) : null });
}

export async function PUT(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const text = await req.text();
  if (text.length > MAX_BYTES) return NextResponse.json({ error: "too large" }, { status: 413 });
  try {
    const doc = JSON.parse(text);
    if (!doc || typeof doc !== "object" || !Array.isArray(doc.entries)) throw new Error();
  } catch {
    return NextResponse.json({ error: "bad document" }, { status: 400 });
  }
  await kvSet(`finance:${user.id}`, text);
  return NextResponse.json({ ok: true });
}

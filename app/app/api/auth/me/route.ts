import { NextResponse } from "next/server";
import { currentUser, SESSION_COOKIE } from "@/lib/auth/session";

export async function GET() {
  return NextResponse.json({ user: await currentUser() });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}

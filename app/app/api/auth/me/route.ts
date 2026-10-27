import { NextResponse } from "next/server";
import { currentUser, SESSION_COOKIE } from "@/lib/auth/session";
import { proxyIfRemote } from "@/lib/proxy";

export async function GET(req: Request) {
  const remote = await proxyIfRemote(req);
  if (remote) return remote;
  return NextResponse.json({ user: await currentUser() });
}

export async function DELETE(req: Request) {
  const remote = await proxyIfRemote(req);
  if (remote) return remote;
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}

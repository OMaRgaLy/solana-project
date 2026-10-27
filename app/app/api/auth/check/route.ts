import { NextResponse } from "next/server";
import { cookieOptions, makeToken, SESSION_COOKIE } from "@/lib/auth/session";
import { kvDel, kvGet } from "@/lib/telegram/store";

// Step 2: the browser polls until the bot has confirmed the nonce, then receives the session cookie.
export async function GET(req: Request) {
  const nonce = new URL(req.url).searchParams.get("nonce") ?? "";
  if (!/^[a-f0-9]{24}$/.test(nonce)) return NextResponse.json({ error: "bad nonce" }, { status: 400 });
  const raw = await kvGet(`login:${nonce}`);
  if (!raw) return NextResponse.json({ confirmed: false });
  await kvDel(`login:${nonce}`);
  const user = JSON.parse(raw) as { id: string; name: string };
  const res = NextResponse.json({ confirmed: true, user });
  res.cookies.set(SESSION_COOKIE, makeToken(user), cookieOptions);
  return res;
}

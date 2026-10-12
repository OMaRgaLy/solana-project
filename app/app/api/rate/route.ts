import { NextResponse } from "next/server";


// Indicative SOL→KZT rate for the Act of Works. Falls back to a labelled constant if the feed is down.
const FALLBACK_KZT = 75_000;

export async function GET() {
  try {
    const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=kzt,usd", {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    const kzt = Number(j?.solana?.kzt);
    if (!Number.isFinite(kzt) || kzt <= 0) throw new Error("bad payload");
    return NextResponse.json({ kzt, usd: Number(j.solana.usd) || null, source: "CoinGecko", fallback: false });
  } catch {
    return NextResponse.json({ kzt: FALLBACK_KZT, usd: null, source: "approximate", fallback: true });
  }
}

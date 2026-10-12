import { NextResponse } from "next/server";

// Indicative SOL→KZT rate for the Act of Works: SOL/USD (CoinGecko) × USD/KZT (open.er-api.com).
// If a feed is down we fall back to labelled constants and say so in the document.
const FALLBACK_USD = 110;
const FALLBACK_USD_KZT = 450;

async function json(url: string) {
  const r = await fetch(url, { next: { revalidate: 300 }, signal: AbortSignal.timeout(5000) });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
}

export async function GET() {
  const [sol, fx] = await Promise.allSettled([
    json("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"),
    json("https://open.er-api.com/v6/latest/USD"),
  ]);
  const usd = sol.status === "fulfilled" ? Number(sol.value?.solana?.usd) : NaN;
  const usdKzt = fx.status === "fulfilled" ? Number(fx.value?.rates?.KZT) : NaN;
  const live = Number.isFinite(usd) && usd > 0 && Number.isFinite(usdKzt) && usdKzt > 0;
  const solUsd = live ? usd : FALLBACK_USD;
  const rate = live ? usdKzt : FALLBACK_USD_KZT;
  return NextResponse.json({
    kzt: solUsd * rate,
    usd: solUsd,
    usdKzt: rate,
    source: live ? "CoinGecko + open.er-api.com" : "approximate",
    fallback: !live,
  });
}

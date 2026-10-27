import { ImageResponse } from "next/og";
import { PublicKey } from "@solana/web3.js";
import { findInvoice } from "@/lib/findInvoice";
import { lamportsToSol, pct, short } from "@/lib/format";

// Link-preview banner (Telegram, WhatsApp, X, Blinks). Same palette as the site: graphite, sage, sand.
const TEXT = {
  ru: { paid: "Оплачено", awaiting: "Ждёт оплаты", split: (fee: string) => `Авто-сплит в сети · комиссия ${fee}`, collab: (c: string) => ` · напарник ${c}`, from: "от" },
  kk: { paid: "Төленді", awaiting: "Төлем күтуде", split: (fee: string) => `Желідегі авто-бөлу · комиссия ${fee}`, collab: (c: string) => ` · серіктес ${c}`, from: "кімнен:" },
  en: { paid: "Paid", awaiting: "Awaiting payment", split: (fee: string) => `Auto-split on-chain · ${fee} fee`, collab: (c: string) => ` · ${c} collaborator`, from: "from" },
} as const;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const requested = url.searchParams.get("lang");
  const L = TEXT[requested === "kk" || requested === "en" ? requested : "ru"];
  let title = "SteppeInvoice";
  let amount = "—";
  let paid = false;
  let split = "";
  let by = "";
  try {
    const creator = new PublicKey(url.searchParams.get("creator") || "");
    const inv = await findInvoice(creator, BigInt(url.searchParams.get("id") || "0"));
    if (inv) {
      title = inv.title;
      amount = lamportsToSol(inv.amount);
      paid = inv.isPaid;
      split = `${L.split(pct(inv.vaultBps))}${inv.collaboratorBps ? L.collab(pct(inv.collaboratorBps)) : ""}`;
      by = `${L.from} ${short(creator.toBase58())}`;
    }
  } catch {
    /* fall through to the generic banner */
  }

  const ink = "#e9e7e2";
  const muted = "#8f9298";
  const sage = "#8fb5a6";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 64, color: ink, background: "#0f1216", fontFamily: "sans-serif",
          borderTop: `6px solid ${sage}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>SteppeInvoice</div>
          <div
            style={{
              display: "flex", padding: "8px 20px", borderRadius: 999, fontSize: 24,
              border: `1px solid ${paid ? sage : "rgba(255,255,255,0.18)"}`,
              color: paid ? sage : muted,
            }}
          >
            {paid ? L.paid : L.awaiting}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 600, lineHeight: 1.15, color: muted }}>{title.slice(0, 56)}</div>
          <div style={{ display: "flex", alignItems: "baseline", marginTop: 14 }}>
            <div style={{ display: "flex", fontSize: 128, fontWeight: 600, letterSpacing: -3 }}>{amount}</div>
            <div style={{ display: "flex", fontSize: 44, marginLeft: 18, color: "#c7b186" }}>SOL</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: muted }}>
          <div style={{ display: "flex" }}>{split}</div>
          <div style={{ display: "flex" }}>{by}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

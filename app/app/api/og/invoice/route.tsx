import { ImageResponse } from "next/og";
import { Connection, PublicKey } from "@solana/web3.js";
import { fetchInvoice, RPC_URL } from "@/lib/program";
import { lamportsToSol, pct, short } from "@/lib/format";


export async function GET(req: Request) {
  const url = new URL(req.url);
  let title = "SteppeInvoice";
  let amount = "—";
  let status = "Verified";
  let split = "";
  let by = "";
  try {
    const creator = new PublicKey(url.searchParams.get("creator") || "");
    const inv = await fetchInvoice(new Connection(RPC_URL, "confirmed"), creator, BigInt(url.searchParams.get("id") || "0"));
    if (inv) {
      title = inv.title;
      amount = `${lamportsToSol(inv.amount)} SOL`;
      status = inv.isPaid ? "PAID" : "Verified";
      split = `${pct(inv.vaultBps)} vault${inv.collaboratorBps ? ` · ${pct(inv.collaboratorBps)} collaborator` : ""} · auto-split on-chain`;
      by = `from ${short(creator.toBase58())}`;
    }
  } catch {
    /* fall through to the generic banner */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 56, color: "#fff", background: "linear-gradient(135deg,#0b1d3a 0%,#0e5a6b 55%,#14c8a4 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>SteppeInvoice</div>
          <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: status === "PAID" ? "#22c55e" : "rgba(255,255,255,0.18)", fontSize: 26 }}>
            {status === "PAID" ? "PAID" : "SteppeInvoice Verified"}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 54, fontWeight: 700, lineHeight: 1.1 }}>{title.slice(0, 48)}</div>
          <div style={{ display: "flex", fontSize: 110, fontWeight: 800, marginTop: 12 }}>{amount}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, opacity: 0.9 }}>
          <div style={{ display: "flex" }}>{split}</div>
          <div style={{ display: "flex" }}>{by}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

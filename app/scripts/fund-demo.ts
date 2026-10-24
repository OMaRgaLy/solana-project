// Tops up the demo wallets on Devnet from the project wallet. KEYPAIR=<project wallet json> npx tsx scripts/fund-demo.ts
import { readFileSync } from "fs";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { DEMO_WALLETS } from "../lib/demoWallets";

const target: Record<string, number> = { freelancer: 0.5, client1: 1, client2: 1, vault: 0.01, collaborator: 0.01 };
const conn = new Connection(process.env.RPC || "https://api.devnet.solana.com", "confirmed");
const funder = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(process.env.KEYPAIR!, "utf8"))));

async function main() {
  console.log("funder", funder.publicKey.toBase58(), (await conn.getBalance(funder.publicKey)) / LAMPORTS_PER_SOL, "SOL");
  for (const w of DEMO_WALLETS) {
    const have = await conn.getBalance(new PublicKey(w.publicKey));
    const want = Math.floor(target[w.id] * LAMPORTS_PER_SOL);
    if (have >= want) { console.log(w.label, "ok", have / LAMPORTS_PER_SOL); continue; }
    const sig = await sendAndConfirmTransaction(conn, new Transaction().add(SystemProgram.transfer({ fromPubkey: funder.publicKey, toPubkey: new PublicKey(w.publicKey), lamports: want - have })), [funder]);
    console.log(w.label, w.publicKey, "+", (want - have) / LAMPORTS_PER_SOL, sig.slice(0, 16) + "…");
  }
}
main().catch((e) => { console.error(e); process.exit(1); });

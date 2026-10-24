// Verifies the Solana Action flow end to end: create invoice -> GET metadata -> POST -> sign as payer -> send -> verify split.
// Usage: KEYPAIR=... RPC=... APP=http://localhost:3100 NEXT_PUBLIC_PROGRAM_ID=... npx tsx scripts/blink-e2e.ts
import { readFileSync } from "fs";
import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { fetchInvoice, initializeInvoiceIx } from "../lib/program";

const rpc = process.env.RPC || "https://api.devnet.solana.com";
const app = process.env.APP || "http://localhost:3000";
const conn = new Connection(rpc, "confirmed");
const creator = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(process.env.KEYPAIR!, "utf8"))));

async function main() {
  const payer = Keypair.generate();
  const vault = Keypair.generate();
  const id = BigInt(Date.now());
  const amount = BigInt(0.1 * LAMPORTS_PER_SOL);
  await sendAndConfirmTransaction(conn, new Transaction().add(SystemProgram.transfer({ fromPubkey: creator.publicKey, toPubkey: payer.publicKey, lamports: 0.15 * LAMPORTS_PER_SOL })), [creator]);
  await sendAndConfirmTransaction(conn, new Transaction().add(initializeInvoiceIx({
    creator: creator.publicKey, invoiceId: id, amount, title: "Blink E2E", vault: vault.publicKey, vaultBps: 1000, collaborator: null, collaboratorBps: 0,
  })), [creator]);

  const url = `${app}/api/actions/invoice/${creator.publicKey.toBase58()}/${id}`;
  const meta = await (await fetch(url)).json();
  console.log("GET  ->", meta.title, "|", meta.label, "| disabled:", !!meta.disabled);
  if (meta.label !== "Pay Invoice" || meta.disabled) throw new Error("unexpected metadata");

  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ account: payer.publicKey.toBase58() }) });
  const body = await res.json();
  console.log("POST ->", res.status, body.type, "|", body.message);
  const tx = Transaction.from(Buffer.from(body.transaction, "base64"));
  tx.partialSign(payer);
  const sig = await conn.sendRawTransaction(tx.serialize());
  await conn.confirmTransaction(sig, "confirmed");

  const after = await fetchInvoice(conn, creator.publicKey, id);
  const v = await conn.getBalance(vault.publicKey);
  console.log("paid:", after?.isPaid, "vault balance:", v);
  if (!after?.isPaid || v !== Number(amount) / 10) throw new Error("split mismatch");

  const again = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ account: payer.publicKey.toBase58() }) });
  console.log("POST again ->", again.status, (await again.json()).message);
  console.log("BLINK E2E OK");
}
main().catch((e) => { console.error(e); process.exit(1); });

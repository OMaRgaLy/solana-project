// End-to-end smoke test: create an invoice and pay it on any cluster.
// Usage: KEYPAIR=/path/id.json RPC=http://127.0.0.1:8899 NEXT_PUBLIC_PROGRAM_ID=<id> npx tsx scripts/smoke.ts
import { readFileSync } from "fs";
import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { fetchInvoice, initializeInvoiceIx, payInvoiceIx, PROGRAM_ID } from "../lib/program";
import { solscanTx } from "../lib/format";

const rpc = process.env.RPC || "https://api.devnet.solana.com";
const conn = new Connection(rpc, "confirmed");
const creator = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(process.env.KEYPAIR!, "utf8"))));

async function main() {
  console.log("program", PROGRAM_ID.toBase58(), "creator", creator.publicKey.toBase58());
  const payer = Keypair.generate();
  const vault = Keypair.generate();
  const collab = Keypair.generate();
  const amount = BigInt(Math.floor(0.1 * LAMPORTS_PER_SOL));
  const id = BigInt(Date.now());

  await sendAndConfirmTransaction(conn, new Transaction().add(SystemProgram.transfer({ fromPubkey: creator.publicKey, toPubkey: payer.publicKey, lamports: 0.15 * LAMPORTS_PER_SOL })), [creator]);

  const createSig = await sendAndConfirmTransaction(conn, new Transaction().add(initializeInvoiceIx({
    creator: creator.publicKey, invoiceId: id, amount, title: "Smoke test invoice", vault: vault.publicKey, vaultBps: 1000,
    collaborator: collab.publicKey, collaboratorBps: 500,
  })), [creator]);
  console.log("created ", solscanTx(createSig));

  const inv = await fetchInvoice(conn, creator.publicKey, id);
  if (!inv || inv.isPaid || inv.title !== "Smoke test invoice") throw new Error("decode mismatch: " + JSON.stringify(inv, (_, v) => (typeof v === "bigint" ? v.toString() : v)));

  const paySig = await sendAndConfirmTransaction(conn, new Transaction().add(payInvoiceIx(inv, payer.publicKey)), [payer]);
  console.log("paid    ", solscanTx(paySig));

  const [v, c] = [await conn.getBalance(vault.publicKey), await conn.getBalance(collab.publicKey)];
  const after = await fetchInvoice(conn, creator.publicKey, id);
  console.log({ vault: v, collab: c, isPaid: after?.isPaid, payer: after?.payer?.toBase58() });
  if (v !== Number(amount) / 10 || c !== Number(amount) / 20 || !after?.isPaid) throw new Error("split mismatch");
  console.log(`BLINK_URL_PATH /api/actions/invoice/${creator.publicKey.toBase58()}/${id}`);
  console.log("SMOKE OK");
}
main().catch((e) => { console.error(e); process.exit(1); });

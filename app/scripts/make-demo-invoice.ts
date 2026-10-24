// Creates an UNPAID demo invoice on the configured cluster so a human can pay it from a browser wallet.
import { readFileSync } from "fs";
import { Connection, Keypair, LAMPORTS_PER_SOL, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { initializeInvoiceIx } from "../lib/program";

const conn = new Connection(process.env.RPC || "https://api.devnet.solana.com", "confirmed");
const creator = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(process.env.KEYPAIR!, "utf8"))));
const id = BigInt(Date.now());
sendAndConfirmTransaction(conn, new Transaction().add(initializeInvoiceIx({
  creator: creator.publicKey, invoiceId: id, amount: BigInt(0.05 * LAMPORTS_PER_SOL),
  title: "Landing page design", vault: creator.publicKey, vaultBps: 1000, collaborator: null, collaboratorBps: 0,
})), [creator]).then((sig) => {
  console.log("created", sig);
  console.log(`PAY PATH /pay/${creator.publicKey.toBase58()}/${id}`);
});

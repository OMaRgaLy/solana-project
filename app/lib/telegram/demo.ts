// Full demo path inside the bot. The demo wallets' keys are published on purpose (see lib/demoWallets.ts) and
// hold worthless devnet SOL, so the server can sign for them: create an invoice as "Demo Freelancer" and pay
// it as "Demo Client 1". This never runs against a real network.
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { DEMO_WALLETS } from "../demoWallets";
import { fetchInvoice, initializeInvoiceIx, payInvoiceIx } from "../program";
import { NETS } from "../cluster";
import { solToLamports } from "../format";

const DEFAULT_AMOUNT = "0.01";
const MAX_LAMPORTS = 100_000_000n; // 0.1 SOL: keeps the shared demo wallets from being drained
const FEE_BPS = 100; // 1% service fee, same as the website
const COLLAB_BPS = 1500; // a 15% collaborator share, so the split is visible

const wallet = (id: string) => DEMO_WALLETS.find((w) => w.id === id)!;
const keypair = (id: string) => Keypair.fromSecretKey(Uint8Array.from(wallet(id).secretKey));
// Always devnet, whatever the site's default network is: the published demo keys must never touch mainnet.
const conn = () => new Connection(NETS.devnet.rpc, "confirmed");

export const demoAvailable = () => NETS.devnet.configured;

/** The contract limits titles to 64 BYTES; Cyrillic letters take two each. */
export function truncateBytes(s: string, max: number): string {
  let out = "";
  for (const ch of s) {
    if (new TextEncoder().encode(out + ch).length > max) break;
    out += ch;
  }
  return out;
}

/** Parses "<title> [amount]" the user typed after /demo; falls back to defaults. */
export function parseDemoArgs(arg: string, fallbackTitle: string): { title: string; amountSol: string } {
  const m = /^(.*?)(?:\s+(\d+(?:[.,]\d{1,9})?))?$/.exec(arg.trim());
  const title = truncateBytes((m?.[1] ?? "").trim(), 64) || fallbackTitle;
  const raw = (m?.[2] ?? DEFAULT_AMOUNT).replace(",", ".");
  const lamports = solToLamports(raw);
  const amountSol = lamports && lamports > 0n && lamports <= MAX_LAMPORTS ? raw : DEFAULT_AMOUNT;
  return { title, amountSol };
}

export async function createDemoInvoice(title: string, amountSol: string): Promise<{ creator: string; id: string }> {
  const freelancer = keypair("freelancer");
  const invoiceId = BigInt(Date.now());
  const ix = initializeInvoiceIx({
    creator: freelancer.publicKey,
    invoiceId,
    amount: solToLamports(amountSol)!,
    title,
    vault: new PublicKey(wallet("vault").publicKey),
    vaultBps: FEE_BPS,
    collaborator: new PublicKey(wallet("collaborator").publicKey),
    collaboratorBps: COLLAB_BPS,
    net: "devnet",
  });
  await sendAndConfirmTransaction(conn(), new Transaction().add(ix), [freelancer], { commitment: "confirmed" });
  return { creator: freelancer.publicKey.toBase58(), id: invoiceId.toString() };
}

export type PayResult = "ok" | "already_paid" | "not_found" | "no_funds" | "failed";

export async function payDemoInvoice(creator: string, id: string): Promise<PayResult> {
  const c = conn();
  try {
    const inv = await fetchInvoice(c, new PublicKey(creator), BigInt(id), "devnet");
    if (!inv) return "not_found";
    if (inv.isPaid) return "already_paid";
    // Only invoices issued by the demo freelancer, and only small ones: the demo client is a shared wallet.
    if (inv.creator.toBase58() !== wallet("freelancer").publicKey || inv.amount > MAX_LAMPORTS) return "failed";
    const client = keypair("client1");
    if (BigInt(await c.getBalance(client.publicKey, "confirmed")) < inv.amount + 10_000n) return "no_funds";
    await sendAndConfirmTransaction(c, new Transaction().add(payInvoiceIx(inv, client.publicKey)), [client], {
      commitment: "confirmed",
    });
    return "ok";
  } catch {
    return "failed";
  }
}

import { PublicKey, Transaction } from "@solana/web3.js";
import { NETS } from "@/lib/cluster";
import { actionError, actionJson, actionOptions, originOf } from "@/lib/actions";
import { connectionFor, findInvoice } from "@/lib/findInvoice";
import { lamportsToSol, splitLabel } from "@/lib/format";
import { payInvoiceIx } from "@/lib/program";

export const OPTIONS = actionOptions;

type Ctx = { params: Promise<{ creator: string; id: string }> };

async function load(ctx: Ctx) {
  const { creator, id } = await ctx.params;
  try {
    // The invoice may live on mainnet or on devnet: find it, and answer for that network.
    return { invoice: await findInvoice(new PublicKey(creator), BigInt(id)), creator, id };
  } catch {
    return null;
  }
}

export async function GET(req: Request, ctx: Ctx) {
  const loaded = await load(ctx);
  const origin = originOf(req);
  if (!loaded) return actionError("Invalid invoice link", 400);
  const { invoice, creator, id } = loaded;
  const icon = `${origin}/api/og/invoice?creator=${creator}&id=${id}`;

  if (!invoice) {
    return actionJson({
      type: "action",
      icon,
      title: "Invoice not found",
      description: "This invoice does not exist or was cancelled by the freelancer.",
      label: "Unavailable",
      disabled: true,
      error: { message: "Invoice not found" },
    });
  }

  const amount = lamportsToSol(invoice.amount);
  const creatorShort = `${creator.slice(0, 4)}…${creator.slice(-4)}`;
  return actionJson(
    {
      type: "action",
      icon,
      title: `${invoice.title} — ${amount} SOL`,
      description: `Invoice from freelancer ${creatorShort}. ${splitLabel(invoice)}. Verified on ${NETS[invoice.net].label} by SteppeInvoice.`,
      label: invoice.isPaid ? "Already paid" : "Pay Invoice",
      disabled: invoice.isPaid,
      ...(invoice.isPaid ? { error: { message: "This invoice has already been paid" } } : {}),
    },
    200,
    invoice.net,
  );
}

export async function POST(req: Request, ctx: Ctx) {
  let account: PublicKey;
  try {
    const body = await req.json();
    account = new PublicKey(body?.account);
  } catch {
    return actionError("Request body must be { account: <wallet public key> }");
  }
  const loaded = await load(ctx);
  if (!loaded) return actionError("Invalid invoice link");
  const { invoice } = loaded;
  if (!invoice) return actionError("Invoice not found or cancelled", 404);
  if (invoice.isPaid) return actionError("This invoice has already been paid", 409, invoice.net);

  const conn = connectionFor(invoice.net);
  const balance = await conn.getBalance(account, "confirmed");
  if (BigInt(balance) < invoice.amount) {
    return actionError(`Insufficient balance: need ${lamportsToSol(invoice.amount)} SOL plus network fee`, 400, invoice.net);
  }

  const { blockhash } = await conn.getLatestBlockhash("confirmed");
  const tx = new Transaction({ feePayer: account, recentBlockhash: blockhash }).add(payInvoiceIx(invoice, account));
  const transaction = tx.serialize({ requireAllSignatures: false, verifySignatures: false }).toString("base64");

  return actionJson(
    {
      type: "transaction",
      transaction,
      message: `Paying ${lamportsToSol(invoice.amount)} SOL for "${invoice.title}" — funds split instantly on-chain.`,
    },
    200,
    invoice.net,
  );
}

import { createHash } from "crypto";
import bs58 from "bs58";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || "11111111111111111111111111111111",
);
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";
export const CLUSTER = "devnet";

const disc = (prefix: string, name: string) =>
  createHash("sha256").update(`${prefix}:${name}`).digest().subarray(0, 8);

export const INVOICE_DISC = disc("account", "Invoice");
export const PAID_EVENT_DISC = disc("event", "InvoicePaidEvent");

export type InvoiceAccount = {
  address: PublicKey;
  creator: PublicKey;
  invoiceId: bigint;
  amount: bigint;
  assetType: number;
  vaultRecipient: PublicKey;
  vaultBps: number;
  collaborator: PublicKey | null;
  collaboratorBps: number;
  payer: PublicKey | null;
  isPaid: boolean;
  createdAt: number;
  paidAt: number | null;
  title: string;
  bump: number;
};

export function invoicePda(creator: PublicKey, invoiceId: bigint): PublicKey {
  const id = Buffer.alloc(8);
  id.writeBigUInt64LE(invoiceId);
  return PublicKey.findProgramAddressSync([Buffer.from("invoice"), creator.toBuffer(), id], PROGRAM_ID)[0];
}

export function decodeInvoice(address: PublicKey, data: Buffer): InvoiceAccount {
  if (!data.subarray(0, 8).equals(INVOICE_DISC)) throw new Error("Not an invoice account");
  let o = 8;
  const pk = () => new PublicKey(data.subarray(o, (o += 32)));
  const u8 = () => data[o++];
  const u16 = () => { const v = data.readUInt16LE(o); o += 2; return v; };
  const u64 = () => { const v = data.readBigUInt64LE(o); o += 8; return v; };
  const i64 = () => { const v = data.readBigInt64LE(o); o += 8; return Number(v); };
  // Option<T> is variable length in borsh: tag byte then value only when Some.
  const opt = <T,>(read: () => T): T | null => (u8() ? read() : null);

  const creator = pk();
  const invoiceId = u64();
  const amount = u64();
  const assetType = u8();
  const vaultRecipient = pk();
  const vaultBps = u16();
  const collaborator = opt(pk);
  const collaboratorBps = u16();
  const payer = opt(pk);
  const isPaid = u8() === 1;
  const createdAt = i64();
  const paidAt = opt(i64);
  const len = data.readUInt32LE(o); o += 4;
  const title = data.subarray(o, o + len).toString("utf8"); o += len;
  const bump = u8();
  return { address, creator, invoiceId, amount, assetType, vaultRecipient, vaultBps, collaborator, collaboratorBps, payer, isPaid, createdAt, paidAt, title, bump };
}

export async function fetchInvoice(conn: Connection, creator: PublicKey, invoiceId: bigint): Promise<InvoiceAccount | null> {
  const address = invoicePda(creator, invoiceId);
  const info = await conn.getAccountInfo(address, "confirmed");
  if (!info || !info.owner.equals(PROGRAM_ID)) return null;
  return decodeInvoice(address, info.data as Buffer);
}

export async function fetchInvoicesByCreator(conn: Connection, creator: PublicKey): Promise<InvoiceAccount[]> {
  const accounts = await conn.getProgramAccounts(PROGRAM_ID, {
    commitment: "confirmed",
    filters: [
      { memcmp: { offset: 0, bytes: bs58.encode(INVOICE_DISC) } },
      { memcmp: { offset: 8, bytes: creator.toBase58() } },
    ],
  });
  return accounts
    .map((a) => decodeInvoice(a.pubkey, a.account.data as Buffer))
    .sort((a, b) => Number(b.invoiceId - a.invoiceId));
}

const u64le = (v: bigint) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(v); return b; };
const u16le = (v: number) => { const b = Buffer.alloc(2); b.writeUInt16LE(v); return b; };

export type CreateParams = {
  creator: PublicKey;
  invoiceId: bigint;
  amount: bigint;
  title: string;
  vault: PublicKey;
  vaultBps: number;
  collaborator: PublicKey | null;
  collaboratorBps: number;
};

export function initializeInvoiceIx(p: CreateParams): TransactionInstruction {
  const title = Buffer.from(p.title, "utf8");
  const titleLen = Buffer.alloc(4);
  titleLen.writeUInt32LE(title.length);
  const data = Buffer.concat([
    disc("global", "initialize_invoice"),
    u64le(p.invoiceId),
    u64le(p.amount),
    titleLen,
    title,
    p.vault.toBuffer(),
    u16le(p.vaultBps),
    p.collaborator ? Buffer.concat([Buffer.from([1]), p.collaborator.toBuffer()]) : Buffer.from([0]),
    u16le(p.collaboratorBps),
  ]);
  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: invoicePda(p.creator, p.invoiceId), isSigner: false, isWritable: true },
      { pubkey: p.creator, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });
}

export function payInvoiceIx(inv: InvoiceAccount, payer: PublicKey): TransactionInstruction {
  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: inv.address, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: inv.creator, isSigner: false, isWritable: true },
      { pubkey: inv.vaultRecipient, isSigner: false, isWritable: true },
      // Anchor encodes a missing optional account as the program id.
      inv.collaborator
        ? { pubkey: inv.collaborator, isSigner: false, isWritable: true }
        : { pubkey: PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: disc("global", "pay_invoice"),
  });
}

export function cancelInvoiceIx(inv: InvoiceAccount): TransactionInstruction {
  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: inv.address, isSigner: false, isWritable: true },
      { pubkey: inv.creator, isSigner: true, isWritable: true },
    ],
    data: disc("global", "cancel_invoice"),
  });
}

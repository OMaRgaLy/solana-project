import bs58 from "bs58";
import { DEFAULT_RPC } from "./cluster";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || "11111111111111111111111111111111",
);
export { CLUSTER } from "./cluster";
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || DEFAULT_RPC;

// Anchor discriminators, copied from target/idl/steppe_invoice.json (sha256("<kind>:<name>")[0..8]).
const DISC = {
  initialize_invoice: [133, 150, 221, 0, 227, 119, 139, 200],
  pay_invoice: [104, 6, 62, 239, 197, 206, 208, 220],
  cancel_invoice: [88, 158, 54, 49, 53, 26, 92, 68],
  Invoice: [51, 194, 250, 114, 6, 104, 18, 164],
  InvoicePaidEvent: [201, 31, 158, 13, 50, 47, 66, 53],
} as const;
function u64le(v: bigint): Buffer {
  const b = new Uint8Array(8);
  new DataView(b.buffer).setBigUint64(0, v, true);
  return Buffer.from(b);
}
function u16le(v: number): Buffer {
  const b = new Uint8Array(2);
  new DataView(b.buffer).setUint16(0, v, true);
  return Buffer.from(b);
}
const disc = (name: keyof typeof DISC) => Buffer.from(DISC[name]);

export const INVOICE_DISC = disc("Invoice");
export const PAID_EVENT_DISC = disc("InvoicePaidEvent");

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
  const id = u64le(invoiceId);
  return PublicKey.findProgramAddressSync([Buffer.from("invoice"), creator.toBuffer(), id], PROGRAM_ID)[0];
}

export function decodeInvoice(address: PublicKey, data: Uint8Array): InvoiceAccount {
  // DataView instead of Buffer.readBigUInt64LE etc.: the browser Buffer polyfill lacks the BigInt methods.
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (!INVOICE_DISC.every((b, i) => data[i] === b)) throw new Error("Not an invoice account");
  let o = 8;
  const pk = () => new PublicKey(data.slice(o, (o += 32)));
  const u8 = () => data[o++];
  const u16 = () => { const v = dv.getUint16(o, true); o += 2; return v; };
  const u64 = () => { const v = dv.getBigUint64(o, true); o += 8; return v; };
  const i64 = () => { const v = dv.getBigInt64(o, true); o += 8; return Number(v); };
  // Option<T> in borsh: tag byte, then the value only when Some.
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
  const len = dv.getUint32(o, true); o += 4;
  const title = new TextDecoder().decode(data.slice(o, o + len)); o += len;
  const bump = u8();
  return { address, creator, invoiceId, amount, assetType, vaultRecipient, vaultBps, collaborator, collaboratorBps, payer, isPaid, createdAt, paidAt, title, bump };
}

export async function fetchInvoice(conn: Connection, creator: PublicKey, invoiceId: bigint): Promise<InvoiceAccount | null> {
  const address = invoicePda(creator, invoiceId);
  const info = await conn.getAccountInfo(address, "confirmed");
  if (!info || !info.owner.equals(PROGRAM_ID)) return null;
  return decodeInvoice(address, info.data);
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
    .map((a) => decodeInvoice(a.pubkey, a.account.data))
    .sort((a, b) => Number(b.invoiceId - a.invoiceId));
}


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
  const title = Buffer.from(new TextEncoder().encode(p.title));
  const lenBytes = new Uint8Array(4);
  new DataView(lenBytes.buffer).setUint32(0, title.length, true);
  const titleLen = Buffer.from(lenBytes);
  const data = Buffer.concat([
    disc("initialize_invoice"),
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
    data: disc("pay_invoice"),
  });
}

export function cancelInvoiceIx(inv: InvoiceAccount): TransactionInstruction {
  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: inv.address, isSigner: false, isWritable: true },
      { pubkey: inv.creator, isSigner: true, isWritable: true },
    ],
    data: disc("cancel_invoice"),
  });
}

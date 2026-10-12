import { afterEach, describe, expect, it } from "vitest";
import { PublicKey } from "@solana/web3.js";
import { initializeInvoiceIx, invoicePda } from "./program";

// The browser Buffer polyfill has no BigInt read/write methods. Simulate that environment.
const names = ["writeBigUInt64LE", "writeBigInt64LE", "readBigUInt64LE", "readBigInt64LE"] as const;
const saved = names.map((n) => [n, (Buffer.prototype as never)[n]] as const);
const strip = () => names.forEach((n) => delete (Buffer.prototype as never)[n]);
const restore = () => saved.forEach(([n, f]) => ((Buffer.prototype as never)[n] = f));

const creator = new PublicKey("7SxBDg7qqksad9dHbev2MbFWWWNkEwP4NiqnMgFaTU7N");
const vault = new PublicKey("FtRMty97BNBxvEMWAw2Xv9AaNCrD83CyKiNdcyhVKQpG");
const params = { creator, invoiceId: 1791824921379n, amount: 50_000_000n, title: "Landing page design", vault, vaultBps: 1000, collaborator: null, collaboratorBps: 0 };

describe("instruction encoding without Buffer BigInt methods", () => {
  afterEach(restore);

  it("produces identical bytes to the Node Buffer path", () => {
    const expected = initializeInvoiceIx(params).data.toString("hex");
    strip();
    expect(initializeInvoiceIx(params).data.toString("hex")).toBe(expected);
  });

  it("encodes u64 little-endian amount and id at the right offsets", () => {
    strip();
    const d = initializeInvoiceIx(params).data;
    expect(d.subarray(0, 8).toString("hex")).toBe("8596dd00e3778bc8"); // initialize_invoice discriminator
    expect(d.readUInt32LE(8)).toBe(Number(params.invoiceId & 0xffffffffn));
    expect(d.readUInt32LE(16)).toBe(50_000_000);
  });

  it("derives the invoice PDA", () => {
    const expected = invoicePda(creator, params.invoiceId).toBase58();
    strip();
    expect(invoicePda(creator, params.invoiceId).toBase58()).toBe(expected);
  });
});

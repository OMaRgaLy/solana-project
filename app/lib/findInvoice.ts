import { Connection, PublicKey } from "@solana/web3.js";
import { configuredNets, NETS, type NetName } from "./cluster";
import { fetchInvoice, type InvoiceAccount } from "./program";

/** A connection for a network's RPC. */
export const connectionFor = (net: NetName) => new Connection(NETS[net].rpc, "confirmed");

/**
 * Finds an invoice without being told which network it lives on: a link works for whoever opens it,
 * whatever mode their site is in. An invoice exists on exactly one network (the PDA depends on the program id),
 * so the default network is tried first and the other one only when that comes back empty.
 */
export async function findInvoice(creator: PublicKey, invoiceId: bigint): Promise<InvoiceAccount | null> {
  for (const net of configuredNets()) {
    try {
      const inv = await fetchInvoice(connectionFor(net.name), creator, invoiceId, net.name);
      if (inv) return inv;
    } catch {
      /* a failing RPC for one network must not hide the other */
    }
  }
  return null;
}

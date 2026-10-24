"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { fetchInvoice, type InvoiceAccount } from "./program";

export type InvoiceState = {
  invoice: InvoiceAccount | null;
  loading: boolean;
  error: string | null;
  paySig: string | null;
  reload: () => Promise<void>;
};

export function useInvoice(creator: string, id: string): InvoiceState {
  const { connection } = useConnection();
  const [invoice, setInvoice] = useState<InvoiceAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paySig, setPaySig] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const inv = await fetchInvoice(connection, new PublicKey(creator), BigInt(id));
      setInvoice(inv);
      if (inv?.isPaid) {
        // The payment is the newest transaction touching the invoice account.
        const sigs = await connection.getSignaturesForAddress(inv.address, { limit: 5 }, "confirmed");
        setPaySig(sigs.find((s) => !s.err)?.signature ?? null);
      } else {
        setPaySig(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load invoice");
    } finally {
      setLoading(false);
    }
  }, [connection, creator, id]);

  useEffect(() => { void reload(); }, [reload]);
  return { invoice, loading, error, paySig, reload };
}

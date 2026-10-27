"use client";

import { useCallback, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { connectionFor, findInvoice } from "./findInvoice";
import { type InvoiceAccount } from "./program";
import { useMode } from "./mode/ModeContext";

export type InvoiceState = {
  invoice: InvoiceAccount | null;
  loading: boolean;
  error: string | null;
  paySig: string | null;
  reload: () => Promise<void>;
};

/**
 * Loads an invoice from whichever network it lives on, and moves the site to that network (a demo link opened on
 * mainnet switches to demo mode), so the link works for anyone regardless of their mode.
 */
export function useInvoice(creator: string, id: string): InvoiceState {
  const { net, setNet } = useMode();
  const [invoice, setInvoice] = useState<InvoiceAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paySig, setPaySig] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const inv = await findInvoice(new PublicKey(creator), BigInt(id));
      setInvoice(inv);
      if (inv && inv.net !== net) setNet(inv.net);
      if (inv?.isPaid) {
        // The payment is the newest transaction touching the invoice account.
        const sigs = await connectionFor(inv.net).getSignaturesForAddress(inv.address, { limit: 5 }, "confirmed");
        setPaySig(sigs.find((s) => !s.err)?.signature ?? null);
      } else {
        setPaySig(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load invoice");
    } finally {
      setLoading(false);
    }
    // `net` is read only to decide whether to switch; changing it must not refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creator, id, setNet]);

  useEffect(() => { void reload(); }, [reload]);
  return { invoice, loading, error, paySig, reload };
}

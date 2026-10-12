"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { DEMO_WALLETS } from "@/lib/demoWallets";
import { DemoWalletAdapter } from "@/lib/DemoWalletAdapter";

const RPC = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Real wallets (Phantom, Solflare...) register themselves via the Wallet Standard.
  // Demo wallets are built in: they sign locally with published Devnet test keys.
  const wallets = useMemo(() => DEMO_WALLETS.filter((w) => ["freelancer", "client1", "client2"].includes(w.id)).map((w) => new DemoWalletAdapter(w)), []);
  return (
    <ConnectionProvider endpoint={RPC}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

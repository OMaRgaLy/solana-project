"use client";

import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { DEMO_WALLETS } from "@/lib/demoWallets";
import { DemoWalletAdapter } from "@/lib/DemoWalletAdapter";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import { ModeProvider, useMode } from "@/lib/mode/ModeContext";
import { ProfileProvider } from "@/lib/profile/ProfileContext";

/**
 * The RPC endpoint and the wallet list follow the active network. The published demo keys are only offered on
 * devnet, so on mainnet they cannot be selected: only real wallets (Wallet Standard, e.g. Phantom) appear.
 * `key={net}` remounts the providers on a switch, so no connection or wallet leaks across networks.
 */
function Chain({ children }: { children: React.ReactNode }) {
  const { net, config } = useMode();
  const wallets = useMemo(
    () => [
      ...(net === "devnet"
        ? DEMO_WALLETS.filter((w) => ["freelancer", "client1", "client2"].includes(w.id)).map((w) => new DemoWalletAdapter(w))
        : []),
      new PhantomWalletAdapter(),
    ],
    [net],
  );
  return (
    <ConnectionProvider key={net} endpoint={config.rpc}>
      <WalletProvider key={net} wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ModeProvider>
        <Chain>
          <AuthProvider>
            <ProfileProvider>{children}</ProfileProvider>
          </AuthProvider>
        </Chain>
      </ModeProvider>
    </I18nProvider>
  );
}

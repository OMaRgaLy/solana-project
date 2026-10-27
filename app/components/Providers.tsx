"use client";

import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { DEMO_WALLETS } from "@/lib/demoWallets";
import { DemoWalletAdapter } from "@/lib/DemoWalletAdapter";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import { ModeProvider } from "@/lib/mode/ModeContext";
import { ProfileProvider } from "@/lib/profile/ProfileContext";

const RPC = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Built-in Demo Wallets (available for seamless sandbox demo testing)
  const wallets = useMemo(
    () =>
      DEMO_WALLETS.filter((w) => ["freelancer", "client1", "client2"].includes(w.id)).map(
        (w) => new DemoWalletAdapter(w)
      ),
    []
  );

  return (
    <I18nProvider>
      <ModeProvider>
        <ConnectionProvider endpoint={RPC}>
          <WalletProvider wallets={wallets} autoConnect={true}>
            <WalletModalProvider>
              <AuthProvider>
                <ProfileProvider>{children}</ProfileProvider>
              </AuthProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ModeProvider>
    </I18nProvider>
  );
}

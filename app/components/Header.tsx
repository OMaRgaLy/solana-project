"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";

// The wallet button touches window; render it client-side only to avoid hydration mismatch.
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

export default function Header() {
  const { publicKey } = useWallet();
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07111f]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-2xl">🏹</span> SteppeInvoice
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-300">
          <Link href="/demo" className="text-teal-300 hover:text-white">Demo wallets</Link>
          <Link href="/create" className="hover:text-white">Create invoice</Link>
          {publicKey && <Link href={`/profile/${publicKey.toBase58()}`} className="hover:text-white">My profile</Link>}
          <span className="hidden rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-300 sm:inline">Devnet</span>
          <WalletMultiButton />
        </nav>
      </div>
    </header>
  );
}

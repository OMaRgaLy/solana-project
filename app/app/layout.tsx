import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import DemoBar from "@/components/DemoBar";
import LogPanel from "@/components/LogPanel";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SteppeInvoice — Solana Pay & Instant Auto-Split",
  description:
    "Solana invoices with instant on-chain auto-split, shareable Blinks, and an official Kazakhstan Act of Completed Works with Solscan QR seal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#070b14] text-slate-100">
        <Providers>
          <Header />
          <DemoBar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</main>
          <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 print:hidden">
            SteppeInvoice · Solana Non-Custodial Protocol · Built for Central Asian Freelancers
          </footer>
          <LogPanel />
        </Providers>
      </body>
    </html>
  );
}

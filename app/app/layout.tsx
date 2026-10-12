import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SteppeInvoice — get paid in one click, anywhere",
  description:
    "Solana invoices with instant on-chain auto-split, shareable Blinks, and an official Kazakhstan Act of Completed Works.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</main>
          <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 print:hidden">
            SteppeInvoice · built for the Superteam Kazakhstan track · Solana Devnet
          </footer>
        </Providers>
      </body>
    </html>
  );
}

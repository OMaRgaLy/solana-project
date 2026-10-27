import type { Metadata } from "next";
import { headers } from "next/headers";
import { PublicKey } from "@solana/web3.js";
import { findInvoice } from "@/lib/findInvoice";
import { lamportsToSol } from "@/lib/format";
import { extra } from "@/lib/i18n/extra";
import type { Language } from "@/lib/i18n/translations";

type Props = { params: Promise<{ creator: string; id: string }>; children: React.ReactNode };

/** Picks the preview language from Accept-Language; messenger crawlers send none, so they get Russian. */
function previewLang(acceptLanguage: string | null): Language {
  const first = (acceptLanguage ?? "").toLowerCase().split(",")[0]?.trim() ?? "";
  if (first.startsWith("kk")) return "kk";
  if (first.startsWith("en")) return "en";
  return "ru";
}

// Messengers (Telegram, WhatsApp, X, Slack) build link previews from these server-rendered tags.
// The page itself is a client component, so the tags live here.
export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { creator, id } = await params;
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;
  const lang = previewLang(h.get("accept-language"));
  const M = extra[lang].pay;

  let title = M.metaTitle;
  let description = M.metaDesc;
  try {
    const inv = await findInvoice(new PublicKey(creator), BigInt(id));
    if (inv) {
      title = `${inv.title} — ${lamportsToSol(inv.amount)} SOL`;
      description = inv.isPaid ? M.metaPaid : M.metaDesc;
    }
  } catch {
    /* generic preview */
  }
  const image = `${origin}/api/og/invoice?creator=${creator}&id=${id}&lang=${lang}`;
  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: { title, description, type: "website", siteName: "SteppeInvoice", images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function PayLayout({ children }: Pick<Props, "children">) {
  return children;
}

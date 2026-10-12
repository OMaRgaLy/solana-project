"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useInvoice } from "@/lib/useInvoice";
import { lamportsToSol, solscanTx } from "@/lib/format";

type Rate = { kzt: number; source: string; fallback: boolean };

const fmtKzt = (n: number) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(n);
const fmtDate = (ts: number) => new Date(ts * 1000).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });

export default function ActPage({ params }: { params: Promise<{ creator: string; id: string }> }) {
  const { creator, id } = use(params);
  const { invoice, loading, error, paySig } = useInvoice(creator, id);
  const [rate, setRate] = useState<Rate | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [contractor, setContractor] = useState("");
  const [iin, setIin] = useState("");
  const [customer, setCustomer] = useState("");

  useEffect(() => {
    fetch("/api/rate").then((r) => r.json()).then(setRate).catch(() => setRate({ kzt: 75000, source: "approximate", fallback: true }));
    const q = new URLSearchParams(window.location.search).get("client");
    if (q) setCustomer(q);
  }, []);

  useEffect(() => {
    if (!paySig) return;
    QRCode.toDataURL(solscanTx(paySig), { margin: 1, width: 220 }).then(setQr).catch(() => setQr(null));
  }, [paySig]);

  if (loading && !invoice) return <p className="text-slate-400">Loading…</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!invoice) return <p className="text-slate-400">Invoice not found.</p>;
  if (!invoice.isPaid)
    return (
      <div className="card mx-auto max-w-lg text-center">
        <p>The Act becomes available once the invoice is paid.</p>
        <Link className="btn mt-4" href={`/pay/${creator}/${id}`}>Go to checkout</Link>
      </div>
    );

  const solAmount = Number(invoice.amount) / 1e9;
  const kzt = rate ? solAmount * rate.kzt : null;
  const date = fmtDate(invoice.paidAt ?? invoice.createdAt);
  const num = `${id.slice(-6)}`;

  return (
    <div className="space-y-4">
      <div className="no-print card flex flex-wrap items-end gap-4">
        <div className="min-w-48 flex-1"><label className="label">Исполнитель (ФИО / ИП)</label><input className="input" value={contractor} onChange={(e) => setContractor(e.target.value)} placeholder="ИП Иванов А.А." /></div>
        <div className="min-w-40"><label className="label">ИИН / БИН</label><input className="input" value={iin} onChange={(e) => setIin(e.target.value)} placeholder="123456789012" inputMode="numeric" /></div>
        <div className="min-w-48 flex-1"><label className="label">Заказчик</label><input className="input" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Acme Inc." /></div>
        <button className="btn" onClick={() => window.print()}>📄 Скачать Акт выполненных работ (РК) / Печать</button>
      </div>

      <article className="mx-auto max-w-3xl rounded-lg bg-white p-10 font-serif text-[15px] leading-relaxed text-black shadow-xl print:shadow-none">
        <h1 className="text-center text-xl font-bold uppercase">Акт выполненных работ (оказанных услуг) № {num}</h1>
        <p className="mt-1 text-center">г. Астана (дистанционно) · {date}</p>

        <p className="mt-6">
          <b>Исполнитель:</b> {contractor || "________________________"}, ИИН/БИН: {iin || "____________"}, кошелёк Solana:{" "}
          <span className="break-all font-mono text-xs">{invoice.creator.toBase58()}</span>
        </p>
        <p className="mt-2"><b>Заказчик:</b> {customer || "________________________"}
          {invoice.payer && <>, кошелёк плательщика: <span className="break-all font-mono text-xs">{invoice.payer.toBase58()}</span></>}
        </p>
        <p className="mt-4">Исполнитель выполнил, а Заказчик принял следующие работы (услуги):</p>

        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              {["№", "Наименование работ (услуг)", "Ед.", "Кол-во", "Сумма, SOL", "Эквивалент, KZT"].map((h) => (
                <th key={h} className="border border-black px-2 py-1 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-2 py-1">1</td>
              <td className="border border-black px-2 py-1">{invoice.title}</td>
              <td className="border border-black px-2 py-1">усл.</td>
              <td className="border border-black px-2 py-1">1</td>
              <td className="border border-black px-2 py-1">{lamportsToSol(invoice.amount)}</td>
              <td className="border border-black px-2 py-1">{kzt !== null ? fmtKzt(kzt) : "…"}</td>
            </tr>
            <tr className="font-bold">
              <td colSpan={4} className="border border-black px-2 py-1 text-right">Итого:</td>
              <td className="border border-black px-2 py-1">{lamportsToSol(invoice.amount)}</td>
              <td className="border border-black px-2 py-1">{kzt !== null ? fmtKzt(kzt) : "…"}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-1 text-xs text-gray-600">
          Эквивалент в тенге справочный, рассчитан по курсу 1 SOL ≈ {rate ? fmtKzt(rate.kzt) : "…"} KZT ({rate?.fallback ? "ориентировочный курс" : rate?.source}) на момент формирования документа. НДС не облагается, если Исполнитель не является плательщиком НДС.
        </p>

        <p className="mt-4">
          Оплата произведена в полном объёме в криптовалюте SOL (сеть Solana Devnet) {date} через смарт-контракт SteppeInvoice.
          Работы выполнены в полном объёме, в установленные сроки. Заказчик претензий по объёму, качеству и срокам не имеет.
        </p>

        <div className="mt-6 flex items-center gap-5 rounded border-2 border-double border-blue-800 p-3 text-blue-900">
          {qr ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={qr} alt="QR Solscan" className="h-28 w-28" /> : <div className="h-28 w-28 bg-gray-200" />}
          <div className="text-xs">
            <div className="text-sm font-bold uppercase">Ончейн-печать SteppeInvoice ✓</div>
            <div>Подтверждение взаиморасчёта в блокчейне Solana</div>
            <div className="mt-1 break-all font-mono">TX: {paySig ?? "—"}</div>
            <div>Сплит: Исполнитель {lamportsToSol(invoice.amount)} SOL распределён атомарно смарт-контрактом</div>
            <div>QR ведёт на Solscan для проверки налоговым органом / бухгалтером</div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-10 text-sm">
          <div><b>Исполнитель</b><div className="mt-8 border-t border-black pt-1">подпись / М.П.</div></div>
          <div><b>Заказчик</b><div className="mt-8 border-t border-black pt-1">подпись / М.П.</div></div>
        </div>
      </article>
    </div>
  );
}

"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useInvoice } from "@/lib/useInvoice";
import { lamportsToSol, solscanTx } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Language } from "@/lib/i18n/translations";
import { useProfile } from "@/lib/profile/ProfileContext";

type Rate = { kzt: number; usd: number; source: string; fallback: boolean };

const fmtKzt = (n: number) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(n);
const fmtDateRu = (ts: number) => new Date(ts * 1000).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
const fmtDateKk = (ts: number) => new Date(ts * 1000).toLocaleDateString("kk-KZ", { day: "2-digit", month: "long", year: "numeric" });
const fmtDateEn = (ts: number) => new Date(ts * 1000).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });

export default function ActPage({ params }: { params: Promise<{ creator: string; id: string }> }) {
  const { creator, id } = use(params);
  const { lang: globalLang } = useI18n();
  const { profile } = useProfile();
  const { invoice, loading, error, paySig } = useInvoice(creator, id);

  // The Act language defaults to the user's active site language!
  const [docLang, setDocLang] = useState<Language>(globalLang);
  const [rate, setRate] = useState<Rate | null>(null);
  const [qr, setQr] = useState<string | null>(null);

  // Requisites (prefilled from profile)
  const [contractor, setContractor] = useState(profile.companyOrName || "ИП Смагулов А.Б.");
  const [iin, setIin] = useState(profile.iinBin || "940512301824");
  const [customer, setCustomer] = useState("Acme Inc. (USA)");

  useEffect(() => {
    setDocLang(globalLang);
  }, [globalLang]);

  useEffect(() => {
    if (profile.companyOrName) setContractor(profile.companyOrName);
    if (profile.iinBin) setIin(profile.iinBin);
  }, [profile]);

  useEffect(() => {
    fetch("/api/rate")
      .then((r) => r.json())
      .then(setRate)
      .catch(() => setRate({ kzt: 75000, usd: 150, source: "approximate", fallback: true }));

    const q = new URLSearchParams(window.location.search).get("client");
    if (q) setCustomer(q);
  }, []);

  useEffect(() => {
    if (!paySig) return;
    QRCode.toDataURL(solscanTx(paySig), { margin: 1, width: 220 })
      .then(setQr)
      .catch(() => setQr(null));
  }, [paySig]);

  if (loading && !invoice) return <p className="text-slate-400">Загрузка данных инвойса...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!invoice) return <p className="text-slate-400">Инвойс не найден.</p>;

  if (!invoice.isPaid) {
    return (
      <div className="card mx-auto max-w-lg text-center py-10 space-y-4">
        <div className="text-3xl">⏳</div>
        <h1 className="text-lg font-bold text-white">Инвойс еще не оплачен</h1>
        <p className="text-slate-400 text-xs">
          Официальный Акт выполненных работ с QR-печатью формируется автоматически после зачисления оплаты на блокчейне.
        </p>
        <Link className="btn text-xs py-2 px-4" href={`/pay/${creator}/${id}`}>
          Перейти на страницу оплаты →
        </Link>
      </div>
    );
  }

  const solAmount = Number(invoice.amount) / 1e9;
  const kzt = rate ? solAmount * rate.kzt : null;
  const num = `${id.slice(-6)}`;
  const timestamp = invoice.paidAt ?? invoice.createdAt;

  return (
    <div className="space-y-6">
      {/* Top Controls (Hidden during print) */}
      <div className="no-print card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Язык документа:</span>
            <div className="flex rounded-lg bg-black/40 p-1 border border-white/10 text-xs font-semibold">
              <button
                onClick={() => setDocLang("kk")}
                className={`px-3 py-1 rounded-md transition-all ${
                  docLang === "kk" ? "bg-teal-400 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                🇰🇿 Қазақша
              </button>
              <button
                onClick={() => setDocLang("ru")}
                className={`px-3 py-1 rounded-md transition-all ${
                  docLang === "ru" ? "bg-teal-400 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                🇷🇺 Русский
              </button>
              <button
                onClick={() => setDocLang("en")}
                className={`px-3 py-1 rounded-md transition-all ${
                  docLang === "en" ? "bg-teal-400 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="btn py-2 px-5 text-xs font-bold shadow-lg"
          >
            📄 Скачать Акт / Печать в PDF
          </button>
        </div>

        {/* Quick Edit Requisites */}
        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div>
            <label className="label">Исполнитель (Компания / ИП / ФИО)</label>
            <input
              className="input text-xs"
              value={contractor}
              onChange={(e) => setContractor(e.target.value)}
            />
          </div>
          <div>
            <label className="label">ИИН / БИН исполнителя</label>
            <input
              className="input font-mono text-xs"
              value={iin}
              onChange={(e) => setIin(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Заказчик (Клиент)</label>
            <input
              className="input text-xs"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Printable Document Article */}
      <article className="mx-auto max-w-3xl rounded-xl bg-white p-10 font-serif text-[14px] leading-relaxed text-black shadow-2xl print:shadow-none print:p-0 print:m-0">
        {docLang === "kk" ? (
          /* КАЗАХСКАЯ ВЕРСИЯ */
          <div className="space-y-6">
            <div className="text-right text-[11px] text-neutral-600">
              Қазақстан Республикасы Қаржы министрінің<br />
              2014 жылғы 20 желтоқсандағы № 562 бұйрығына сәйкес нысан
            </div>

            <h1 className="text-center text-lg font-bold uppercase tracking-wide">
              ОРЫНДАЛҒАН ЖҰМЫСТАР (КӨРСЕТІЛГЕН ҚЫЗМЕТТЕР) АКТІСІ № {num}
            </h1>
            <div className="text-center text-xs text-neutral-600">
              Күні: {fmtDateKk(timestamp)} ж.
            </div>

            <div className="space-y-2 border-y border-neutral-300 py-3 text-xs">
              <div className="flex">
                <span className="w-36 font-bold text-neutral-800">Орындаушы:</span>
                <span>{contractor} (ЖСН/БСН: {iin})</span>
              </div>
              <div className="flex">
                <span className="w-36 font-bold text-neutral-800">Тапсырыс беруші:</span>
                <span>{customer}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-bold text-neutral-800">Есеп айырысу желісі:</span>
                <span className="font-mono">Solana Blockchain (Смарт-келісімшарт SteppeInvoice)</span>
              </div>
            </div>

            <table className="w-full border-collapse border border-neutral-400 text-xs">
              <thead>
                <tr className="bg-neutral-100 text-neutral-800">
                  <th className="border border-neutral-400 p-2 text-center w-12">№</th>
                  <th className="border border-neutral-400 p-2 text-left">Орындалған жұмыстардың (қызметтердің) атауы</th>
                  <th className="border border-neutral-400 p-2 text-right w-28">Сомасы (SOL)</th>
                  <th className="border border-neutral-400 p-2 text-right w-32">Баламасы (KZT)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-400 p-2 text-center">1</td>
                  <td className="border border-neutral-400 p-2 font-medium">{invoice.title}</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono font-bold">{lamportsToSol(invoice.amount)} SOL</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono">{kzt ? `${fmtKzt(kzt)} ₸` : "—"}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="font-bold bg-neutral-50">
                  <td colSpan={2} className="border border-neutral-400 p-2 text-right">Жиыны (ҚҚС-сыз):</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono">{lamportsToSol(invoice.amount)} SOL</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono">{kzt ? `${fmtKzt(kzt)} ₸` : "—"}</td>
                </tr>
              </tfoot>
            </table>

            <p className="text-xs text-neutral-700">
              Жоғарыда аталған жұмыстар (қызметтер) толық көлемде және уақытында орындалды. Тапсырыс берушінің жұмыстардың (қызметтердің) көлемі, сапасы мен мерзімдері бойынша шағымдары жоқ.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4 text-xs">
              <div>
                <div className="font-bold border-b border-black pb-1 mb-2">Орындаушы:</div>
                <p>{contractor}</p>
                <p className="font-mono text-[11px] text-neutral-600 mt-1">ЖСН/БСН: {iin}</p>
                <div className="mt-8 text-[11px] text-neutral-500">Қолы: ________________ / М.О.</div>
              </div>

              <div>
                <div className="font-bold border-b border-black pb-1 mb-2">Тапсырыс беруші:</div>
                <p>{customer}</p>
                <div className="mt-8 text-[11px] text-neutral-500">Қолы: ________________ / М.О.</div>
              </div>
            </div>

            {/* QR Seal */}
            <div className="mt-6 flex items-center gap-4 rounded border border-neutral-300 bg-neutral-50 p-4 text-xs">
              {qr ? <img src={qr} alt="Solscan QR" className="h-24 w-24 border border-neutral-300" /> : <div className="h-24 w-24 bg-neutral-200" />}
              <div className="space-y-1">
                <div className="font-bold text-neutral-800">✓ БЛОКЧЕЙНДЕГІ САНДЫҚ МӨР (SOLSCAN ЭКСПЛОРЕРІ)</div>
                <p className="text-[11px] text-neutral-600">
                  Мәміле Solana блокчейнінде орындалды. QR-кодты сканерлеу арқылы Solscan-да транзакцияны тексеруге болады:
                </p>
                {paySig && (
                  <p className="font-mono text-[10px] text-neutral-500 break-all">{paySig}</p>
                )}
              </div>
            </div>
          </div>
        ) : docLang === "en" ? (
          /* АНГЛИЙСКАЯ ВЕРСИЯ */
          <div className="space-y-6">
            <div className="text-right text-[11px] text-neutral-600">
              Official Acceptance Certificate<br />
              Crypto Asset Settlement Standard
            </div>

            <h1 className="text-center text-lg font-bold uppercase tracking-wide">
              CERTIFICATE OF COMPLETION / ACCEPTANCE ACT No. {num}
            </h1>
            <div className="text-center text-xs text-neutral-600">
              Date: {fmtDateEn(timestamp)}
            </div>

            <div className="space-y-2 border-y border-neutral-300 py-3 text-xs">
              <div className="flex">
                <span className="w-36 font-bold text-neutral-800">Contractor:</span>
                <span>{contractor} (Tax ID / BIN: {iin})</span>
              </div>
              <div className="flex">
                <span className="w-36 font-bold text-neutral-800">Customer:</span>
                <span>{customer}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-bold text-neutral-800">Settlement Network:</span>
                <span className="font-mono">Solana Blockchain (SteppeInvoice Protocol)</span>
              </div>
            </div>

            <table className="w-full border-collapse border border-neutral-400 text-xs">
              <thead>
                <tr className="bg-neutral-100 text-neutral-800">
                  <th className="border border-neutral-400 p-2 text-center w-12">#</th>
                  <th className="border border-neutral-400 p-2 text-left">Description of Services Delivered</th>
                  <th className="border border-neutral-400 p-2 text-right w-28">Amount (SOL)</th>
                  <th className="border border-neutral-400 p-2 text-right w-32">Equivalent (KZT)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-400 p-2 text-center">1</td>
                  <td className="border border-neutral-400 p-2 font-medium">{invoice.title}</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono font-bold">{lamportsToSol(invoice.amount)} SOL</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono">{kzt ? `${fmtKzt(kzt)} ₸` : "—"}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="font-bold bg-neutral-50">
                  <td colSpan={2} className="border border-neutral-400 p-2 text-right">TOTAL:</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono">{lamportsToSol(invoice.amount)} SOL</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono">{kzt ? `${fmtKzt(kzt)} ₸` : "—"}</td>
                </tr>
              </tfoot>
            </table>

            <p className="text-xs text-neutral-700">
              The services described above have been fully delivered and accepted. The Customer has no claims regarding the quality, scope, or delivery timeline.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4 text-xs">
              <div>
                <div className="font-bold border-b border-black pb-1 mb-2">Delivered by (Contractor):</div>
                <p>{contractor}</p>
                <p className="font-mono text-[11px] text-neutral-600 mt-1">Tax ID: {iin}</p>
                <div className="mt-8 text-[11px] text-neutral-500">Signature: ________________ / Seal</div>
              </div>

              <div>
                <div className="font-bold border-b border-black pb-1 mb-2">Accepted by (Customer):</div>
                <p>{customer}</p>
                <div className="mt-8 text-[11px] text-neutral-500">Signature: ________________ / Seal</div>
              </div>
            </div>

            {/* QR Seal */}
            <div className="mt-6 flex items-center gap-4 rounded border border-neutral-300 bg-neutral-50 p-4 text-xs">
              {qr ? <img src={qr} alt="Solscan QR" className="h-24 w-24 border border-neutral-300" /> : <div className="h-24 w-24 bg-neutral-200" />}
              <div className="space-y-1">
                <div className="font-bold text-neutral-800">✓ ON-CHAIN CRYPTOGRAPHIC SEAL (SOLSCAN EXPLORER)</div>
                <p className="text-[11px] text-neutral-600">
                  Cryptographic transaction settled on Solana blockchain. Scan the QR code to verify settlement authenticity:
                </p>
                {paySig && (
                  <p className="font-mono text-[10px] text-neutral-500 break-all">{paySig}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* РУССКАЯ ВЕРСИЯ (ПО ФОРМЕ Р-1 МФ РК) */
          <div className="space-y-6">
            <div className="text-right text-[11px] text-neutral-600">
              Приложение 50 к приказу Министра финансов РК<br />
              от 20 декабря 2012 года № 562 (Форма Р-1)
            </div>

            <h1 className="text-center text-lg font-bold uppercase tracking-wide">
              АКТ ВЫПОЛНЕННЫХ РАБОТ (ОКАЗАННЫХ УСЛУГ) № {num}
            </h1>
            <div className="text-center text-xs text-neutral-600">
              Дата: {fmtDateRu(timestamp)} г.
            </div>

            <div className="space-y-2 border-y border-neutral-300 py-3 text-xs">
              <div className="flex">
                <span className="w-36 font-bold text-neutral-800">Исполнитель:</span>
                <span>{contractor} (ИИН/БИН: {iin})</span>
              </div>
              <div className="flex">
                <span className="w-36 font-bold text-neutral-800">Заказчик:</span>
                <span>{customer}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-bold text-neutral-800">Сеть расчета:</span>
                <span className="font-mono">Solana Blockchain (Смарт-контракт SteppeInvoice)</span>
              </div>
            </div>

            <table className="w-full border-collapse border border-neutral-400 text-xs">
              <thead>
                <tr className="bg-neutral-100 text-neutral-800">
                  <th className="border border-neutral-400 p-2 text-center w-12">№</th>
                  <th className="border border-neutral-400 p-2 text-left">Наименование выполненных работ (оказанных услуг)</th>
                  <th className="border border-neutral-400 p-2 text-right w-28">Сумма (SOL)</th>
                  <th className="border border-neutral-400 p-2 text-right w-32">Эквивалент (KZT)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-400 p-2 text-center">1</td>
                  <td className="border border-neutral-400 p-2 font-medium">{invoice.title}</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono font-bold">{lamportsToSol(invoice.amount)} SOL</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono">{kzt ? `${fmtKzt(kzt)} ₸` : "—"}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="font-bold bg-neutral-50">
                  <td colSpan={2} className="border border-neutral-400 p-2 text-right">ИТОГО (без НДС):</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono">{lamportsToSol(invoice.amount)} SOL</td>
                  <td className="border border-neutral-400 p-2 text-right font-mono">{kzt ? `${fmtKzt(kzt)} ₸` : "—"}</td>
                </tr>
              </tfoot>
            </table>

            <p className="text-xs text-neutral-700">
              Сведения об использовании запасов: не использовались. Вышеперечисленные работы (услуги) выполнены полностью и в срок. Заказчик претензий по объему, качеству и срокам не имеет.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4 text-xs">
              <div>
                <div className="font-bold border-b border-black pb-1 mb-2">Сдал (Исполнитель):</div>
                <p>{contractor}</p>
                <p className="font-mono text-[11px] text-neutral-600 mt-1">ИИН/БИН: {iin}</p>
                <div className="mt-8 text-[11px] text-neutral-500">Подпись: ________________ / М.П.</div>
              </div>

              <div>
                <div className="font-bold border-b border-black pb-1 mb-2">Принял (Заказчик):</div>
                <p>{customer}</p>
                <div className="mt-8 text-[11px] text-neutral-500">Подпись: ________________ / М.П.</div>
              </div>
            </div>

            {/* QR Seal */}
            <div className="mt-6 flex items-center gap-4 rounded border border-neutral-300 bg-neutral-50 p-4 text-xs">
              {qr ? <img src={qr} alt="Solscan QR" className="h-24 w-24 border border-neutral-300" /> : <div className="h-24 w-24 bg-neutral-200" />}
              <div className="space-y-1">
                <div className="font-bold text-neutral-800">✓ ЦИФРОВАЯ ОНЧЕЙН-ПЕЧАТЬ (ЭКСПЛОРЕР SOLSCAN)</div>
                <p className="text-[11px] text-neutral-600">
                  Расчет зафиксирован в смарт-контракте Solana. Отсканируйте QR-код для проверки криптографического подтверждения:
                </p>
                {paySig && (
                  <p className="font-mono text-[10px] text-neutral-500 break-all">{paySig}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

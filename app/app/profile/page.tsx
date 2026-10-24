"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useProfile, UserProfile } from "@/lib/profile/ProfileContext";
import { fetchInvoicesByCreator, cancelInvoiceIx, type InvoiceAccount } from "@/lib/program";
import { lamportsToSol, short, solscanAddr } from "@/lib/format";
import { computeSplit } from "@/lib/split";
import { log } from "@/lib/log";

export default function ProfilePage() {
  const { t } = useI18n();
  const { profile, saveProfile } = useProfile();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [form, setForm] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceAccount[] | null>(null);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const loadInvoices = useCallback(async (walletKey: PublicKey) => {
    setLoadingInvoices(true);
    try {
      const list = await fetchInvoicesByCreator(connection, walletKey);
      setInvoices(list);
    } catch {
      setInvoices([]);
    } finally {
      setLoadingInvoices(false);
    }
  }, [connection]);

  useEffect(() => {
    if (publicKey) {
      void loadInvoices(publicKey);
    } else {
      setInvoices(null);
    }
  }, [publicKey, loadInvoices]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const cancelInvoice = async (inv: InvoiceAccount) => {
    if (!publicKey) return;
    setCancellingId(inv.invoiceId.toString());
    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const tx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add(cancelInvoiceIx(inv));
      const sig = await sendTransaction(tx, connection);
      log("info", `Cancelling invoice #${inv.invoiceId}, tx: ${sig}`);
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
      log("ok", `Invoice #${inv.invoiceId} cancelled successfully.`);
      await loadInvoices(publicKey);
    } catch (e) {
      log("error", `Failed to cancel invoice: ${e}`);
    } finally {
      setCancellingId(null);
    }
  };

  const paidInvoices = (invoices ?? []).filter((i) => i.isPaid);
  const totalGross = paidInvoices.reduce((s, i) => s + i.amount, 0n);
  const totalNet = paidInvoices.reduce((s, i) => s + computeSplit(i.amount, i.vaultBps, i.collaboratorBps).creator, 0n);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">{t.profile.title}</h1>
        <p className="mt-1 text-sm text-slate-400">{t.profile.subtitle}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left column: Profile Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="card space-y-4">
            <h2 className="text-lg font-bold text-teal-300">🏢 Данные исполнителя для Акта выполненных работ</h2>

            <div>
              <label className="label">{t.profile.companyOrName}</label>
              <input
                className="input"
                placeholder={t.profile.companyPlaceholder}
                value={form.companyOrName}
                onChange={(e) => setForm({ ...form, companyOrName: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{t.profile.iinBinLabel}</label>
                <input
                  className="input font-mono"
                  placeholder="123456789012"
                  maxLength={12}
                  value={form.iinBin}
                  onChange={(e) => setForm({ ...form, iinBin: e.target.value.replace(/\D/g, "") })}
                  required
                />
              </div>
              <div>
                <label className="label">{t.profile.emailLabel}</label>
                <input
                  className="input"
                  type="email"
                  placeholder="name@studio.kz"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{t.profile.phoneLabel}</label>
                <input
                  className="input"
                  placeholder="+7 777 000 0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="label">{t.profile.tgLabel}</label>
                <input
                  className="input"
                  placeholder="@your_username"
                  value={form.telegram}
                  onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                />
              </div>
            </div>

            {/* Default Collaborator Defaults */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="text-sm font-semibold text-sky-300">
                🤝 Данные постоянного напарника (по умолчанию)
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Роль / Имя напарника</label>
                  <input
                    className="input text-xs"
                    placeholder="Например: UI/UX Дизайнер"
                    value={form.defaultCollabName}
                    onChange={(e) => setForm({ ...form, defaultCollabName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Доля по умолчанию (%)</label>
                  <input
                    className="input text-xs"
                    type="number"
                    min={0}
                    max={50}
                    value={form.defaultCollabPct}
                    onChange={(e) => setForm({ ...form, defaultCollabPct: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Solana-кошелек напарника</label>
                <input
                  className="input font-mono text-xs"
                  placeholder="Solana адрес"
                  value={form.defaultCollabWallet}
                  onChange={(e) => setForm({ ...form, defaultCollabWallet: e.target.value })}
                />
              </div>
            </div>

            {savedSuccess && (
              <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-3 text-xs text-teal-300">
                {t.profile.savedAlert}
              </div>
            )}

            <button type="submit" className="btn w-full">
              {t.profile.saveProfileBtn}
            </button>
          </form>
        </div>

        {/* Right column: Stats & Invoices History */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card space-y-4">
            <h2 className="text-lg font-bold text-white">📊 {t.profile.myInvoicesTitle}</h2>

            {!publicKey ? (
              <p className="text-xs text-slate-400">
                Подключите ваш Solana-кошелек, чтобы просмотреть историю выставленных инвойсов и статистику выплат.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                    <div className="text-xs text-slate-400">{t.profile.grossTotal}</div>
                    <div className="text-xl font-bold font-mono text-white mt-1">
                      {lamportsToSol(totalGross)} <span className="text-xs text-teal-400">SOL</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                    <div className="text-xs text-slate-400">{t.profile.netTotal}</div>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      {lamportsToSol(totalNet)} <span className="text-xs text-teal-400">SOL</span>
                    </div>
                  </div>
                </div>

                {loadingInvoices ? (
                  <p className="text-xs text-slate-400">{t.common.loading}</p>
                ) : !invoices || invoices.length === 0 ? (
                  <p className="text-xs text-slate-400">{t.profile.noInvoices}</p>
                ) : (
                  <div className="divide-y divide-white/5 max-h-96 overflow-y-auto pr-1 space-y-2">
                    {invoices.map((inv) => (
                      <div key={inv.invoiceId.toString()} className="pt-2 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-white truncate max-w-44">{inv.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.isPaid ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                          }`}>
                            {inv.isPaid ? "ОПЛАЧЕНО" : "ОЖИДАЕТ"}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400 font-mono">
                          <span>{lamportsToSol(inv.amount)} SOL</span>
                          <div className="flex gap-2">
                            <Link href={`/pay/${inv.creator.toBase58()}/${inv.invoiceId}`} className="text-teal-300 hover:underline">
                              Счет →
                            </Link>
                            {inv.isPaid ? (
                              <Link href={`/invoice/${inv.creator.toBase58()}/${inv.invoiceId}/act`} className="text-sky-300 hover:underline">
                                Акт 📄
                              </Link>
                            ) : (
                              <button
                                onClick={() => cancelInvoice(inv)}
                                disabled={cancellingId === inv.invoiceId.toString()}
                                className="text-red-400 hover:underline"
                              >
                                {cancellingId === inv.invoiceId.toString() ? "..." : "Отмена"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

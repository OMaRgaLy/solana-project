"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useProfile, UserProfile } from "@/lib/profile/ProfileContext";
import {
  SavedCollaborator,
  getSavedCollaborators,
  saveCollaborator,
  deleteCollaborator,
} from "@/lib/profile/collaborators";
import { fetchInvoicesByCreator, cancelInvoiceIx, type InvoiceAccount } from "@/lib/program";
import { lamportsToSol, short, solscanAddr, solscanTx } from "@/lib/format";
import { computeSplit } from "@/lib/split";
import { log } from "@/lib/log";
import { useMode } from "@/lib/mode/ModeContext";
import { demoById } from "@/lib/demoWallets";
import type { WalletName } from "@solana/wallet-adapter-base";

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function ProfilePage() {
  const { t } = useI18n();
  const { profile, saveProfile } = useProfile();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, select, connect, disconnect } = useWallet();
  const { isDemo, setMode } = useMode();

  const [activeTab, setActiveTab] = useState<"analytics" | "requisites" | "collabs">("analytics");
  const [form, setForm] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceAccount[] | null>(null);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Collaborator management
  const [collabs, setCollabs] = useState<SavedCollaborator[]>([]);
  const [newCollabName, setNewCollabName] = useState("");
  const [newCollabWallet, setNewCollabWallet] = useState("");
  const [newCollabPct, setNewCollabPct] = useState(15);
  const [newCollabNote, setNewCollabNote] = useState("");
  const [collabError, setCollabError] = useState<string | null>(null);
  const [collabSuccess, setCollabSuccess] = useState(false);

  // Exchange rate for fiat analytics
  const [rate, setRate] = useState<{ kzt: number; usd: number } | null>(null);

  useEffect(() => {
    fetch("/api/rate")
      .then((r) => r.json())
      .then(setRate)
      .catch(() => setRate({ kzt: 75000, usd: 150 }));
  }, []);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  // Load collaborators when wallet is connected
  useEffect(() => {
    if (publicKey) {
      const list = getSavedCollaborators(publicKey.toBase58());
      setCollabs(list);
    } else {
      setCollabs([]);
    }
  }, [publicKey]);

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    setCollabError(null);
    if (!publicKey) return;

    const trimmedWallet = newCollabWallet.trim();
    try {
      new PublicKey(trimmedWallet);
    } catch {
      setCollabError("Некорректный адрес Solana-кошелька (Base58)");
      return;
    }

    if (!newCollabName.trim()) {
      setCollabError("Укажите имя или роль напарника");
      return;
    }

    const updated = saveCollaborator(publicKey.toBase58(), {
      name: newCollabName.trim(),
      wallet: trimmedWallet,
      defaultPct: Number(newCollabPct) || 15,
      note: newCollabNote.trim() || undefined,
    });

    setCollabs(updated);
    setNewCollabName("");
    setNewCollabWallet("");
    setNewCollabNote("");
    setCollabSuccess(true);
    setTimeout(() => setCollabSuccess(false), 3000);
  };

  const handleDeleteCollab = (id: string) => {
    if (!publicKey) return;
    const updated = deleteCollaborator(publicKey.toBase58(), id);
    setCollabs(updated);
  };

  const handleQuickAddDemoDesigner = () => {
    if (!publicKey) return;
    const demoCollab = demoById("collaborator");
    const updated = saveCollaborator(publicKey.toBase58(), {
      name: "Алина (UI/UX Дизайнер)",
      wallet: demoCollab.publicKey,
      defaultPct: 15,
      note: "Проектирование дизайн-систем, Figma, прототипы",
    });
    setCollabs(updated);
  };

  const cancelInvoice = async (inv: InvoiceAccount) => {
    if (!publicKey) return;
    setCancellingId(inv.invoiceId.toString());
    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const tx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add(
        cancelInvoiceIx(inv)
      );
      const sig = await sendTransaction(tx, connection);
      log("info", `Cancelling invoice #${inv.invoiceId}, tx: ${sig}`);
      await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        "confirmed"
      );
      log("ok", `Invoice #${inv.invoiceId} cancelled successfully.`);
      await loadInvoices(publicKey);
    } catch (e) {
      log("error", `Failed to cancel invoice: ${e}`);
    } finally {
      setCancellingId(null);
    }
  };

  // Quick 1-click connect as Demo Freelancer
  const connectDemoFreelancer = async () => {
    setMode("demo");
    try {
      if (publicKey) await disconnect();
      select("Demo Freelancer" as WalletName);
      setTimeout(() => {
        connect().catch(() => {});
      }, 50);
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------------------------------------------
  // AUTH WALL: If not connected, block private profile access
  // -------------------------------------------------------------
  if (!publicKey) {
    return (
      <div className="mx-auto max-w-xl py-12 space-y-6">
        <div className="card text-center p-8 space-y-5 border border-teal-500/30 bg-gradient-to-b from-[#0f172a] to-[#070b14] shadow-2xl">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/30 text-3xl">
            🔐
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">{t.profile.authWallTitle}</h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              {t.profile.authWallDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <WalletMultiButton />
            <button
              id="btn-auth-demo-freelancer"
              type="button"
              onClick={connectDemoFreelancer}
              className="btn bg-amber-400 text-slate-950 font-bold text-xs py-2.5 px-4 shadow-md hover:bg-amber-300"
            >
              {t.profile.authWallDemoCta}
            </button>
          </div>

          <div className="border-t border-white/10 pt-5 text-left text-xs space-y-2 text-slate-400">
            <div className="font-semibold text-white">В личном кабинете доступно:</div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400">✓</span> Финансовая аналитика оборота и налога 3% СНР (ф. 910 РК)
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400">✓</span> Реквизиты ИП / ТОО для автоматической генерации Актов
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400">✓</span> База напарников с авто-подстановкой адресов и долей сплита
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const paidInvoices = (invoices ?? []).filter((i) => i.isPaid);
  const totalGross = paidInvoices.reduce((s, i) => s + i.amount, 0n);
  const totalNet = paidInvoices.reduce(
    (s, i) => s + computeSplit(i.amount, i.vaultBps, i.collaboratorBps).creator,
    0n
  );
  const totalCollab = paidInvoices.reduce(
    (s, i) => s + computeSplit(i.amount, i.vaultBps, i.collaboratorBps).collaborator,
    0n
  );

  const grossSol = Number(totalGross) / 1e9;
  const netSol = Number(totalNet) / 1e9;
  const collabSol = Number(totalCollab) / 1e9;

  const grossKzt = rate ? Math.round(grossSol * rate.kzt) : 0;
  const taxKzt = rate ? Math.round(grossKzt * 0.03) : 0; // 3% simplified tax KZ

  return (
    <div className="space-y-6">
      {/* Header bar with connected wallet badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">{t.profile.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{t.profile.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs text-teal-300">
            <span className="flex h-2 w-2 rounded-full bg-teal-400"></span>
            <span className="font-mono font-semibold">{short(publicKey.toBase58())}</span>
            <a
              href={solscanAddr(publicKey.toBase58())}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white"
              title="Solscan"
            >
              ↗
            </a>
          </div>
          <Link href="/create" className="btn text-xs py-2 px-3.5">
            + {t.header.createInvoice}
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-black/40 p-1 border border-white/5 text-xs font-semibold">
        <button
          id="profile-tab-analytics"
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 py-2 rounded-lg transition-all text-center ${
            activeTab === "analytics"
              ? "bg-teal-400 text-slate-950 shadow-md font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {t.profile.tabAnalytics}
        </button>
        <button
          id="profile-tab-requisites"
          onClick={() => setActiveTab("requisites")}
          className={`flex-1 py-2 rounded-lg transition-all text-center ${
            activeTab === "requisites"
              ? "bg-teal-400 text-slate-950 shadow-md font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {t.profile.tabRequisites}
        </button>
        <button
          id="profile-tab-collabs"
          onClick={() => setActiveTab("collabs")}
          className={`flex-1 py-2 rounded-lg transition-all text-center ${
            activeTab === "collabs"
              ? "bg-teal-400 text-slate-950 shadow-md font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {t.profile.tabCollaborators} ({collabs.length})
        </button>
      </div>

      {/* TAB 1: Analytics & History */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card space-y-1 bg-white/5 border border-white/10">
              <div className="text-xs text-slate-400">{t.profile.statTotalInvoiced}</div>
              <div className="text-2xl font-extrabold font-mono text-white">
                {lamportsToSol(totalGross)} <span className="text-xs text-teal-400 font-sans">SOL</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                ≈ {grossKzt.toLocaleString()} ₸
              </div>
            </div>

            <div className="card space-y-1 bg-teal-500/5 border border-teal-500/20">
              <div className="text-xs text-teal-300 font-medium">{t.profile.statNetEarned}</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">
                {lamportsToSol(totalNet)} <span className="text-xs text-teal-400 font-sans">SOL</span>
              </div>
              <div className="text-[11px] text-emerald-300/80 font-mono">
                ≈ {Math.round(netSol * (rate?.kzt || 75000)).toLocaleString()} ₸
              </div>
            </div>

            <div className="card space-y-1 bg-sky-500/5 border border-sky-500/20">
              <div className="text-xs text-sky-300 font-medium">{t.profile.statCollabPaid}</div>
              <div className="text-2xl font-extrabold font-mono text-sky-300">
                {lamportsToSol(totalCollab)} <span className="text-xs text-sky-400 font-sans">SOL</span>
              </div>
              <div className="text-[11px] text-sky-300/80 font-mono">
                ≈ {Math.round(collabSol * (rate?.kzt || 75000)).toLocaleString()} ₸
              </div>
            </div>

            <div className="card space-y-1 bg-amber-500/5 border border-amber-500/20">
              <div className="text-xs text-amber-300 font-medium">{t.profile.statTaxEstimate}</div>
              <div className="text-2xl font-extrabold font-mono text-amber-400">
                {taxKzt.toLocaleString()} <span className="text-xs text-amber-400 font-sans">₸</span>
              </div>
              <div className="text-[11px] text-amber-300/80">
                Упрощенка 3% (ф. 910 РК)
              </div>
            </div>
          </div>

          {/* Invoices History Table */}
          <div className="card space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-white">{t.profile.myInvoicesTitle}</h2>
              <button
                onClick={() => publicKey && loadInvoices(publicKey)}
                className="text-xs text-teal-300 hover:underline"
              >
                🔄 Обновить
              </button>
            </div>

            {loadingInvoices ? (
              <p className="text-xs text-slate-400 py-6 text-center">{t.common.loading}</p>
            ) : !invoices || invoices.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 space-y-3">
                <p>{t.profile.noInvoices}</p>
                <Link href="/create" className="btn text-xs py-2 px-4">
                  {t.header.createInvoice} →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="py-2.5 px-3">Инвойс</th>
                      <th className="py-2.5 px-3">Сумма</th>
                      <th className="py-2.5 px-3">Сплит</th>
                      <th className="py-2.5 px-3">Статус</th>
                      <th className="py-2.5 px-3 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {invoices.map((inv) => {
                      const split = computeSplit(inv.amount, inv.vaultBps, inv.collaboratorBps);
                      return (
                        <tr key={inv.invoiceId.toString()} className="hover:bg-white/5">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-white max-w-xs truncate">
                              {inv.title}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              #{inv.invoiceId.toString().slice(-6)}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-white">
                            {lamportsToSol(inv.amount)} SOL
                          </td>
                          <td className="py-3 px-3 text-[11px] font-mono text-slate-300">
                            <span className="text-teal-300">{lamportsToSol(split.creator)}</span>
                            {inv.collaborator && (
                              <span className="text-sky-300"> / {lamportsToSol(split.collaborator)}</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                inv.isPaid
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              {inv.isPaid ? "ОПЛАЧЕНО" : "ОЖИДАЕТ"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/pay/${inv.creator.toBase58()}/${inv.invoiceId}`}
                                className="text-teal-300 hover:underline"
                              >
                                Счет →
                              </Link>
                              {inv.isPaid ? (
                                <Link
                                  href={`/invoice/${inv.creator.toBase58()}/${inv.invoiceId}/act`}
                                  className="text-sky-300 hover:underline"
                                >
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
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Company Requisites (Реквизиты ИП/ТОО) */}
      {activeTab === "requisites" && (
        <div className="max-w-2xl">
          <form onSubmit={handleSaveProfile} className="card space-y-4">
            <div>
              <h2 className="text-base font-bold text-teal-300">
                🏢 Реквизиты для официального Акта выполненных работ (Форма Р-1)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Эти данные автоматически включаются в формируемый Акт выполненных работ с QR-печатью. Лишние поля (email, телефон, ники) удалены, так как система работает децентрализованно.
              </p>
            </div>

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
                <label className="label">{t.profile.bicLabel}</label>
                <input
                  className="input font-mono uppercase"
                  placeholder="KZKOKZ22"
                  value={form.bic}
                  onChange={(e) => setForm({ ...form, bic: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">{t.profile.legalAddressLabel}</label>
              <input
                className="input"
                placeholder="г. Астана, ул. Достык, д. 18"
                value={form.legalAddress}
                onChange={(e) => setForm({ ...form, legalAddress: e.target.value })}
              />
            </div>

            <div>
              <label className="label">{t.profile.ibanLabel}</label>
              <input
                className="input font-mono"
                placeholder="KZ869261801234567890"
                value={form.iban}
                onChange={(e) => setForm({ ...form, iban: e.target.value })}
              />
            </div>

            {savedSuccess && (
              <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-3 text-xs text-teal-300">
                {t.profile.savedAlert}
              </div>
            )}

            <button type="submit" className="btn w-full text-sm py-2.5">
              {t.profile.saveProfileBtn}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Collaborators Directory (База напарников) */}
      {activeTab === "collabs" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: Add Collaborator Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleAddCollaborator} className="card space-y-4">
                <div>
                  <h3 className="text-base font-bold text-sky-300">{t.profile.addCollabTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Сохраняйте напарников, чтобы при создании инвойса выбирать их из выпадающего списка в 1 клик.
                  </p>
                </div>

                <div>
                  <label className="label">{t.profile.collabNameLabel}</label>
                  <input
                    id="input-collab-name"
                    className="input text-xs"
                    placeholder={t.profile.collabNamePlaceholder}
                    value={newCollabName}
                    onChange={(e) => setNewCollabName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="label">{t.profile.collabWalletLabel}</label>
                  <input
                    id="input-collab-wallet"
                    className="input font-mono text-xs"
                    placeholder={t.profile.collabWalletPlaceholder}
                    value={newCollabWallet}
                    onChange={(e) => setNewCollabWallet(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="label mb-0">{t.profile.collabPctLabel}</label>
                    <span className="font-mono text-sky-400 font-bold text-xs">{newCollabPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    step={1}
                    value={newCollabPct}
                    onChange={(e) => setNewCollabPct(Number(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                </div>

                <div>
                  <label className="label">{t.profile.collabNoteLabel}</label>
                  <input
                    className="input text-xs"
                    placeholder={t.profile.collabNotePlaceholder}
                    value={newCollabNote}
                    onChange={(e) => setNewCollabNote(e.target.value)}
                  />
                </div>

                {collabError && (
                  <div className="rounded-lg bg-red-500/10 p-2.5 text-xs text-red-400">
                    {collabError}
                  </div>
                )}

                {collabSuccess && (
                  <div className="rounded-lg bg-teal-500/10 p-2.5 text-xs text-teal-300">
                    {t.profile.collabAddedAlert}
                  </div>
                )}

                <button id="btn-add-collab" type="submit" className="btn w-full text-xs py-2.5">
                  {t.profile.addCollabBtn}
                </button>

                {isDemo && collabs.length === 0 && (
                  <button
                    id="btn-quick-add-demo-designer"
                    type="button"
                    onClick={handleQuickAddDemoDesigner}
                    className="btn btn-ghost w-full text-xs py-2 text-amber-300 border-amber-500/30 hover:bg-amber-500/10"
                  >
                    + Добавить Demo-дизайнера (Алина)
                  </button>
                )}
              </form>
            </div>

            {/* Right: List of saved collaborators */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-base font-bold text-white">
                Сохраненные напарники ({collabs.length})
              </h3>

              {collabs.length === 0 ? (
                <div className="card text-center py-10 space-y-2 text-xs text-slate-400 border-dashed border-white/10">
                  <span className="text-2xl">🤝</span>
                  <p>{t.profile.noCollabsYet}</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {collabs.map((c) => (
                    <div
                      key={c.id}
                      className="card p-4 space-y-2.5 border border-white/10 hover:border-sky-500/30 transition-all bg-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 text-sm font-bold">
                            👤
                          </span>
                          <span className="font-bold text-white text-sm">{c.name}</span>
                        </div>
                        <span className="badge badge-cyan font-mono text-xs">
                          {c.defaultPct}% доля
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono bg-black/30 p-2 rounded-lg">
                        <span className="truncate max-w-xs">{c.wallet}</span>
                        <a
                          href={solscanAddr(c.wallet)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-300 hover:underline shrink-0 ml-2"
                        >
                          Solscan ↗
                        </a>
                      </div>

                      {c.note && (
                        <p className="text-xs text-slate-300 italic">
                          &ldquo;{c.note}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <Link
                          href={`/create?collabWallet=${encodeURIComponent(c.wallet)}&collabPct=${c.defaultPct}`}
                          className="text-xs text-teal-300 hover:text-teal-200 font-semibold"
                        >
                          {t.profile.useInInvoiceBtn}
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteCollab(c.id)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          {t.common.delete}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

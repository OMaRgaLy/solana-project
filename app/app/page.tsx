import Link from "next/link";

const steps = [
  ["1", "Create", "Set the amount, put 10% into your savings vault, optionally split with a collaborator."],
  ["2", "Share a Blink", "One link works in X, Telegram and anywhere Solana Actions are supported."],
  ["3", "Get paid", "Your client pays in one click. The split settles atomically — no waiting, no middlemen."],
  ["4", "Close the books", "Download an official Act of Completed Works with an on-chain QR seal for your accountant."],
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 pt-6 lg:grid-cols-2">
        <div className="space-y-6">
          <span className="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-semibold text-teal-300">🇰🇿 Built for Central Asian freelancers</span>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Invoice the world.<br />Get paid in <span className="text-teal-300">one click</span>.
          </h1>
          <p className="max-w-xl text-lg text-slate-300">
            Freelancers in Kazakhstan wait days for SWIFT, pay heavy fees, and can&apos;t use local cards abroad.
            SteppeInvoice turns an invoice into a Solana Blink: your client pays from a tweet, funds split instantly
            between you, your savings vault and your collaborator — and you get the paperwork your tax office expects.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/create" className="btn">Create an invoice →</Link>
            <a href="#how" className="btn btn-ghost">How it works</a>
          </div>
        </div>
        <div className="card space-y-3">
          <div className="text-xs uppercase tracking-widest text-slate-400">Example settlement · 1 SOL invoice</div>
          {[["Freelancer", "85%", "bg-teal-400", "w-[85%]"], ["Savings Vault", "10%", "bg-amber-400", "w-[10%]"], ["Collaborator", "5%", "bg-sky-400", "w-[5%]"]].map(([n, p, c, w]) => (
            <div key={n}>
              <div className="flex justify-between text-sm"><span>{n}</span><span>{p}</span></div>
              <div className="h-2 rounded bg-white/10"><div className={`h-2 rounded ${c} ${w}`} /></div>
            </div>
          ))}
          <p className="pt-2 text-xs text-slate-500">All three transfers happen in the same transaction as the payment.</p>
        </div>
      </section>

      <section id="how" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([n, t, d]) => (
          <div key={n} className="card">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-teal-400 font-bold text-black">{n}</div>
            <div className="font-semibold">{t}</div>
            <p className="mt-1 text-sm text-slate-400">{d}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["📄 Act of Completed Works", "Printable Акт выполненных работ with KZT equivalent and an on-chain QR seal linking to the settlement."],
          ["🏦 Savings vault", "Every payment automatically sets aside a share for taxes or savings. Roadmap: route it into Kamino / Jito / Lulo yield vaults."],
          ["🌟 Portable reputation", "Your paid-invoice history lives on-chain at a public profile — no Upwork or Fiverr lock-in."],
        ].map(([t, d]) => (
          <div key={t} className="card"><div className="font-semibold">{t}</div><p className="mt-1 text-sm text-slate-400">{d}</p></div>
        ))}
      </section>
    </div>
  );
}

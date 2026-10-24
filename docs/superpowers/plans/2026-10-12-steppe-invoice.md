# SteppeInvoice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (native execution chosen: user asked for uninterrupted work). Steps use checkbox syntax.

**Goal:** Working Devnet invoicing dApp with atomic SOL split, Solana Actions/Blinks, checkout, KZ Act of Works, reputation profile.

**Architecture:** Anchor program holds Invoice PDAs and performs split transfers. Next.js app reads accounts via IDL, builds txs client- and server-side (Actions). Everything keyed by `(creator, invoice_id)`.

**Tech Stack:** Anchor (Rust), TypeScript, Next.js App Router, Tailwind, @solana/wallet-adapter, @coral-xyz/anchor, qrcode, canvas-confetti.

**Spec:** `docs/superpowers/specs/2026-10-12-steppe-invoice-design.md`

## Global Constraints
- SOL only, Devnet. Math via `checked_*`. Title <= 64 chars. bps total <= 10000.
- Same split labels everywhere: Freelancer / Vault / Collaborator.
- Actions responses carry CORS headers and an OPTIONS handler.
- No claims of live yield; vault = savings address with roadmap integration.

## Review Focus
- Pay with payer == creator or vault == creator: must still split correctly.
- Collaborator bps > 0 with no collaborator key: rejected at init.
- Amount where bps shares round down (e.g. 1 lamport): remainder goes to creator, total conserved.
- Pay already-paid / cancelled (closed) invoice: clean error, no panic in UI/Blink.
- Cancel by non-creator: rejected.
- Blink POST with invalid account or missing invoice: valid Actions error JSON.

## File Structure
- `programs/steppe_invoice/src/lib.rs` — program (state, ixs, errors, event)
- `tests/steppe_invoice.ts` — anchor tests
- `app/` — Next.js app (separate package)
  - `lib/program.ts` (IDL, PDA, fetch, ix builders), `lib/split.ts` (pure split math), `lib/format.ts`, `lib/kzt.ts`
  - `app/page.tsx`, `app/create/page.tsx`, `app/pay/[creator]/[id]/page.tsx`, `app/invoice/[creator]/[id]/act/page.tsx`, `app/profile/[wallet]/page.tsx`
  - `app/api/actions.json/route.ts`, `app/api/actions/invoice/[creator]/[id]/route.ts`, `app/api/og/invoice/route.tsx`

### Task 1: Toolchain + scaffold
- [ ] Verify `rustc`, `solana`, `anchor` in WSL; `anchor init` project into repo dir; symlink `target` to WSL home; `solana config set --url devnet`; keygen; airdrop.
- [ ] `git init`, commit.

### Task 2: Program + tests (TDD)
**Produces:** accounts `Invoice`; ixs `initialize_invoice(invoice_id:u64, amount:u64, title:String, vault_recipient:Pubkey, vault_bps:u16, collaborator:Option<Pubkey>, collab_bps:u16)`, `pay_invoice()`, `cancel_invoice()`; event `InvoicePaidEvent`.
- [ ] Write tests (lifecycle 85/10/5, double pay, bps validation, collab key required, non-creator cancel, rounding conservation).
- [ ] Implement; `anchor test` green; commit.

### Task 3: Devnet deploy
- [ ] `anchor build`, `anchor deploy --provider.cluster devnet`; record program id in README; run a devnet smoke script (create+pay) so Solscan has txs.

### Task 4: Web foundation + split lib
- [ ] Scaffold Next.js in `app/`, copy IDL, `lib/split.ts` with unit tests (mirror program math), `lib/program.ts`.

### Task 5: Actions/Blinks API
- [ ] GET/POST/OPTIONS route, `actions.json`, OG icon route; curl-verify JSON shape and a POST tx simulates OK on devnet.

### Task 6: Create + Share UI
- [ ] Wallet provider, builder with sliders + live donut, deploy tx, share card (dial.to, X, Telegram), Blink simulator.

### Task 7: Checkout page
- [ ] `/pay/[creator]/[id]`: details, connect & pay, confetti, Solscan link, paid/closed states.

### Task 8: Act of Works + Profile
- [ ] Printable Act with QR + tx hash + KZT; profile aggregating paid invoices via `getProgramAccounts` filter by creator.

### Task 9: Docs + videos + ship
- [ ] README (mermaid, program id, run/test), `docs/DEMO_SCRIPT.md`, `docs/PITCH_SCRIPT.md`; `npm run build` green; push-ready; Vercel deploy steps.

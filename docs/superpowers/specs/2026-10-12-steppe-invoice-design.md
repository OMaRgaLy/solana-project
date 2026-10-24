# SteppeInvoice — Design Spec (2026-10-12)

## Goal
Working Devnet prototype for Superteam Kazakhstan side track (Colosseum Crypto World's Fair). Judges require a *working* product. ~15h budget.

## Scope (MVP, SOL only)
1. **Anchor program `steppe_invoice`**: `initialize_invoice`, `pay_invoice` (atomic split creator/vault/collaborator via System CPI, checked math, `InvoicePaidEvent`, double-pay guard), `cancel_invoice` (`close = creator`). Invoice PDA seeds `[b"invoice", creator, invoice_id_le]`. Validation: `vault_bps + collab_bps <= 10000`, title <= 64, collaborator bps requires collaborator key, amount > 0.
2. **Next.js app** (App Router, TS, Tailwind, wallet-adapter):
   - `/` landing + dashboard (my invoices), `/create` builder with split sliders + live chart, Blink share card (dial.to link, X/Telegram share, Blink simulator).
   - `/pay/[creator]/[id]` public checkout, success + Solscan link.
   - `/api/actions.json`, `/api/actions/invoice/[creator]/[id]` GET (metadata, dynamic icon via ImageResponse) / POST (base64 `pay_invoice` tx) / OPTIONS, with Actions CORS headers.
   - `/invoice/[creator]/[id]/act` printable Act of Completed Works (RK format, KZT equivalent, QR to Solscan tx, tx hash).
   - `/profile/[wallet]` reputation: total received, paid-invoice count, badge, derived from on-chain accounts + program events.
3. **Docs**: README (architecture diagram, devnet program id, run/test), demo (3 min) and pitch (2 min) scripts.

## Explicit non-goals / honesty
- USDC/SPL: roadmap only. Vault is a configurable savings address; Kamino/Jito/Lulo yield is a roadmap integration, not claimed live.
- Invoice description / client name are off-chain (URL/Blink params); only title is on-chain.
- Split shown consistently as creator / vault / collaborator everywhere.

## Architecture notes
- Invoice URL id = `creator pubkey + invoice_id` (PDA needs creator).
- Client reads accounts with Anchor IDL; Blink POST builds the instruction server-side.
- Build env: WSL Ubuntu 22.04; repo on Windows path, cargo target dir symlinked into WSL home for speed.
- Deploy web to Vercel for public Blink unfurling.

## Testing
`anchor test` on localnet: lifecycle (create → 85/10/5 split → balances → double-pay rejected → cancel unpaid), validation failures, unauthorized cancel. Web: `npm run build`, manual Devnet E2E, Action endpoint JSON checks via curl.

## Order
env → contract+tests → devnet deploy → actions API → UI → act → profile → docs/scripts.

# ðŸ¹ SteppeInvoice

**Invoice the world. Get paid in one click.** Solana invoices with instant on-chain auto-split, shareable Blinks, and an official Kazakhstan *ÐÐºÑ‚ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð½Ñ‹Ñ… Ñ€Ð°Ð±Ð¾Ñ‚* sealed with an on-chain QR.

Built for the Superteam Kazakhstan track of the Colosseum Crypto World's Fair Hackathon.

## The problem

Freelancers in Kazakhstan and Central Asia selling to clients abroad face slow, expensive SWIFT transfers, cards that don't work across borders, and platforms (Upwork, Fiverr) that own their reputation. On top of that, local accounting and tax filing still expect a formal *ÐÐºÑ‚ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð½Ñ‹Ñ… Ñ€Ð°Ð±Ð¾Ñ‚* tied to every payment.

## The solution

1. **Create** an invoice on Solana: amount, title, and an auto-split (savings/tax vault, optional collaborator).
2. **Share a Blink**: one link that your client can pay from X, Telegram, or any Solana Actions client.
3. **Get paid atomically**: the smart contract splits the payment in the same transaction. No custody, no waiting.
4. **Close the books**: one click generates a printable Act of Completed Works (KZT equivalent + QR to the Solscan settlement transaction).
5. **Portable reputation**: a public profile computed from your on-chain invoices.

## Architecture

```mermaid
flowchart LR
  F[Freelancer wallet] -- initialize_invoice --> P[(Anchor program<br/>steppe_invoice)]
  P --> I[Invoice PDA<br/>creator + id]
  C[Client in X / Telegram / web] -- GET/POST Action --> A[Next.js Actions API<br/>/api/actions/invoice/creator/id]
  A -- reads --> I
  A -- unsigned pay_invoice tx --> C
  C -- signs --> P
  P -- atomic split --> W1[Freelancer 85%]
  P -- atomic split --> W2[Savings vault 10%]
  P -- atomic split --> W3[Collaborator 5%]
  I --> ACT[Act of Completed Works<br/>+ QR to Solscan]
  I --> PROF[Reputation profile]
```

| Part | Where |
| --- | --- |
| Anchor program | `programs/steppe_invoice/src/lib.rs` |
| Program tests (9) | `tests/steppe_invoice.ts` |
| Web app (Next.js) | `app/` |
| Blink / Actions API | `app/app/api/actions/invoice/[creator]/[id]/route.ts`, `app/app/actions.json/route.ts` |
| Act of Works | `app/app/invoice/[creator]/[id]/act/page.tsx` |
| Reputation profile | `app/app/profile/[wallet]/page.tsx` |

### Smart contract

Invoice PDA seeds: `["invoice", creator, invoice_id (u64 LE)]`.

- `initialize_invoice` validates `vault_bps + collaborator_bps <= 10000`, title â‰¤ 64 bytes, amount > 0, and that a collaborator share has a collaborator wallet.
- `pay_invoice` computes shares with `checked_mul` / `checked_div`, transfers to vault, collaborator and creator via the System Program in the same transaction, sets `is_paid`, `payer`, `paid_at`, and emits `InvoicePaidEvent`. The creator receives the remainder, so rounding dust is never lost. A paid invoice cannot be paid again.
- `cancel_invoice` closes an **unpaid** invoice and refunds rent to the creator; only the creator can call it.

## Try it without any wallet extension

Open `/demo`: five public Devnet test wallets (freelancer, two clients, vault, collaborator) are built into the site. Their keys are published on purpose and hold worthless test SOL. Connect *Demo Freelancer*, create an invoice, switch to *Demo Client 1*, pay it, and watch the balances change. An on-screen Activity log shows every step. Phantom/Solflare also work.

## Telegram bot

`@steppeinvoice_bot` (Russian, Kazakh, English; picks the language from Telegram, `/lang` overrides it). Every action is a button on the main menu:

- **Try it on the test network** (`/demo`): the bot creates an invoice as *Demo Freelancer*, offers *Pay as demo client*, and then sends the "Paid" alert with a link to the act. The whole flow with nothing to install.
- **Create invoice** (`/new`): a short dialogue that hands a prefilled draft to the site, where the wallet signs.
- **Link a wallet** (`/wallet <address>` or `/wallet demo`), **My invoices** (`/my`), **Taxes** (`/tax`), **SOL rate** (`/rate`).
- Payment alerts: the server re-reads the invoice from chain before notifying, so a forged request cannot announce an unpaid invoice.
- Sign in on the site through the bot (one tap on *Start*); no passwords.

## Finance and taxes

`/dashboard` combines on-chain income with income earned elsewhere (added by hand), and estimates Kazakhstan 2026 taxes for the *self-employed* regime and for an *IP on the simplified declaration*, with the next payment deadlines. Rules and sources live in [`app/lib/tax/kz2026.ts`](app/lib/tax/kz2026.ts) and are covered by tests. It is an estimate, not tax advice.

## Run it

Prerequisites: Rust, Solana CLI, Anchor 1.2.1, Node 22. (On Windows use WSL Ubuntu; `scripts/` contains the setup helpers.)

```bash
# 1. Program tests (local validator)
anchor build
anchor test --validator legacy        # 9 passing

# 2. Web app
cd app
cp .env.example .env.local            # set NEXT_PUBLIC_PROGRAM_ID (+ bot variables, see docs/TELEGRAM_SETUP.md)
npm install --legacy-peer-deps
npm run dev                           # ngrok tunnel + Telegram webhook + site, one command
npm run dev:plain                     # site only, http://localhost:3000
npm run build                         # production build
npx vitest run                        # split math unit tests

# 3. End-to-end scripts (any cluster)
KEYPAIR=~/.config/solana/id.json RPC=https://api.devnet.solana.com \
  NEXT_PUBLIC_PROGRAM_ID=<id> npx tsx scripts/smoke.ts
KEYPAIR=... RPC=... APP=http://localhost:3000 NEXT_PUBLIC_PROGRAM_ID=<id> npx tsx scripts/blink-e2e.ts
```

### Deploy to Devnet

```bash
solana config set --url devnet
solana airdrop 2          # or https://faucet.solana.com
anchor deploy --provider.cluster devnet
```

Program ID (declared in the program): `7ze4Utjmn73v42terYZMTFVGCt2ygVu9u85US89uNGJm`

> Deployed on Devnet: [program](https://solscan.io/account/7ze4Utjmn73v42terYZMTFVGCt2ygVu9u85US89uNGJm?cluster=devnet). Sample create/pay transactions: [`docs/DEVNET.md`](docs/DEVNET.md).

## Blinks

- `GET /actions.json` (and `/api/actions.json`): routing rules for `/pay/*/*` â†’ `/api/actions/invoice/*/*`.
- `GET /api/actions/invoice/:creator/:id`: Action metadata (dynamic banner, title, auto-split description, `Pay Invoice` label).
- `POST /api/actions/invoice/:creator/:id` with `{ "account": "<payer>" }`: returns a base64 `pay_invoice` transaction + message.

Blinks unfurl inside X only from a public HTTPS domain registered with Dialect; every invoice also works through `https://dial.to/?action=solana-action:<action-url>`.

## Scope and honesty

- **SOL only** on Devnet in this submission. SPL USDC is the first roadmap item.
- The **savings vault** is a configurable wallet address. Routing it into yield vaults (Kamino / Jito / Lulo) is roadmap, not implemented; the UI says so.
- Invoice description and client name are kept off-chain (link parameters / Act form); only the title is stored on-chain.
- The KZT equivalent on the Act is an informational rate (CoinGecko SOL/USD Ã— open.er-api USD/KZT) at generation time, not an official NBK rate. The Act is a helper document; check requirements with your accountant.
- The program has tests but **has not been independently audited**.

## Roadmap

SPL USDC, yield-vault routing, per-invoice client details on-chain via hashed metadata, recurring invoices, Kaspi/KZT off-ramp partners, e-sign of the Act.


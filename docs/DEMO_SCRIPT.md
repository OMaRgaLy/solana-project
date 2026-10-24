# Demo video script (≤ 3:00): product demo, working product only, no slides

**Before recording:** open `https://steppe-invoice-delta.vercel.app/demo` (the built-in demo wallets hold Devnet test SOL; no browser extension needed). Do one full dry run first. Record at 1080p; upload to YouTube/Loom (unlisted). Keep the **Activity log** panel open: it shows every step live.

| Time | On screen | Say (EN) | Do |
| --- | --- | --- | --- |
| 0:00–0:30 **Problem** | Landing page hero | "I'm a freelancer in Kazakhstan. My client is in the US. SWIFT takes days and eats fees, and my local card doesn't work abroad. And in the end my accountant still wants an official Act of Completed Works." | Scroll the landing page to the 4 steps. |
| 0:30–1:30 **Create + Blink** | `/demo`, then `/create` | "I'm using a built-in Devnet test wallet: real transactions, worthless coins. I create an invoice: title, amount, and an auto-split. 10% goes to my savings vault, 5% to my collaborator." | On `/demo` press **Use this wallet** on *Demo Freelancer*. Open **Create invoice**, set 0.05 SOL, click *Use Demo Savings Vault* and enable collaborator + *Use Demo Collaborator*, drag the slider (donut updates), press **Deploy Invoice to Devnet**. |
| | Share card | "I get a Blink: one link that works in X and Telegram." | Show the dial.to link, click **Share to Twitter/X** (composer opens), show the Blink simulator. Copy the checkout link. |
| 1:30–2:15 **Client pays** | `/demo` then checkout link | "Now I'm the client. One click to pay." | Open `/demo`, **Use this wallet** on *Demo Client 1*, open the checkout link, press **Pay**. Confetti. |
| | Solscan + `/demo` balances | "The split happened atomically: freelancer, vault and collaborator were paid in the same transaction." | Click **View on Solscan**, show the transfers and the `InvoicePaidEvent` log. Then show the balances on `/demo` changed. |
| 2:15–3:00 **Killer feature** | `/invoice/…/act` | "At home, what matters is the paperwork. One click and I get an official Act of Completed Works with the KZT equivalent and an on-chain seal: a QR that leads to the Solscan transaction, so my accountant can verify it." | Click **Open Act of Completed Works**, fill executor / IIN / customer, press **Скачать Акт**, show print preview, zoom on the QR. Finish on `/profile/<wallet>`: "Every paid invoice builds portable on-chain reputation." |

**Be transparent on camera:** it runs on Solana Devnet with test coins; SOL only (USDC is roadmap); the savings vault is a configurable address (yield routing is roadmap). Real wallets (Phantom, Solflare) work too.

# Demo video script (≤ 3:00) — «Product demo: working product only, no slides»

**Before recording:** Phantom on Devnet with ~2 SOL; a second browser profile (or second wallet) as the *client*; app deployed (public URL) or `npm run dev`; one invoice pre-created for a backup take. Record at 1080p, YouTube/Loom unlisted.

| Time | On screen | Say (EN) | Do |
| --- | --- | --- | --- |
| 0:00–0:30 **Problem** | Landing page hero | "I'm a freelancer in Kazakhstan. My client is in the US. SWIFT takes days and eats fees, and my local card doesn't work abroad. And at the end my accountant still wants an official Act of Completed Works." | Scroll the landing page slowly to the 4 steps. |
| 0:30–1:30 **Create + Blink** | `/create` | "With SteppeInvoice I create an invoice in seconds: title, amount, and an auto-split — 10% goes straight to my savings vault, 5% to my collaborator." | Fill form, drag the vault slider (donut updates live), enable collaborator, **Deploy Invoice to Devnet**, approve in Phantom. |
| | Share card | "I get a Blink — one link that works in X and Telegram." | Show the dial.to link, click **Share to Twitter/X** (composer opens), show the Blink simulator. |
| 1:30–2:15 **Client pays** | Client browser: Blink link / `/pay/…` | "My client clicks the Blink and pays in one click." | Connect client wallet, **Pay**. Confetti. Click **View on Solscan**. |
| | Solscan tx | "Atomic split in one transaction: freelancer, vault and collaborator were paid instantly." | Point at the three transfers + `InvoicePaidEvent` log. |
| 2:15–3:00 **Killer feature** | `/invoice/…/act` | "Now the part that matters at home: one click and I get an official Act of Completed Works, with the KZT equivalent and an on-chain seal — a QR that leads straight to the Solscan transaction, so my accountant or the tax office can verify it." | Fill executor/IIN/customer, click **Скачать Акт**, show print preview, zoom on the QR. Finish on `/profile/<wallet>`: "…and every paid invoice builds a portable on-chain reputation." |

**Do not claim:** live yield (the vault is a savings address; yield routing is roadmap), USDC support, or mainnet.

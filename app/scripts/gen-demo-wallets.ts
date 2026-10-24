// Generates PUBLIC demo wallets (Devnet test coins only) and writes lib/demoWallets.ts. Run once.
import { writeFileSync, existsSync } from "fs";
import { Keypair } from "@solana/web3.js";

const out = "lib/demoWallets.ts";
if (existsSync(out)) { console.log(out, "already exists; delete it to regenerate"); process.exit(0); }
const roles = [
  ["freelancer", "Demo Freelancer", "Creates invoices and gets paid"],
  ["client1", "Demo Client 1", "Pays invoices"],
  ["client2", "Demo Client 2", "Pays invoices"],
  ["vault", "Demo Savings Vault", "Receives the vault share"],
  ["collaborator", "Demo Collaborator", "Receives the collaborator share"],
] as const;
const items = roles.map(([id, label, role]) => {
  const kp = Keypair.generate();
  return `  { id: "${id}", label: "${label}", role: "${role}", publicKey: "${kp.publicKey.toBase58()}", secretKey: [${Array.from(kp.secretKey).join(",")}] },`;
});
writeFileSync(out, `// PUBLIC DEMO WALLETS — Solana Devnet test coins only (worth nothing). The secret keys are published on purpose
// so anyone can try the product without installing a wallet. NEVER put real funds in these addresses.
export type DemoWallet = { id: string; label: string; role: string; publicKey: string; secretKey: number[] };

export const DEMO_WALLETS: DemoWallet[] = [
${items.join("\n")}
];

export const demoById = (id: string) => DEMO_WALLETS.find((w) => w.id === id)!;
`);
console.log("wrote", out);

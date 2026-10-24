// PUBLIC DEMO WALLETS — Solana Devnet test coins only (worth nothing). The secret keys are published on purpose
// so anyone can try the product without installing a wallet. NEVER put real funds in these addresses.
export type DemoWallet = { id: string; label: string; role: string; publicKey: string; secretKey: number[] };

export const DEMO_WALLETS: DemoWallet[] = [
  { id: "freelancer", label: "Demo Freelancer", role: "Creates invoices and gets paid", publicKey: "HYtH4tgady7a3yzikZns2vGYH4e1Jxspwsh4mVZnJYbV", secretKey: [32,169,161,1,71,158,155,225,91,223,45,79,136,215,202,128,36,59,115,32,48,169,18,252,200,1,81,109,171,122,53,228,245,229,249,154,114,31,43,158,90,139,239,239,146,99,195,135,165,13,47,78,98,128,135,194,224,54,53,188,217,235,179,164] },
  { id: "client1", label: "Demo Client 1", role: "Pays invoices", publicKey: "6vTb6L2qW7jdNoPM84Eg7LPKEzVJ3LytD4zB1B34srcx", secretKey: [86,99,45,67,45,120,242,191,23,11,88,142,236,104,62,221,112,245,208,148,88,25,93,37,219,105,198,60,193,170,119,182,87,252,71,201,215,73,105,252,201,217,106,0,9,249,156,103,210,115,30,210,30,172,128,6,115,246,182,76,42,83,136,201] },
  { id: "client2", label: "Demo Client 2", role: "Pays invoices", publicKey: "99oabuMbjjN6uveiNuguEzwoLZQzB3RaGej9z7xjfARj", secretKey: [122,179,85,111,209,45,83,181,54,31,108,75,9,221,34,243,209,218,58,153,127,28,1,48,15,143,50,172,188,98,149,189,121,30,207,47,18,247,187,225,201,249,14,9,33,110,117,243,226,193,72,221,117,74,13,11,138,11,151,206,198,45,11,206] },
  { id: "vault", label: "Demo Savings Vault", role: "Receives the vault share", publicKey: "Gfht8cY28Kr3Zzo65ru8faDTUK6BNyCzVD2BRwV2ydKW", secretKey: [195,80,94,187,213,49,43,66,109,174,174,63,38,226,12,21,9,172,164,39,90,209,189,159,227,226,80,236,128,51,27,254,232,201,153,126,60,132,220,178,91,166,50,233,208,227,129,215,166,46,41,218,105,136,163,198,176,99,150,78,34,60,242,17] },
  { id: "collaborator", label: "Demo Collaborator", role: "Receives the collaborator share", publicKey: "965avUobBe3eRzgen5EoGCFAByoZaGGvwvSzcfKAsTDx", secretKey: [230,248,122,85,127,240,66,168,56,190,241,117,13,105,247,240,82,4,75,26,247,183,7,163,14,84,233,142,167,129,68,44,120,42,149,101,83,255,191,204,215,98,221,81,189,148,14,96,179,26,165,81,215,74,216,117,174,44,31,118,55,27,35,55] },
];

export const demoById = (id: string) => DEMO_WALLETS.find((w) => w.id === id)!;

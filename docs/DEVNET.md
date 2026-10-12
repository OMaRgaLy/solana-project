# Devnet deployment

Program ID: `7ze4Utjmn73v42terYZMTFVGCt2ygVu9u85US89uNGJm`
Deploy wallet (upgrade authority): `7SxBDg7qqksad9dHbev2MbFWWWNkEwP4NiqnMgFaTU7N`

**Status: not deployed yet** — the public Devnet faucet rate-limited the deploy wallet (HTTP 429). Fund it at https://faucet.solana.com (need ≥ 3 SOL), then:

```bash
wsl -d Ubuntu-22.04 -- bash /mnt/c/Users/hacke/Projects/solana-project/scripts/deploy-devnet.sh
cd app
KEYPAIR=//wsl.localhost/Ubuntu-22.04/home/hackeevo/.config/solana/id.json RPC=https://api.devnet.solana.com \
  NEXT_PUBLIC_PROGRAM_ID=7ze4Utjmn73v42terYZMTFVGCt2ygVu9u85US89uNGJm npx tsx scripts/smoke.ts
```

Then paste the printed Solscan links below.

## Transactions
- _(add after deploy)_

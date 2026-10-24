# Devnet deployment

Program ID: `7ze4Utjmn73v42terYZMTFVGCt2ygVu9u85US89uNGJm`
Deploy wallet (upgrade authority): `7SxBDg7qqksad9dHbev2MbFWWWNkEwP4NiqnMgFaTU7N`

**Status: deployed to Devnet** ([program on Solscan](https://solscan.io/account/7ze4Utjmn73v42terYZMTFVGCt2ygVu9u85US89uNGJm?cluster=devnet)). To redeploy (wallet needs ≥ 3 SOL from https://faucet.solana.com):

```bash
wsl -d Ubuntu-22.04 -- bash /mnt/c/Users/hacke/Projects/solana-project/scripts/deploy-devnet.sh
cd app
KEYPAIR=//wsl.localhost/Ubuntu-22.04/home/hackeevo/.config/solana/id.json RPC=https://api.devnet.solana.com \
  NEXT_PUBLIC_PROGRAM_ID=7ze4Utjmn73v42terYZMTFVGCt2ygVu9u85US89uNGJm npx tsx scripts/smoke.ts
```


## Transactions
- Create invoice (10% vault / 5% collaborator): [Solscan](https://solscan.io/tx/YaXcUbTtafTj2WBRUPAygWJPMVftS1U4ZEcbmcKzwdaKsXR6mV8tAfzqALQCXQM4u6vRw6Tzq47a53TkEUk4iGM?cluster=devnet)
- Pay invoice (atomic 85/10/5 split, 0.1 SOL): [Solscan](https://solscan.io/tx/4YaedTpdExgPC4yMDqLMNtFysfzJGfsBNygaREWPmUEDp2w9RgdrvuHhvUXc2eFyaHfmqPiehU5aZRYwYVxGuo8J?cluster=devnet)
- Demo invoice page path: `/pay/7SxBDg7qqksad9dHbev2MbFWWWNkEwP4NiqnMgFaTU7N/1791820831414`

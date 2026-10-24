#!/usr/bin/env bash
# Run inside WSL after the deploy wallet has >= 3 SOL on devnet:
#   bash scripts/deploy-devnet.sh
set -euo pipefail
R="$(cd "$(dirname "$0")/.." && pwd)"
. "$R/scripts/env.sh"
solana config set --url devnet >/dev/null
echo "wallet $(solana address) balance $(solana balance)"
bash "$R/scripts/wsl.sh" build
bash "$R/scripts/wsl.sh" deploy --provider.cluster devnet
solana program show "$(solana-keygen pubkey "$R/keys/steppe_invoice-keypair.json")"

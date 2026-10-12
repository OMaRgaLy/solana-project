#!/usr/bin/env bash
set -euo pipefail
R="$(cd "$(dirname "$0")/.." && pwd)"
. "$R/scripts/env.sh"
cp ~/tpl/rust-toolchain.toml "$R/" 2>/dev/null || true
mkdir -p ~/.config/solana
[ -f ~/.config/solana/id.json ] || solana-keygen new --no-bip39-passphrase -s -o ~/.config/solana/id.json >/dev/null
solana config set --url devnet >/dev/null
[ -f "$R/keys/steppe_invoice-keypair.json" ] || solana-keygen new --no-bip39-passphrase -s -o "$R/keys/steppe_invoice-keypair.json" >/dev/null
PID="$(solana-keygen pubkey "$R/keys/steppe_invoice-keypair.json")"
sed -i "s/declare_id!(\".*\")/declare_id!(\"$PID\")/" "$R/programs/steppe_invoice/src/lib.rs"
sed -i "s/^steppe_invoice = \".*\"/steppe_invoice = \"$PID\"/" "$R/Anchor.toml"
echo "PROGRAM_ID=$PID"
echo "WALLET=$(solana address)"
command -v rsync >/dev/null || echo "NO_RSYNC"

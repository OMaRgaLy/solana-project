#!/usr/bin/env bash
# Installs Solana CLI + Anchor (via avm) in WSL. Rust is installed separately by rustup.
set -e
. "$HOME/.cargo/env"
if ! command -v solana >/dev/null 2>&1 && [ ! -d "$HOME/.local/share/solana" ]; then
  curl -sSfL https://release.anza.xyz/stable/install | sh
fi
export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.cargo/bin:$PATH"
solana --version
cargo install --git https://github.com/coral-xyz/anchor avm --force
avm install latest
avm use latest
anchor --version
echo SETUP_DONE

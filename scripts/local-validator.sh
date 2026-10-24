# Starts a local validator with the program preloaded (for web E2E). Ctrl-C to stop.
. "$(dirname "$0")/env.sh"
R="$(cd "$(dirname "$0")/.." && pwd)"
PID="$(solana-keygen pubkey "$R/keys/steppe_invoice-keypair.json")"
mkdir -p ~/ledger-local
solana-test-validator --reset --ledger ~/ledger-local --bpf-program "$PID" "$R/target/deploy/steppe_invoice.so" > ~/validator.log 2>&1

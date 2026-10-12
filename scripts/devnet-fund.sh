. "$(dirname "$0")/env.sh"
solana config set --url devnet >/dev/null
echo "wallet: $(solana address)"
for i in 1 2 3; do solana airdrop 2 2>&1 | tail -1; sleep 3; done
solana balance

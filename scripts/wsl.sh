#!/usr/bin/env bash
# Usage (inside WSL): scripts/wsl.sh <anchor args...>
# Builds in a WSL-native copy (fast fs), then copies artifacts back to the repo.
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
DST="$HOME/steppe-build"
. "$SRC/scripts/env.sh"
mkdir -p "$DST/target/deploy"
rsync -a --delete --exclude app --exclude target --exclude node_modules --exclude .git --exclude docs "$SRC/" "$DST/"
if [ -f "$SRC/keys/steppe_invoice-keypair.json" ]; then cp "$SRC/keys/steppe_invoice-keypair.json" "$DST/target/deploy/"; fi
cd "$DST"
[ -d node_modules ] || npm install --no-audit --no-fund
set +e
anchor "$@"
status=$?
set -e
mkdir -p "$SRC/target"
for d in idl types; do [ -d "$DST/target/$d" ] && rm -rf "$SRC/target/$d" && cp -r "$DST/target/$d" "$SRC/target/$d"; done
mkdir -p "$SRC/target/deploy"; [ -f "$DST/target/deploy/steppe_invoice.so" ] && cp "$DST/target/deploy/steppe_invoice.so" "$SRC/target/deploy/"
exit $status

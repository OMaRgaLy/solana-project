set -euo pipefail
V=v22.21.0
cd ~
if [ ! -x "$HOME/node/bin/node" ]; then
  curl -fsSLO "https://nodejs.org/dist/$V/node-$V-linux-x64.tar.xz"
  curl -fsSLO "https://nodejs.org/dist/$V/SHASUMS256.txt"
  grep "node-$V-linux-x64.tar.xz" SHASUMS256.txt | sha256sum -c -
  mkdir -p node && tar -xJf "node-$V-linux-x64.tar.xz" -C node --strip-components=1
  rm -f "node-$V-linux-x64.tar.xz" SHASUMS256.txt
fi
"$HOME/node/bin/node" -v

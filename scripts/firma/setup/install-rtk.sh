#!/usr/bin/env bash
# Firma OS · Install rtk-ai (Rust Token Killer) locally
#
# Klont rtk-ai nach tools/rtk und baut das Release-Binary.
# Per Hard-Stop-Rule wurde dies von Belkis schriftlich freigegeben.
#
# Voraussetzungen: git, cargo, rustc (Rust >= 1.75)
# Zeit: ~3 Min auf erster Maschine.
# Disk: ~600 MB für target/ (gitignored).

set -euo pipefail

REPO_URL="https://github.com/rtk-ai/rtk"
DEST="tools/rtk"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"

cd "$ROOT"

if [ -x "$DEST/target/release/rtk" ]; then
  echo "✓ rtk bereits installiert: $($DEST/target/release/rtk --version)"
  exit 0
fi

if [ ! -d "$DEST/.git" ]; then
  echo "→ Klone $REPO_URL nach $DEST/"
  mkdir -p tools
  git clone --depth=1 "$REPO_URL" "$DEST"
else
  echo "✓ $DEST existiert bereits, überspringe clone"
fi

if ! command -v cargo >/dev/null 2>&1; then
  echo "Fehler: cargo nicht gefunden. Bitte Rust installieren: https://rustup.rs"
  exit 1
fi

echo "→ cargo build --release (kann mehrere Minuten dauern)"
( cd "$DEST" && cargo build --release )

echo "✓ rtk installiert: $($DEST/target/release/rtk --version)"
echo ""
echo "Benchmark ausführen: npm run bench:rtk"

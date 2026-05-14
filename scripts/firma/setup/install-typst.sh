#!/usr/bin/env bash
# Firma OS · Install Typst CLI locally
#
# Typst (Apache 2.0) wird via cargo nach tools/typst/bin/typst installiert.
# Per Approval von Belkis freigegeben.
#
# Voraussetzungen: cargo, rustc (Rust >= 1.75)
# Zeit: ~5 Min auf erster Maschine.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
DEST="$ROOT/tools/typst"

cd "$ROOT"

if [ -x "$DEST/bin/typst" ]; then
  echo "✓ typst bereits installiert: $($DEST/bin/typst --version)"
  exit 0
fi

if ! command -v cargo >/dev/null 2>&1; then
  echo "Fehler: cargo nicht gefunden. Bitte Rust installieren: https://rustup.rs"
  exit 1
fi

echo "→ cargo install typst-cli --root $DEST (kann mehrere Minuten dauern)"
cargo install typst-cli --root "$DEST"

echo "✓ typst installiert: $($DEST/bin/typst --version)"

#!/usr/bin/env bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
cd "$(dirname "$0")"
node tools/setup.js "$@"
if [ $# -eq 0 ]; then
  read -p "Premi Invio per chiudere..."
fi

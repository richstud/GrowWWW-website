#!/bin/bash
# Run by Serverbyt Git Version Control after it pulls this branch.
# Copies the website into public_html. It only adds or replaces files, so
# anything uploaded straight to the host (like the favicon) is kept.
set -e
SRC="$(cd "$(dirname "$0")/.." && pwd)"
DEST="/home/sites/39b/c/c94bf59ddd/public_html"
[ -d "$DEST" ] || DEST="$HOME/public_html"
[ -d "$DEST" ] || { echo "public_html not found"; exit 1; }
cd "$SRC"
tar --exclude=./.git --exclude=./_deploy -cf - . | (cd "$DEST" && tar -xf -)
echo "Website copied to $DEST"

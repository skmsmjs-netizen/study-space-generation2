#!/bin/zsh
cd "${0:A:h}" || exit 1
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
exec node scripts/open-code-practice.mjs

#!/usr/bin/env bash
set -euo pipefail

input="$(cat)"

# Extremely small parser to avoid jq dependency in hook environment.
command="$(python3 - <<'PY' 2>/dev/null || true
import json, sys
try:
  data = json.load(sys.stdin)
  print(data.get("command", "") or "")
except Exception:
  print("")
PY
<<<"$input")"

if [[ "$command" =~ (^|[[:space:]])(npm|npx|pnpm|yarn)([[:space:]]|$) ]]; then
  cat <<'JSON'
{
  "permission": "ask",
  "user_message": "This project uses Bun. Please use bun/bunx (e.g. `bun add ...`, `bun run ...`, `bunx --bun shadcn@latest ...`).",
  "agent_message": "Hook reminder: avoid npm/npx/pnpm/yarn in this repo."
}
JSON
  exit 0
fi

echo '{ "permission": "allow" }'
exit 0


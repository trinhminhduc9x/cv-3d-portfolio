#!/bin/bash
# Soft reminder (not a hard block) to run a relevant skill before editing code.
# Runs on PreToolUse for Edit/Write/MultiEdit/NotebookEdit. Always exits 0 —
# this only nudges via stderr, it never prevents the edit.
if [ ! -f .claude/state/skill-active.flag ]; then
  echo "⚠️  No skill run yet this session. Consider a relevant skill first — /quick-design (small changes), /architecture-decision (structural changes), /code-review, or /web3d-optimization (assets/perf) — before editing code." >&2
fi
exit 0

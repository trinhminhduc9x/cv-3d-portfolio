---
name: changelog
description: "Generates a CHANGELOG entry for CV_3D from recent git commits, categorized into features/improvements/fixes."
argument-hint: "[version or date-range]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash, Write
model: haiku
---

## Phase 1: Gather Commits

`git log --oneline [range]` (default: since the last entry in `docs/CHANGELOG.md`, or last ~30 commits if none).

## Phase 2: Categorize

- **New Features** — new chapters, new visual systems, new UI
- **Improvements** — perf, polish, dependency upgrades
- **Bug Fixes** — corrections
- **Known Issues** — anything open in `docs/bugs/`

## Phase 3: Generate

```markdown
## [Version/date]
### New Features
### Improvements
### Bug Fixes
### Known Issues
```

## Phase 4: Write

Ask: "May I prepend this entry to `docs/CHANGELOG.md`?" (create the file if it doesn't exist; newest entry first).

Keep it factual and skip the internal-vs-player-facing split from a studio changelog — this is a portfolio site, one plain changelog is enough unless the user wants a public-facing tone for something they'll share.

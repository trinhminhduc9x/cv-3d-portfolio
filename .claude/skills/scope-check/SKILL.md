---
name: scope-check
description: "Analyzes a CV_3D feature/change for scope creep by comparing the original quick-spec/ADR against current state. Flags additions and recommends cuts or phasing."
argument-hint: "[feature-name or spec-file]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash
model: haiku
---

Read-only — writes no files.

## Phase 1: Find the Baseline

Look for `docs/quick-specs/[name]*.md` or `docs/architecture/adr-*[name]*.md` matching the argument. If none found, ask the user to describe the original intent instead of failing.

## Phase 2: Read Current State

Grep/glob the codebase for files related to the feature; `git log --oneline --since=[start-date]` for what actually got committed.

## Phase 3: Compare

```markdown
## Scope Check: [Name]
### Original Scope
### Current Scope
### Additions (not in original plan)
| Addition | Justified? | Effort |
### Net Scope Change: [+/-X%]
```

## Phase 4: Verdict

≤10% → PASS. 10-25% → CONCERNS. >25% → FAIL — recommend cutting or explicitly re-scoping with the user before continuing.

## Phase 5: Next Steps

CONCERNS/FAIL → suggest which additions to cut or defer, and offer to write an updated `/quick-design` reflecting the real scope.

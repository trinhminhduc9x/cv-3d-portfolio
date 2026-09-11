---
name: tech-debt
description: "Track, categorize, and prioritize technical debt in CV_3D. Scans for debt indicators, maintains docs/tech-debt-register.md, and recommends repayment order."
argument-hint: "[scan|add|prioritize|report]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion
model: sonnet
---

## Phase 1: Parse Subcommand

- `scan` — scan the codebase for debt indicators
- `add` — add an entry manually
- `prioritize` — re-prioritize the register
- `report` — summarize current debt status

No subcommand → print usage and stop.

## Phase 2A: Scan Mode

Search for: `TODO`/`FIXME`/`HACK` comments, files over 500 lines (e.g. watch `SceneRoot.jsx`), functions over 50 lines, duplicated GLB-loading or effect code outside `ModelAsset`/`EffectsPipeline`.

Categorize: Architecture Debt, Code Quality Debt, Test Debt, Documentation Debt, Dependency Debt (outdated `three`/`@react-three/*`), Performance Debt (ungated heavy effects).

Present findings, then ask: "May I write these findings to `docs/tech-debt-register.md`?" Append, never overwrite existing entries.

## Phase 2B: Add Mode

Ask for description, affected files, and impact if unfixed. Use `AskUserQuestion` for category (same six as above) and estimated effort (S/M/L/XL). Present the entry, ask before appending.

## Phase 2C: Prioritize Mode

Read the register. Score `(impact × frequency) / effort`. Re-sort, present, ask before writing back.

## Phase 2D: Report Mode

Read-only. Summarize totals by category, trend since last report, and flag items open more than ~2 months.

## Debt Register Format

```markdown
## Technical Debt Register
Last updated: [date]

| ID | Category | Description | Files | Effort | Impact | Priority | Added |
|----|----------|-------------|-------|--------|--------|----------|-------|
| TD-001 | ... | ... | ... | S/M/L/XL | Low/Med/High | [score] | [date] |
```

### Rules
- Every entry explains WHY it was accepted (deadline, unclear requirements, deliberate shortcut)
- `scan` is worth re-running after any dependency upgrade or major feature addition

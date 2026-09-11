---
name: code-review
description: "Performs an architectural and quality code review on specified CV_3D files. Checks CLAUDE.md compliance, R3F/Three.js patterns, testability, and performance concerns."
argument-hint: "[path-to-file-or-directory]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash, Task, AskUserQuestion
model: sonnet
agent: lead-programmer
---

## Phase 1: Load Target Files

Read the target file(s) in full. Read `CLAUDE.md` for project conventions and `.claude/docs/technical-preferences.md` for stack specifics.

## Phase 2: ADR Compliance Check

Search for ADR references in header comments or recent commit messages touching these files (`git log --oneline -- [file]`). Look for `ADR-NNNN` / `docs/architecture/adr-` patterns.

If none found, note it and continue — this is advisory, not blocking, for most CV_3D changes.

For each referenced ADR: read it, extract Decision/Consequences, classify deviation as **VIOLATION** (BLOCKING), **DRIFT** (WARNING), or **MINOR** (INFO).

## Phase 3: Standards Compliance (from CLAUDE.md)

- [ ] New GLB models registered in `modelRegistry.js`, rendered through `ModelAsset` (no one-off loaders)
- [ ] Model URLs resolved via `import.meta.env.BASE_URL`
- [ ] Layer behavior stays in `ModelLayer` unless genuinely unique
- [ ] Chapter/camera/lighting config lives in `src/data/*.config.js`, not hardcoded
- [ ] `aria-label="Show {Chapter} chapter"` contract preserved on `TimelineIndicator` if touched

## Phase 4: Architecture

- [ ] Correct dependency direction (life-engine/scene do not import from `ui/`)
- [ ] No circular dependencies
- [ ] Cross-system communication goes through existing hooks/callbacks, not ad hoc global state
- [ ] Consistent with the single-path `SceneRoot` architecture (no parallel scene tree)

## Phase 5: Performance & R3F-Specific Concerns

- [ ] No unbounded allocation inside `useFrame`
- [ ] New heavy visual effects gated by `performanceProfile.lowEnd`
- [ ] Three.js geometries/materials/textures disposed on unmount
- [ ] Delta-time based animation, not frame-count based

## Phase 6: Testability

- [ ] Logic changes (chapter/camera/transition math, hooks) have a corresponding Jest test in `tests/unit/`
- [ ] Visual changes are checkable via `npm run test:visual`

## Phase 7: Output

```
## Code Review: [File/System Name]

### ADR Compliance: [NO ADRS FOUND / COMPLIANT / DRIFT / VIOLATION]
### Standards Compliance: [X/N passing]
### Architecture: [CLEAN / MINOR ISSUES / VIOLATIONS FOUND]
### Performance: [CLEAN / CONCERNS FOUND]
### Testability: [COVERED / GAPS]

### Positive Observations
### Required Changes
### Suggestions

### Verdict: [APPROVED / APPROVED WITH SUGGESTIONS / CHANGES REQUIRED]
```

This skill is read-only — no files are written.

## Phase 8: Next Steps

Use `AskUserQuestion`:
- If APPROVED: "Run `npm run check` to confirm, or stop here?"
- If CHANGES REQUIRED: "Fix the issues and re-run `/code-review`, or stop here?"

If a VIOLATION is found and it contradicts an existing ADR: fix the implementation to comply, or run `/architecture-decision` to formally revise the ADR if the approach has legitimately changed.

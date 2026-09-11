---
name: onboard
description: "Generates a contextual onboarding note for a specific area of CV_3D (e.g. 'life-engine', 'effects', 'ui') — useful when picking the project back up after time away or bringing in a collaborator."
argument-hint: "[area]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write
model: haiku
---

## Phase 1: Load Context

Read `CLAUDE.md` and, if the area matches an entry in its Key Files table, read those files.

## Phase 2: Scan the Area

Glob the relevant directory (`src/life-engine/`, `src/effects/`, `src/scene/`, `src/ui/`, `src/audio/`). Check recent `git log --oneline -20 -- [dir]` for momentum.

## Phase 3: Generate

```markdown
# Onboarding: [Area]

## What This Area Does
## Key Files (from CLAUDE.md + area scan)
| File | Purpose |
## Current State
[What's built, what's mid-flight — check .coordination/ and docs/review-*.md for any open task threads]
## Conventions Specific to This Area
## Common Pitfalls
## Good First Task Here
```

## Phase 4: Save

Ask: "May I write this to `docs/onboarding/onboard-[area]-[date].md`?"

---
name: quick-design
description: "Lightweight change proposal for CV_3D — small features, tuning, or UI tweaks that don't need a full ADR. Produces a short spec before implementation and doubles as the default 'skill-first' entry point for small changes."
argument-hint: "[brief description of the change]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion
model: sonnet
---

# Quick Design

The lightweight path for changes under ~4 hours of work — tuning a chapter's lighting mood, a small UI tweak, a new small overlay component. For anything that changes core architecture, dependency choices, or the `SceneRoot` scene graph pattern, use `/architecture-decision` instead.

**Output:** `docs/quick-specs/[name]-[date].md`

## 1. Classify the Change

- **Tuning** — numeric/config change only (e.g. a `lightingMood` value, a camera preset)
- **Tweak** — small behavioral change to an existing component/hook, no new state
- **Addition** — a small new feature on an existing system (e.g. a new HUD toggle)
- **New Small Feature** — a standalone addition under ~1 week of work

If it's bigger than that (new architecture, new major dependency, cross-cutting change), stop and suggest `/architecture-decision` instead.

If no argument given, ask the user to describe the change, then classify it and confirm with `AskUserQuestion`.

## 2. Context Scan

Read `CLAUDE.md`'s Key Files table and the specific file(s) this touches. Check `docs/quick-specs/` for any prior spec on the same area to avoid contradicting it.

## 3. Draft the Spec

```markdown
# Quick Design Spec: [Title]

**Type**: [Tuning / Tweak / Addition / New Small Feature]
**Area**: [file(s)/system touched]
**Date**: [today]

## Change Summary
[1-2 sentences]

## Current Behavior
[What exists today — quote relevant code/config if useful]

## New Behavior
[Precise enough that implementation follows directly from this]

## Affected Files
| File | Change |
|------|--------|

## Acceptance Criteria
- [ ] [specific, testable]
- [ ] No regression: [what must not break]
```

## 4. Approval and Filing

Present the draft. Ask: "May I write this to `docs/quick-specs/[kebab-case-title]-[date].md`?" Create the directory if needed.

## 5. Handoff

After writing: "Spec written. Implement it directly, or hand off to `lead-programmer`/`engine-programmer`/`ui-programmer` depending on area. Run `/code-review` when done."

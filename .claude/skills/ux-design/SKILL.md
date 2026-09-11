---
name: ux-design
description: "Guided spec authoring for a CV_3D UI overlay, navigation flow, or interaction pattern. Produces a UX spec used before implementing a new overlay component."
argument-hint: "[screen/flow name]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion
model: sonnet
agent: ux-designer
---

## 1. Determine Target

If no argument, ask: "What are we designing? A specific overlay/flow (name it), or the interaction pattern library?"

Normalize to kebab-case. Output: `docs/ux/[name].md` (or `docs/ux/interaction-patterns.md` for the pattern library).

## 2. Gather Context

Read `CLAUDE.md`, the current `src/ui/*` component this relates to (or its nearest sibling if new), `src/data/lifeChapters.config.js` if chapter-relevant, and any existing `docs/ux/*.md`.

If the target file already exists, read it and only work on sections still marked `[To be designed]` — don't overwrite approved content.

## 3. Create/Update the Skeleton

Ask: "May I create/update the skeleton at `docs/ux/[name].md`?"

```markdown
# UX Spec: [Name]

> Status: In Design | Last Updated: [date]

## Purpose & Visitor Need
[To be designed]

## Entry & Exit Points
[To be designed]

## Layout & Component Inventory
[To be designed]

## States & Variants
(default / loading / empty / error, as applicable)
[To be designed]

## Interaction Map
(keyboard, mouse/wheel, and any command-palette bindings)
[To be designed]

## Accessibility
[To be designed]

## Acceptance Criteria
[To be designed]

## Open Questions
[To be designed]
```

## 4. Section-by-Section Authoring

For each section: state what it needs → ask clarifying questions → present 2-3 options with trade-offs where relevant → get the user's decision → draft it → ask "May I write this section?" → write with `Edit`.

Keep the accessibility section grounded in the project's existing patterns: `aria-label` contract on `TimelineIndicator`, keyboard nav already in `SceneRoot.jsx` (arrow keys/PageUp/PageDown), `lang` bilingual pattern.

## 5. Handoff

When complete: "This spec is ready for `/ux-review [name]` before implementation, or hand straight to `ui-programmer` if it's small."

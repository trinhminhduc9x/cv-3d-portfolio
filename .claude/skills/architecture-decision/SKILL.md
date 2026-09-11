---
name: architecture-decision
description: "Creates an Architecture Decision Record (ADR) for CV_3D documenting a significant technical decision, its context, alternatives considered, and consequences."
argument-hint: "[title]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion
model: sonnet
agent: technical-director
---

Use this for decisions with real staying power (new major dependency, a change to the `SceneRoot` architecture, a new state-management pattern) — not for routine bug fixes. For small changes use `/quick-design` instead.

## 1. No-argument guard

If no title argument was given, ask: "What technical decision are you documenting? A short title, e.g. `postprocessing-pipeline-choice`, `model-loading-strategy`."

## 2. Determine the next ADR number

Glob `docs/architecture/adr-*.md` to find the next sequential number (`adr-0001`, `adr-0002`, ...). If the directory doesn't exist, this is ADR-0001.

## 3. Gather context

Read `CLAUDE.md`, `.claude/docs/technical-preferences.md`, and any existing ADRs touching the same area (grep `docs/architecture/` for related keywords).

## 4. Guide the decision collaboratively

Derive your best-guess framing before asking anything:
- **Problem**: infer from the title + conversation context
- **Alternatives**: propose 2-3 concrete options given the React/R3F/Three.js stack
- **Dependencies**: any existing ADR this builds on or conflicts with

Present with `AskUserQuestion`:

```
Problem: [one-sentence framing]
Alternatives I'll consider:
  A) [option]
  B) [option]
  C) [option]

[A] Proceed — draft with these assumptions
[B] Change the alternatives list
[C] Something else needs changing first
```

Do not draft until confirmed.

## 5. Generate the ADR

```markdown
# ADR-[NNNN]: [Title]

## Status
Proposed

## Date
[today]

## Context
### Problem Statement
[...]
### Constraints
- [...]

## Decision
[The approach, detailed enough to implement from]

## Alternatives Considered
### Alternative 1: [Name]
- Pros / Cons / Rejection reason

## Consequences
### Positive
### Negative
### Risks

## Performance Implications
[Impact on frame time / bundle size / load time, if relevant]

## Related Decisions
[Links to related ADRs]
```

## 6. Write approval

Ask: "ADR draft is complete. May I write it to `docs/architecture/adr-[NNNN]-[slug].md`?" Create the directory if needed.

## 7. Closing

After writing, suggest: run `/code-review` on the implementation once it lands, referencing this ADR in the review.

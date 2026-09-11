---
name: reverse-document
description: "Generates an ADR or quick-spec from existing CV_3D implementation that was built without one. Works backwards from code to document intent."
argument-hint: "<architecture|design> <path>"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
model: sonnet
---

Use when a feature already exists in the codebase (e.g. the audio-reactive particle system, `DeveloperHUD`) but has no ADR/spec explaining why it's built that way.

## Phase 1: Parse Arguments

`architecture <path>` → produces an ADR. `design <path>` → produces a quick-spec.

## Phase 2: Analyze Implementation

Read the code. For architecture: identify the pattern chosen (e.g. why `TransitionOrchestrator` uses a token-invalidation scheme), dependencies, performance characteristics, constraints visible in the code. For design: identify the intended user-facing behavior, states, and edge cases already handled.

## Phase 3: Ask Clarifying Questions About Intent

Don't just describe the code — ask why. E.g. "The particle field regenerates positions past a 6-unit drift — was that for a bounded-motion look, or performance (avoiding unbounded growth)?"

## Phase 4: Present Findings

Show what was found and the unclear-intent points before drafting.

## Phase 5: Draft

Use the `/architecture-decision` ADR template or the `/quick-design` spec template as appropriate, filling in "what exists" + "why" (from the user's answers) + "what's missing."

## Phase 6: Approval

Show the draft. Ask: "May I write this to `docs/architecture/adr-[NNNN]-[slug].md`" (or `docs/quick-specs/[slug]-[date].md`)?

Mark the doc's header with `status: reverse-documented` and the source path.

## Phase 7: Follow-Up

Suggest any gaps found (missing edge case handling, a `lowEnd` gate that should exist but doesn't) as next tasks — don't auto-fix them.

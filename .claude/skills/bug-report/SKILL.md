---
name: bug-report
description: "Creates a structured bug report for CV_3D from a description, or analyzes code to identify potential bugs. Ensures reproduction steps and severity are captured."
argument-hint: "[description] | analyze [path] | verify [BUG-ID] | close [BUG-ID]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write
model: sonnet
---

## Phase 1: Parse Arguments

- No keyword → **Description Mode**
- `analyze [path]` → **Analyze Mode**
- `verify [BUG-ID]` → **Verify Mode**
- `close [BUG-ID]` → **Close Mode**

## Phase 2A: Description Mode

Parse what broke, when, reproduction, expected behavior. Search the codebase for likely affected files.

```markdown
# Bug Report
**ID**: BUG-[NNNN]  **Severity**: S1-Critical (broken nav/crash) / S2-Major (visual break) / S3-Minor / S4-Trivial
**Status**: Open  **Reported**: [date]

## Reproduction Steps
1. ...
**Expected**: ...
**Actual**: ...

## Technical Context
- Likely affected files: [...]
- Possible root cause: [...]
```

## Phase 2B: Analyze Mode

Read the target file(s). Look for null refs, off-by-one, missing dispose calls, unhandled edge cases in `useFrame`/hooks, incorrect chapter-transition token handling. Generate a bug report per finding using the template above.

## Phase 2C: Verify Mode

Read `docs/bugs/[BUG-ID].md`. Re-check whether the described code path still exists; run the related Jest test if one exists. Verdict: VERIFIED FIXED / STILL PRESENT / CANNOT VERIFY. Ask before updating status.

## Phase 2D: Close Mode

Confirm status is Verified Fixed first. Append a closure record (date, resolution, fix commit, verified by). Ask before writing.

## Phase 3: Save

Ask: "May I write this to `docs/bugs/BUG-[NNNN].md`?" Create the directory if needed.

## Phase 4: Next Steps

After filing: if S1/S2, fix promptly — this is a live public site. After a fix lands: run `verify`, then `close`.

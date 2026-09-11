---
name: ux-review
description: "Validates a CV_3D UX spec for completeness, accessibility, and implementation readiness. Produces APPROVED / NEEDS REVISION / MAJOR REVISION NEEDED."
argument-hint: "[file-path or 'all']"
user-invocable: true
allowed-tools: Read, Glob, Grep
model: sonnet
agent: ux-designer
---

## Phase 1: Parse Arguments

Specific path → review that file. `all` → review every file in `docs/ux/`. No argument → ask which.

## Phase 2: Load Context

Read the target spec, `CLAUDE.md`, and any related existing specs it should stay consistent with (shared navigation, shared component reuse).

## Phase 3: Checklist

**Completeness**
- [ ] Purpose & visitor need stated from the visitor's perspective
- [ ] Entry & exit points documented
- [ ] Layout/component inventory present
- [ ] States & variants cover at least default + error (+ loading/empty if data-dependent)
- [ ] Interaction map covers keyboard, mouse/wheel, and command palette where relevant
- [ ] Accessibility section present and consistent with the project's existing `aria-label`/keyboard-nav contracts
- [ ] At least 3 specific, testable acceptance criteria

**Quality**
- [ ] No information conveyed by color alone
- [ ] No interaction reachable only by mouse
- [ ] Doesn't contradict an existing spec's navigation/entry points
- [ ] Acceptance criteria are verifiable without reading other docs

## Phase 4: Output

```markdown
## UX Review: [Document]
### Completeness: [X/Y]
### Quality Issues: [N]
1. [Issue] [BLOCKING/ADVISORY] — where, fix
### Verdict: APPROVED / NEEDS REVISION / MAJOR REVISION NEEDED
```

Read-only skill — never edits files. For NEEDS REVISION, offer to help draft the missing pieces but wait for the user to ask.

---
name: skill-test
description: "Validates .claude/skills/*/SKILL.md files in CV_3D for structural compliance (frontmatter, phases, approval-before-write language)."
argument-hint: "[skill-name | all]"
user-invocable: true
allowed-tools: Read, Glob, Grep
model: haiku
---

Lightweight structural linter only — no behavioral spec framework (that's overkill for this project's skill set).

## Checks (per skill)

1. **Frontmatter**: `name`, `description`, `allowed-tools` present
2. **Multiple phases/sections**: at least 2 `##` headings
3. **Approval language**: if `allowed-tools` includes `Write` or `Edit`, the body contains "May I write" (or equivalent) before any write step
4. **Next-step handoff**: ends with a suggestion of what to do next

## Output

```
=== Skill Check: /[name] ===
Frontmatter:        PASS/FAIL
Multiple Phases:    PASS/FAIL
Approval Language:  PASS/FAIL/N-A (read-only skill)
Next-Step Handoff:  PASS/WARN

Verdict: COMPLIANT / WARNINGS / NON-COMPLIANT
```

For `all`, Glob `.claude/skills/*/SKILL.md` and summarize each in a table.

Run this after editing any skill file in this project.

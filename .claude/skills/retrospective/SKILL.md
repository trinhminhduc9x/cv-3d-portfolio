---
name: retrospective
description: "Generates a retrospective for a completed piece of work on CV_3D by analyzing git history, blockers, and patterns. Produces actionable insights, right-sized for a solo project."
argument-hint: "[work-item-name or date-range]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Bash, AskUserQuestion
model: sonnet
---

## 1. Load Data

Run `git log --oneline --since="[range]"` (or ask the user for the range/work item if unclear) to see what actually happened. Scan for TODO/FIXME trend vs. any prior retrospective in `docs/retrospectives/`.

If no prior retrospective exists to compare against, that's fine — this can be the first one.

## 2. Generate the Retrospective

```markdown
## Retrospective: [Work item / period]
Period: [start] – [end]

### What Shipped
- [item — commit refs]

### What Went Well
- [specific observation]

### What Went Poorly
- [specific issue, systemic cause, not blame]

### Blockers Encountered
| Blocker | Resolution | Prevention |

### Technical Debt Trend
- TODO/FIXME/HACK count: [N] (previous: [N] or "no baseline")

### Action Items for Next Time
| # | Action | Priority |
```

Keep this proportional — a solo portfolio project doesn't need velocity charts or estimation-accuracy tables unless the user asks for them.

## 3. Save

Ask: "May I write this to `docs/retrospectives/retro-[slug]-[date].md`?"

## 4. Next Steps

If action items came up, offer to turn any non-trivial one into a `/quick-design` or `/architecture-decision` before implementing it.

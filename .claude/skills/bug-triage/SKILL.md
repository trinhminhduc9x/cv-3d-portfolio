---
name: bug-triage
description: "Reads open bugs in docs/bugs/ for CV_3D, re-evaluates priority, and produces a triage report. Run when the open bug count grows enough to need re-prioritization."
argument-hint: "[full | trend]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
model: sonnet
---

## 1. Load Bug Backlog

Glob `docs/bugs/*.md`. If none found, say so and stop — nothing to triage.

## 2. Classify Each Bug

**Severity**: S1-Critical (broken nav/crash/data-loss-equivalent) / S2-High (major feature broken, site still usable) / S3-Medium (degraded, workaround exists) / S4-Low (cosmetic).

**Priority**: P1-Fix now (blocks the live site or a recent regression) / P2-Fix soon / P3-Backlog / P4-Won't fix.

Flag systemic patterns: 3+ bugs from the same file/system, or a bug against something recently marked fixed (regression).

## 3. Trend Analysis (`trend` mode or as part of `full`)

Open count, opened/closed since last triage, hot-spot file/system, aged bugs (open a long time without action).

## 4. Report

```markdown
# Bug Triage Report
**Date**: [date]  **Open bugs**: [N]

## P1 — Fix Now
| ID | System | Severity | Summary |

## P2 / P3 / P4
...

## Systemic Issues Flagged
## Trend Analysis
## Recommended Actions
```

Ask: "May I write this to `docs/bug-triage-[date].md`?"

## 5. Rules

Never close or mark Won't Fix without user approval. Severity is objective; priority is the user's call — present it as a recommendation.

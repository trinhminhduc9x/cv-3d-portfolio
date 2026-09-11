---
name: security-audit
description: "Audits CV_3D (a static, client-only React/Three.js site) for the security issues that actually apply: dependency vulnerabilities, XSS surface, secrets hygiene, and safe outbound links. Run before a public deploy after any dependency or input-handling change."
argument-hint: "[full | deps | input | quick]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash, Write
model: sonnet
agent: security-engineer
---

# Security Audit (static site scope)

CV_3D has no backend server, no user accounts, and no save data — most game-security concerns (anti-cheat, network authority, save tampering) don't apply. Scope is narrowed accordingly.

## Phase 1: Scope

- `full` — all categories (default)
- `deps` — dependency vulnerabilities only
- `input` — XSS/injection surface only
- `quick` — high-severity checks only

## Phase 2: Categories

**Dependency vulnerabilities**: run `npm audit` (read-only) and report high/critical findings, especially after any `package.json` change.

**XSS/injection surface**: grep for `dangerouslySetInnerHTML`, `eval(`, `new Function(`, and any place external/URL-derived strings reach the DOM without escaping.

**Secrets hygiene**: grep for `api_key`, `secret`, `token`, `password` in `src/` and config files; confirm `.env*` is gitignored and not committed.

**Outbound links**: check `PORTFOLIO_PROFILE` and chapter `links` in `lifeChapters.config.js` — any `target="_blank"` link should have `rel="noopener noreferrer"`.

**CI/deploy secrets**: check `.github/workflows/*.yml` for secrets echoed into logs or overly broad permissions.

## Phase 3: Report

```markdown
# Security Audit — CV_3D
**Date**: [date]  **Scope**: [full|deps|input|quick]

## Summary
| Severity | Count |
|----------|-------|

## Findings
### SEC-001: [Title]
**Category**: Dependency / XSS / Secrets / Links / CI
**File**: [path]
**Description** / **Remediation** / **Effort**
```

Ask: "May I write this to `docs/security/security-audit-[date].md`?" Write only after approval.

## Phase 4: Next Steps

If any HIGH/CRITICAL finding exists: fix before the next deploy (deploy is automatic on merge to `main` via GitHub Actions). Re-run `quick` mode after fixing to confirm.

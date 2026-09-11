---
name: perf-profile
description: "Structured performance profiling workflow for CV_3D's Three.js/R3F scene. Identifies bottlenecks against frame-time/memory/load-time budgets and ranks optimizations."
argument-hint: "[system-name or 'full']"
user-invocable: true
agent: performance-analyst
allowed-tools: Read, Glob, Grep, Bash
model: sonnet
---

## Phase 1: Determine Scope

A specific system (e.g. `ParticleField`, `EffectsPipeline`) or `full` for the whole scene.

## Phase 2: Load Budgets

Read `src/scene/performance/usePerformanceProfile.js` for the current tiered budgets (shadow map size, DPR cap, lazy-unload delay, contact shadow scale/blur) and treat `lowEnd` as the binding constraint — this site must remain usable on a mid-range phone.

## Phase 3: Analyze Codebase

**CPU (per-frame) targets**: every `useFrame` callback — look for per-frame allocation, unbounded loops (e.g. particle curl-noise), string ops, and anything not gated by `performanceProfile.lowEnd`.

**Memory targets**: geometries/materials/textures created with `new THREE.*` — verify a matching dispose in cleanup (`ModelAsset.jsx`'s pattern is the reference). Flag any component missing it.

**Rendering targets**: postprocessing pass count (`EffectsPipeline.jsx`), `MeshReflectorMaterial` resolution, GLB triangle/texture budget from `modelRegistry.js`.

**Load-time targets**: `useStrategicModelPreload.js` — is immediate vs. idle preload split correctly for the current chapter set?

## Phase 4: Report

```markdown
## Performance Profile: [System or Full]
### Budgets
| Metric | Budget | Estimated | Status |
|--------|--------|-----------|--------|

### Hotspots
| # | Location | Issue | Impact | Fix Effort |

### Optimization Recommendations (priority order)
1. [Title] — location, expected gain, risk, approach

### Quick Wins (< 1 hour)
### Requires Runtime Profiling to Confirm
```

Read-only — no files written.

## Phase 5: Next Steps

If a hotspot needs real architecture change: `/architecture-decision`. If it's a scope trade-off: discuss directly with the user, this project has no formal scope-negotiation body beyond that.

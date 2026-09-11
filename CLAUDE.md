# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build -> dist/
npm run preview      # Preview production build locally
npm run lint         # ESLint over src/ and tests/
npm run test:unit    # Jest unit tests
npm run test:visual  # Puppeteer visual regression tests
npm run check        # lint + unit tests + build
```

Visual tests require the Puppeteer Chrome binary:

```bash
npm run test:visual:install-browser
```

## Architecture

This is a React + Three.js cinematic CV/portfolio. The active production architecture is:

```text
App.jsx
  -> SceneRoot.jsx
      -> life-engine systems
      -> scene/layers/*
      -> scene/models/*
      -> effects/EffectsPipeline.jsx
      -> ui/*
```

There is no parallel `SceneCore` architecture. Keep future scene work on this path unless a migration is intentionally planned and completed in one change.

## Key Files

| File | Role |
|---|---|
| `src/App.jsx` | WebGL gate and root app shell |
| `src/scene/SceneRoot.jsx` | Three.js canvas, lighting, chapter navigation, model layers, effects, and overlays |
| `src/life-engine/ChapterManager.js` | Normalizes chapter config and owns active chapter state |
| `src/life-engine/CameraDirector.js` | R3F camera transition director |
| `src/life-engine/TransitionOrchestrator.js` | Visual-state interpolation between chapters |
| `src/life-engine/InteractionModeManager.js` | Guided/explore OrbitControls state |
| `src/data/lifeChapters.config.js` | Single source of truth for chapters, camera presets, lighting moods, and text |
| `src/scene/models/modelRegistry.js` | GLB path, scale, rotation, and preload metadata |
| `src/scene/models/ModelAsset.jsx` | Shared GLB loader/cloner/material setup |
| `src/scene/models/useStrategicModelPreload.js` | Current/next/idle model preload policy |
| `src/scene/layers/ModelLayer.jsx` | Shared model-backed layer behavior |
| `src/ui/TimelineIndicator.jsx` | Accessible chapter timeline controls |

## Model Rules

- Register new GLB models in `modelRegistry.js`.
- Render GLB files through `ModelAsset`; do not create one-off `ShipModel`/`SoftwareModel` style loaders.
- Resolve model URLs with `import.meta.env.BASE_URL` via the registry.
- Keep layer behavior in `ModelLayer` unless a layer has genuinely unique behavior.
- If model files change size materially, verify first load and mobile behavior.

## Navigation

Chapters are configured in `src/data/lifeChapters.config.js`. `SceneRoot` maps chapter labels into `TimelineIndicator`, and visual tests rely on the generated `aria-label="Show {Chapter} chapter"` contract.

## Performance Rules

- **Dispose on unmount**: every cloned material, geometry, and texture created by an R3F component must be disposed in that component's `useEffect` cleanup (see `ModelAsset.jsx` for the reference pattern).
- **Lazy layer unloading**: use `LazyLayerMount` with `lazyUnloadDelay` from `usePerformanceProfile` so inactive chapter layers release GPU memory instead of lingering.
- **Draw call reduction**: prefer instancing (`InstancedMesh`) or merged static geometry over many individual meshes.
- **Shadow & DPR budgets**: honor `shadowMapSize` and `maxDevicePixelRatio` from `usePerformanceProfile` — any new heavy visual effect (postprocessing pass, particle system, reflector material, audio-reactive analysis) must gate on `performanceProfile.lowEnd` and degrade gracefully.
- **Preload policy**: extend `useStrategicModelPreload.js` rather than adding parallel loading logic — high-end devices idle-preload remaining models, low-end/mobile devices defer non-adjacent ones.

## Deployment

- Base path: `/cv-3d-portfolio/` in `vite.config.js`.
- Target: `https://trinhminhduc9x.github.io/cv-3d-portfolio`.
- GitHub Actions run lint, unit tests, build, install Puppeteer Chrome, and visual tests.

## Skill-First Workflow

This project has a curated set of Claude Code skills and agents under `.claude/skills/` and `.claude/agents/`, adapted from a game-studio skill framework for this React/R3F/Three.js portfolio. Before making a non-trivial code change, run the skill that fits — a `PreToolUse` hook (`.claude/hooks/require-skill.sh`) will print a soft reminder (not a hard block) if no skill has run yet this session.

| Situation | Skill |
|---|---|
| Small change (tuning, tweak, small addition, under ~4h) | `/quick-design` |
| Structural/architectural change, new dependency, new pattern | `/architecture-decision` |
| Reviewing a diff before calling it done | `/code-review` |
| New/changed UI overlay or navigation flow | `/ux-design` then `/ux-review` |
| GLB/asset work, memory leak check, visual regression baseline update | `/web3d-optimization` |
| Frame-time/memory/load-time concerns | `/perf-profile` |
| Before a public deploy after a dependency or input-handling change | `/security-audit` |
| Something broke | `/bug-report` |
| Recurring/accumulating debt (TODOs, oversized files) | `/tech-debt` |
| Feature grew bigger than planned | `/scope-check` |
| Documenting an existing undocumented feature | `/reverse-document` |

See `.claude/docs/technical-preferences.md` for the pinned stack, performance budgets, and naming conventions these skills read from. Also see `GEMINI.md`, which documents the same architecture for Gemini and stays in sync with this file.

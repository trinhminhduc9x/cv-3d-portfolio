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

## Deployment

- Base path: `/cv-3d-portfolio/` in `vite.config.js`.
- Target: `https://trinhminhduc9x.github.io/cv-3d-portfolio`.
- GitHub Actions run lint, unit tests, build, install Puppeteer Chrome, and visual tests.

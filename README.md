# CV 3D Portfolio

[![CI](https://github.com/trinhminhduc9x/cv-3d-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/trinhminhduc9x/cv-3d-portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/trinhminhduc9x/cv-3d-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/trinhminhduc9x/cv-3d-portfolio/actions/workflows/deploy.yml)

Interactive cinematic 3D CV/portfolio for Trinh Minh Duc, built with React, Vite, Three.js, React Three Fiber, Drei, and React Three Postprocessing.

## Features

- Six narrative chapters: Prologue, Origin, Awakening, Transformation, Mastery, and Vision.
- Three 3D career models: Mechanical, Architecture, and Software.
- Life-engine orchestration for chapter state, camera direction, interaction mode, and animated transitions.
- Shared `ModelAsset` and `modelRegistry` for GLB loading, material cloning, model transforms, and strategic preloading.
- WebGL fallback UI for unsupported browsers.
- Low-end device profile that reduces DPR, shadow quality, and model preload eagerness.
- Lazy layer unloading to reduce GPU memory pressure after transitions.
- Accessible overlay UI with ARIA labels and keyboard timeline navigation.
- Jest unit tests and Puppeteer visual regression tests for the chapter flow.

## Architecture

```text
src/
  core/                  Narrative navigation helpers and WebGL support
  data/                  Life chapter narrative config
  effects/               Postprocessing and scene mood pipeline
  life-engine/           Chapter, camera, interaction, and transition systems
  scene/
    layers/              Production model-backed scene layers
    models/              ModelAsset, modelRegistry, and preload strategy
    performance/         Device profile and lazy layer mounting
    SceneRoot.jsx        Production scene composition
  ui/                    Overlay panels, loading, timeline, fallback UI
```

The production path is intentionally single-track:

```text
App.jsx
  -> SceneRoot.jsx
      -> life-engine systems
      -> scene/layers/*
      -> scene/models/*
      -> effects/EffectsPipeline.jsx
      -> ui/*
```

`SceneRoot` owns the cinematic composition. `life-engine` owns stateful animation and camera orchestration. `scene/models` owns GLB loading and preload policy. Incomplete alternate scene-core/camera/layer implementations have been removed to keep the architecture unambiguous.

## Model Loading

Models are registered in `src/scene/models/modelRegistry.js` and rendered through `ModelAsset`.

- The current chapter model and next chapter model are preloaded immediately.
- High-end devices preload the remaining registered models during idle time.
- Low-end/mobile devices defer non-adjacent models to avoid unnecessary initial network and memory pressure.
- GLB scene instances are cloned per mount and cloned materials are disposed on unmount.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run test:unit    # Jest unit tests
npm run test:visual  # Puppeteer screenshot tests
npm run docs         # Generate markdown API docs with TypeDoc
npm run check        # lint + unit tests + build
```

## Visual Tests

Visual tests write screenshots to `test-results/visual`. They cover all current narrative chapters. If a baseline exists in `tests/visual/__baselines__`, the test compares pixels with a small tolerance. To create or update baselines:

```bash
UPDATE_VISUAL_BASELINES=1 npm run test:visual
```

Install the Puppeteer browser before running visual tests locally:

```bash
npm run test:visual:install-browser
```

## Deployment

The Vite base path is configured as `/cv-3d-portfolio/` for GitHub Pages. All public model paths are resolved through `import.meta.env.BASE_URL`. CI runs lint, unit tests, build, and visual checks before deployment.

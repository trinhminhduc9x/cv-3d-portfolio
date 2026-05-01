# CV 3D Portfolio

[![CI](https://github.com/trinhminhduc9x/cv-3d-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/trinhminhduc9x/cv-3d-portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/trinhminhduc9x/cv-3d-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/trinhminhduc9x/cv-3d-portfolio/actions/workflows/deploy.yml)

Interactive 3D CV/portfolio for Trinh Minh Duc, built with React, Vite, Three.js, React Three Fiber, and Drei.

## Features

- Three narrative career layers: Mechanical, Architecture, and Software.
- Smooth camera transitions between 3D stages.
- Engine folders for camera, core scene, layers, visualization modules, and performance.
- Geometry demo modules for BVH, raycast, wireframe, AABB bounds, and collision highlighting.
- WebGL fallback UI for unsupported browsers.
- Low-end device profile that reduces DPR and shadow-map resolution.
- FPS and renderer stats overlay in development.
- Lazy layer unloading to reduce GPU memory pressure.
- Accessible overlay UI with ARIA labels and keyboard timeline navigation.
- Jest unit tests and Puppeteer screenshot tests.

## Architecture

```text
src/
  core/                  Narrative and WebGL support utilities
  data/                  CV and timeline content
  scene/
    camera/              Camera presets, controller, smooth camera hook
    core/                Canvas, lighting, environment, render config
    layers/              Narrative stage layers
    modules/             Debug/visualization modules
    performance/         FPS stats, device profile, lazy layer mounting
  ui/                    Overlay panels, loading, timeline, fallback UI
```

The current production entry still uses `src/scene/SceneRoot.jsx`, while the engine modules are ready for progressive migration through `src/scene/core/SceneCore.jsx`.

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

Visual tests write screenshots to `test-results/visual`. If a baseline exists in `tests/visual/__baselines__`, the test compares pixels with a small tolerance. To create or update baselines:

```bash
UPDATE_VISUAL_BASELINES=1 npm run test:visual
```

## Deployment

The Vite base path is configured as `/cv-3d-portfolio/` for GitHub Pages. CI runs lint, unit tests, build, and visual checks before deployment.

# Web 3D Portfolio Workspace Guidelines & Rules

This project is an interactive cinematic 3D CV/portfolio built with React, Three.js, React Three Fiber (R3F), Drei, and Postprocessing.

## Core Rules & Architectural Guidelines

### 1. 3D Model Asset Management
- **Model Registration**: Register all GLB models in `src/scene/models/modelRegistry.js`.
- **Unified Loading**: Render all GLB models through `src/scene/models/ModelAsset.jsx`. Never create standalone or one-off model loaders.
- **Path Resolution**: Resolve all model URLs using `import.meta.env.BASE_URL` via `modelRegistry.js`.
- **Preloading Policy**: Maintain device-aware preloading via `useStrategicModelPreload.js`. High-end devices preload all models during idle time; low-end/mobile devices defer non-adjacent models.

### 2. Memory & Performance Management
- **Material & Geometry Cleanup**: Dispose of all cloned materials, geometries, and textures when R3F components unmount.
- **Lazy Layer Unloading**: Use `LazyLayerMount` with `lazyUnloadDelay` from `usePerformanceProfile` to avoid lingering GPU memory pressure after transitions.
- **Draw Call Reduction**: Use instancing (`InstancedMesh`) or merge static geometries when rendering multiple identical objects.
- **Shadow & DPR Optimization**: Honor `shadowMapSize` and `maxDevicePixelRatio` from `usePerformanceProfile`.

### 3. State & Narrative Navigation
- **Single Source of Truth**: Keep chapter configurations, camera presets, lighting moods, and text in `src/data/lifeChapters.config.js` (or `narrative.config.js`).
- **Single Path Architecture**: Always composition scenes in `src/scene/SceneRoot.jsx`. Do not introduce parallel canvas components.
- **Accessibility Contracts**: Preserve ARIA attributes (`aria-label="Show {Chapter} chapter"`) on timeline navigation elements for visual regression testing.

### 4. Testing & Verification
- **Unit Tests**: Run `npm run test:unit` after modifying core logic or hooks.
- **Visual Tests**: Run `npm run test:visual` to ensure camera presets and lighting moods render correctly without pixel regressions.
- **Pre-commit Check**: Always run `npm run check` (lint + unit test + build) before concluding work.

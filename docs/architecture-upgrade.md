# Current Architecture

This project now uses one production architecture centered on `SceneRoot` and the life-engine modules. The older experimental scene-core/camera/layer split has been removed to avoid two competing render paths.

## Goals

- Keep the cinematic CV experience stable and easy to extend.
- Keep chapter config, transition logic, model loading, scene composition, and overlay UI in separate ownership areas.
- Allow a new chapter or model to be added by changing data and registry entries first, not by duplicating loader components.
- Keep model loading predictable on both high-end and low-end devices.

## Production Flow

```text
App.jsx
  -> SceneRoot.jsx
      -> life-engine/ChapterManager
      -> life-engine/TransitionOrchestrator
      -> life-engine/CameraDirector
      -> life-engine/InteractionModeManager
      -> scene/layers/MechanicalLayer
      -> scene/layers/ArchitectureLayer
      -> scene/layers/SoftwareLayer
      -> scene/models/ModelAsset
      -> effects/EffectsPipeline
      -> ui/*
```

## Ownership

```text
data/
  Chapter ids, labels, scene ids, camera presets, lighting moods, and text.

life-engine/
  Runtime chapter state, camera movement, transition interpolation, and interaction mode.

scene/models/
  GLB registry, URL resolution, preloading, scene cloning, material setup, and material disposal.

scene/layers/
  Model-backed career layers and shared layer behavior.

scene/performance/
  Device profile and lazy layer mounting.

ui/
  Header, timeline, captions, loading screen, scroll hint, fade overlay, and fallback UI.
```

## Model Loading Strategy

`modelRegistry.js` is the source of truth for GLB paths and transforms. `ModelAsset` loads the registered model, clones the cached GLB scene for the current mount, clones materials so visual state can mutate them safely, and disposes cloned materials on unmount.

`useStrategicModelPreload` keeps the loading policy explicit:

- Preload the current chapter model and next chapter model immediately.
- On high-end devices, preload the remaining registered models during idle time.
- On low-end/mobile devices, avoid eager preloading of non-adjacent models.

## Adding A Model-backed Chapter

1. Add or update the chapter in `src/data/lifeChapters.config.js`.
2. Add the model metadata to `src/scene/models/modelRegistry.js`.
3. Add a layer component only if the shared `ModelLayer` behavior is not enough.
4. Update visual baselines if the rendered chapter changes.

## Testing

Run:

```bash
npm run lint
npm run test:unit
npm run build
```

For visual coverage:

```bash
npm run test:visual:install-browser
npm run test:visual
```

Visual tests target chapter controls by `aria-label="Show {Chapter} chapter"`, so update tests when chapter labels change.

## Performance Notes

- Public GLB files should be optimized before commit.
- Avoid module-level `useGLTF.preload` calls; use the centralized preload policy.
- Keep low-end profiles conservative with DPR, shadows, and preload eagerness.
- Verify first load, chapter transition smoothness, and GitHub Pages asset paths after model changes.

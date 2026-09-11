# Technical Preferences — CV_3D

Reference doc read by `/code-review`, `/architecture-decision`, `/perf-profile`, and other skills so they don't need to ask every time.

## Stack

| Field | Value |
|---|---|
| **Runtime** | Browser (client-only, static site — no backend server) |
| **Framework** | React 19 |
| **3D Engine** | Three.js 0.170 via `@react-three/fiber` 9 + `@react-three/drei` 10 + `@react-three/postprocessing` 3 |
| **Language** | JavaScript (ESM), JSX |
| **Build Tool** | Vite 5 |
| **Package Manager** | npm |
| **Test — Unit** | Jest (`tests/unit/`) |
| **Test — Visual Regression** | Puppeteer (`tests/visual/` or equivalent — see `npm run test:visual`) |
| **Lint** | ESLint (`.eslintrc.cjs`) over `src/` and `tests/` |
| **CI/CD** | GitHub Actions (`.github/workflows/ci.yml`, `.github/workflows/deploy.yml`) |
| **Deploy Target** | GitHub Pages — `https://trinhminhduc9x.github.io/cv-3d-portfolio`, base path `/cv-3d-portfolio/` |

## Architecture

Single-path scene architecture (see root `CLAUDE.md`):
`App.jsx -> SceneRoot.jsx -> life-engine systems -> scene/layers -> scene/models -> effects/EffectsPipeline -> ui`

No parallel scene architecture (`SceneCore` or similar) without an explicit, completed migration.

## Performance Budgets

Driven by `src/scene/performance/usePerformanceProfile.js`'s two-tier system (`lowEnd` vs. default), based on device cores/memory/save-data/viewport width:

| Metric | Low-end tier | Default tier |
|---|---|---|
| Shadow map size | 1024 | 2048 |
| Max device pixel ratio | 1.25 | 1.75 |
| Contact shadow scale/blur | 9 / 1 | 15 / 2 |
| Lazy-unload delay | 300ms | 1400ms |

Any new heavy visual feature (postprocessing pass, particle system, reflector material, audio analysis) must check `performanceProfile.lowEnd` and degrade gracefully.

## Naming Conventions

- Model registry entries in `src/scene/models/modelRegistry.js`: kebab-case `id` matching the model's role (e.g. `mechanical-hull`)
- Chapter config in `src/data/lifeChapters.config.js`: `id` in `CHAPTER_SEQUENCE`, camelCase fields
- Components: PascalCase `.jsx`, one component per file matching filename

## Accessibility Contract

`aria-label="Show {Chapter} chapter"` on `TimelineIndicator` items — visual tests depend on this exact string. Do not change without updating the tests.

## Input & Platform

- Primary input: mouse wheel + keyboard (arrow keys/PageUp/PageDown) for chapter navigation, mouse drag for `OrbitControls` in explore mode
- Touch: not explicitly hardened yet — treat as a known gap, not a supported target, unless the user says otherwise
- Bilingual: `vi` (default) / `en` toggle already implemented in `TextRevealSystem`/`HeaderStatement` — follow this pattern for new bilingual content

## Engine Specialists (skill routing)

No engine-specific specialist agents are configured (this isn't Godot/Unity/Unreal). Route implementation work by area instead:
- Rendering/life-engine/scene graph → `engine-programmer`
- Shaders/postprocessing/VFX → `technical-artist`
- DOM overlay UI → `ui-programmer`
- Build/CI/deploy → `devops-engineer`

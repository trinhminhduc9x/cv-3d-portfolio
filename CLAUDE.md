# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (Vite HMR)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run deploy     # Deploy to GitHub Pages (gh-pages -d dist)
```

No test or lint scripts are configured. ESLint is available via `npx eslint src/`.

## Architecture

A React + Three.js 3D interactive CV/portfolio. Users scroll through three career stages — each rendered as a separate 3D scene layer with a React UI panel overlay.

### Layer System

Three career layers are positioned at fixed x-offsets in the same Three.js scene:
- **x=0** — Mechanical (ShipModel)
- **x=5** — Architecture (ArchitectureModel)
- **x=10** — Software (SoftwareModel)

The active layer index (0–2) drives camera animation, layer scale, lighting changes, and which CV data is displayed. State lives in `App.jsx` as `useState`, passed down to `SceneRoot` and the UI panels.

### Key Files

| File | Role |
|---|---|
| [src/App.jsx](src/App.jsx) | Root: holds `activeIndex` state, wires scene + UI |
| [src/scene/SceneRoot.jsx](src/scene/SceneRoot.jsx) | Three.js `<Canvas>`, all three layer groups, camera rig, OrbitControls |
| [src/core/useCameraController.js](src/core/useCameraController.js) | Animates camera to per-layer positions defined in `cameraState.js` |
| [src/core/useTimelineScroll.js](src/core/useTimelineScroll.js) | Wheel event → timeline index change (800 ms debounce) |
| [src/core/cameraState.js](src/core/cameraState.js) | Camera position/lookAt constants for each layer |
| [src/data/timeline.js](src/data/timeline.js) | Array of 3 timeline entries (id, label, etc.) |
| [src/data/cvData.js](src/data/cvData.js) | `CV_SECTIONS` object — all CV content keyed by layer |
| [src/ui/NarrativePanel.jsx](src/ui/NarrativePanel.jsx) | Fixed bottom-left overlay showing active layer's CV content |
| [src/ui/HeaderStatement.jsx](src/ui/HeaderStatement.jsx) | Fixed top-right overlay with name, contact, download button |

### Deployment

- **Base path:** `/cv-3d-portfolio/` (set in [vite.config.js](vite.config.js)) — all asset and GLB paths must use `import.meta.env.BASE_URL` as a prefix.
- **Target:** `https://trinhminhduc9x.github.io/cv-3d-portfolio`
- Deploy runs `gh-pages -d dist` which pushes the `dist/` folder to the `gh-pages` branch.

### Styling

All UI component styles are inline (`style={{}}`). No CSS modules or styled-components. Global resets are in [src/index.css](src/index.css).

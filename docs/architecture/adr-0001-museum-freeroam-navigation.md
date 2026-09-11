# ADR-0001: Museum Free-Roam Navigation Mode

## Status
Proposed

## Date
2026-09-11

## Context

### Problem Statement
The portfolio currently presents career milestones as a linear sequence of chapters (`prologue → origin → awakening → transformation → mastery → vision`), navigated by a scripted `guided` camera (`CameraDirector`) or an `explore` mode where `OrbitControls` orbits a single fixed target. The user wants the CV reframed as a **museum**: visitors should be able to walk freely through a continuous 3D space and approach each career milestone as a physical exhibit, rather than being carried through a fixed tour.

This is more tractable than a from-scratch spatial redesign because `SceneRoot.jsx` already places chapter content in a **hub & spokes world layout**:
- `mechanical` (Origin) sits at the hub, `[0, 0, 0]`
- `architecture` (Awakening) sits at `ARCHITECTURE_ZONE_POSITION = [-9, 0, -15.588]`
- `software` (Transformation/Mastery/Vision) sits at `SOFTWARE_ZONE_POSITION = [9, 0, -15.588]`

All three zones already coexist in one Three.js scene graph; the guided camera simply flies a scripted path between them. A free-roam mode is therefore primarily a **new way to drive the camera through space that already exists**, not a new spatial architecture.

### Constraints
- Must not remove or change behavior of existing `guided`/`explore` modes — free-roam is additive, opt-in.
- Must not change the `aria-label="Show {Chapter} chapter"` contract on `TimelineIndicator` (visual tests depend on the exact string).
- Must respect `usePerformanceProfile`'s low-end/default budgets; any new heavy behavior must degrade gracefully on `performanceProfile.lowEnd`.
- Per `technical-preferences.md`, touch input is an accepted, known gap — not a blocking requirement for v1.
- Single-path scene architecture (`App.jsx → SceneRoot.jsx → life-engine → scene/layers → scene/models → effects → ui`) must be preserved; no parallel scene architecture.

## Decision

Add a third interaction mode, `freeroam`, alongside `guided`/`explore`, implemented as a new life-engine module that drives the camera via pointer-lock + WASD instead of a script or an orbit target.

### 1. `InteractionModeManager` — add `freeroam` mode
Extend `INTERACTION_MODES` to `{ guided, explore, freeroam }`. `freeroam` disables `OrbitControls` (same as `guided`) but, unlike `guided`, hands camera ownership to the new `FreeRoamController` instead of `CameraDirector`'s scripted transitions.

### 2. New module: `src/life-engine/FreeRoamController.js`
Mirrors the existing `CameraDirector` pattern (mutable state in a ref, updated via `useFrame`):
- Uses drei's `PointerLockControls` for mouse-look (desktop-first, per the recommended option).
- WASD (+ arrow keys) integrate a horizontal velocity vector; camera Y is held at a fixed eye height (no jump/gravity — a walking, not flying, museum visitor).
- Basic AABB collision: each museum zone gets an `exhibitBounds` entry (center + radius, derived from `modelRegistry` scale) that blocks the player from walking through the model, not full navmesh.
- A `MUSEUM_BOUNDS` rectangle (min/max x/z, sized to comfortably contain the hub-and-spokes layout) clamps player position so visitors can't walk into the void.
- When `CameraDirector` is not driving the camera (i.e. mode is `freeroam`), it must no-op its own per-frame transform writes to avoid two systems fighting over `camera.position` in the same frame — gate its `update()` body on `mode !== 'freeroam'`.

### 3. Extract shared zone-position config
`ARCHITECTURE_ZONE_POSITION` / `SOFTWARE_ZONE_POSITION` currently live as local consts in `SceneRoot.jsx`. Extract them (plus the hub origin) into a new `src/data/museumLayout.config.js` exporting a `MUSEUM_ZONES` map (`{ mechanical, architecture, software }` → world position + exhibit radius). Both `SceneRoot.jsx` and `FreeRoamController.js` import from this single source of truth.

### 4. `TimelineIndicator` stays the accessibility/teleport path
Clicking a chapter item while in `freeroam` mode calls `CameraDirector.applyPreset(chapter.cameraPreset)` and snaps the `FreeRoamController`'s internal position/yaw to match, rather than requiring the visitor to walk. This keeps keyboard-only and touch visitors fully functional without ever needing free-roam, and the `aria-label` contract is untouched.

### 5. Proximity-triggered "exhibit plaques"
While in `freeroam`, entering a zone's trigger radius sets that chapter "active" for `ChapterManager` and reveals its `textSequence` via the existing `TextRevealSystem`/`HeaderStatement` components — reused as a proximity-triggered plaque instead of a navigation-triggered narrative beat. `ChapterManager`'s public contract (`activeChapter`) is unchanged; free-roam just becomes a second input source for "what's active," alongside explicit navigation.

### 6. Performance: suspend lazy-unload while free-roaming
`LazyLayerMount`'s lazy-unload assumes one active chapter at a time. Free-roam breaks that assumption — a visitor can walk past all three zones in one session. Decision: while `freeroam` is active, all three model layers stay mounted (lazy-unload suspended for the session); this only engages when a visitor explicitly opts into free-roam, so default guided/explore GPU budgets are unaffected. Mobile/low-end devices are simply not offered the free-roam entry point in v1 (see below), so this added baseline cost only applies where the device already showed willingness/capability to run the default tier.

### 7. Scope: desktop-first, no mobile free-roam in v1
`PointerLockControls` requires mouse capture and is not a good fit for touch. Free-roam is offered only where `pointer: fine` / non-touch is detected; touch/mobile visitors keep `guided`/`explore` + `TimelineIndicator` navigation, unchanged from today. This matches the project's already-accepted touch gap rather than opening a second one (custom joystick input) in the same change.

## Alternatives Considered

### Alternative A: PointerLockControls + WASD, desktop-first — **chosen**
- **Pros**: Small, well-understood surface (drei ships `PointerLockControls`); reuses the existing hub-and-spokes world instead of redesigning it; `TimelineIndicator` remains the a11y/mobile path with no behavior change; additive to `CameraDirector`/`InteractionModeManager` rather than replacing them.
- **Cons**: No mobile free-roam in v1 (explicit scope cut, not a blocker per current touch-gap posture).

### Alternative B: Custom drag-to-look + WASD, cross-platform
- **Pros**: Works on mobile via a virtual joystick from day one.
- **Cons**: Significantly more custom input code to design, build, and test (drag-to-look math, joystick UI, touch/mouse unification); no existing pattern in the codebase to build on. Rejected for v1 as disproportionate effort versus the desktop-first cut; can be revisited as a follow-up ADR if mobile free-roam becomes a priority.

### Alternative C: Extend `explore` mode into a "fly camera" (WASD moves the `OrbitControls` target)
- **Pros**: Least architectural change — reuses `OrbitControls` entirely, no new life-engine module.
- **Cons**: Camera still orbits a target rather than being carried by the visitor; weakest "walking through a museum" feel, which is the core of the request. Rejected because it doesn't actually deliver the free-roam experience the user asked for.

## Consequences

### Positive
- Guided and explore visitors see zero behavior change — free-roam is a strictly additive mode.
- Reuses ~90% of existing infrastructure: hub-and-spokes positions, lighting moods, `TextRevealSystem`, `TimelineIndicator`, `ChapterManager`.
- `TimelineIndicator`'s accessibility contract and visual-test dependency are untouched.

### Negative
- Adds a third mode to the manual/visual test matrix (`guided` / `explore` / `freeroam`).
- No mobile free-roam in v1 — museum concept is desktop-only until a follow-up ADR addresses touch input.
- All three model layers stay resident in GPU memory for the duration of a free-roam session (accepted tradeoff, opt-in only).

### Risks
- `PointerLockControls` has known cross-browser quirks (Safari prompts, Firefox focus edge cases) — needs manual verification per `qa-lead`/`qa-tester` before shipping.
- AABB collision is coarse, not a real navmesh — acceptable given only three zones, but revisit if the museum grows more exhibits.
- Visitors can get disoriented in free space with no scripted narrative pacing — mitigated by always-available `TimelineIndicator` teleport and proximity plaques giving orientation cues.

## Performance Implications
- Free-roam forces all three model layers mounted simultaneously (suspends `LazyLayerMount` lazy-unload) — higher sustained GPU memory than guided/explore, opt-in only.
- No new postprocessing passes or particle systems; `PointerLockControls` and WASD integration are CPU-side, negligible frame-time cost.
- Must still honor `performanceProfile.lowEnd` (`shadowMapSize`, `maxDevicePixelRatio`) inside free-roam — no separate performance tier is introduced.

## Related Decisions
None — this is ADR-0001, the first recorded architectural decision for this project.

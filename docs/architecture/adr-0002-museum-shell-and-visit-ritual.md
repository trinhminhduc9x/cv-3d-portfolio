# ADR-0002: Museum Environment Shell, Walking-Camera Feel & Visit Ritual

## Status
Proposed

## Date
2026-09-11

## Context

### Problem Statement
ADR-0001 shipped free-roam navigation (WASD + pointer-lock) through the existing
hub-and-spokes world, plus museum plaques per exhibit. After trying it, the visitor
experience still doesn't read as "touring a museum": the space is an open void with
three models floating in it rather than a building; movement is instant-velocity and
instant-look rather than a body walking; and there's no beginning or end to the
visit — the visitor just starts mid-air in free-roam and wanders indefinitely. This
ADR closes that gap with three coordinated changes.

### Constraints
- Must stay backward-compatible with ADR-0001: `InteractionModeManager`,
  `CameraDirector`'s `active` gate, `FreeRoamController`, `MuseumPlaque`, and the
  `TimelineIndicator` `aria-label="Show {Chapter} chapter"` contract are all
  unchanged in their public shape.
- No new GLB assets — this project's `Model Rules` require GLBs to go through
  `modelRegistry.js`/`ModelAsset`, but there's no museum-interior asset available or
  in scope to author here. The shell must be procedural Three.js geometry.
- Must not alter guided/explore mode's visual identity — the cinematic per-chapter
  fog/vignette/lighting transitions are load-bearing for that experience and
  shouldn't fight a static room shell.
- Must keep respecting `performanceProfile.lowEnd` (shadow size, DPR, lazy-unload)
  from `technical-preferences.md`.
- Free-roam remains desktop-only (`supportsFreeRoam()`, ADR-0001) — nothing here
  reopens the mobile gap.

## Decision

### 1. Museum environment shell — freeroam-only, procedural
New `src/scene/MuseumShell.jsx`, mounted in `SceneRoot.jsx` only while
`interaction.mode === 'freeroam'` (mirrors how `FreeRoamController` is
conditionally active) — guided/explore keep their current unenclosed look
untouched.
- **Geometry**: four walls + a ceiling as plain `BoxGeometry`/`PlaneGeometry`
  sized from `MUSEUM_BOUNDS` (`museumLayout.config.js`) with a small margin, plus a
  fixed ceiling height (~14 units, comfortably above `EYE_HEIGHT = 4.5` and the
  tallest exhibit). The floor is the existing `MeshReflectorMaterial`/fallback plane
  in `SceneRoot.jsx` — unchanged.
- **Material**: a single neutral dark tone (not per-chapter `lightingMood`-reactive)
  so the building itself reads as stable architecture while the exhibits keep
  transitioning dramatically inside it — walls transitioning color with every
  chapter would undercut the "real building" read this ADR is trying to create.
  `meshStandardMaterial`, low roughness variation, no reflective/emissive walls (kept
  off `performanceProfile.lowEnd`'s existing shadow/reflection budget).
- **Suggested floor path**: a thin decorative strip (flattened geometry with a
  gradient/emissive material) connecting the three `MUSEUM_ZONES` centers, `raycast`
  disabled (`raycast={() => null}`) so it never affects `FreeRoamController`
  collision — purely visual, not a rail the visitor is forced onto.
- **Performance**: a handful of static quads, negligible triangle/draw-call cost;
  no new dynamic lights.

### 2. Walking-camera feel — `FreeRoamController.jsx`
- **Acceleration/deceleration**: replace the current instant-velocity WASD
  (`move.normalize().multiplyScalar(WALK_SPEED*delta)` applied directly to
  position) with a persisted `velocityRef` that exponentially damps toward the
  keyboard-driven target velocity each frame:
  `velocityRef.current.lerp(targetVelocity, 1 - Math.exp(-ACCEL_RATE * delta))` —
  frame-rate independent, same damping idiom already used for `mouseOffset` in
  `CameraDirector.js`. One constant covers both accelerating and decelerating to
  zero (target velocity is just zero when no movement keys are held).
- **Head-bob**: accumulate distance walked (`velocity.length() * delta`, only while
  grounded/moving) and add
  `Math.sin(distanceWalked * BOB_FREQUENCY) * BOB_AMPLITUDE * speedFactor` to
  `EYE_HEIGHT` each frame, where `speedFactor = |velocity| / WALK_SPEED` fades the
  bob to zero at a standstill (no idle jitter). Small amplitude (~0.06–0.08 units),
  frequency tuned by playtest.
- **Custom pointer-lock + smoothed mouse-look**: drei's `<PointerLockControls>`
  applies mouse movement to the camera instantly with no smoothing hook — replace it
  with our own Pointer Lock API handling (same browser API, no drei wrapper):
  - `domElement.requestPointerLock()` fired from our own click handler on
    `#museum-lock-prompt` (previously drei's internal `selector` listener did this).
  - `document.addEventListener('pointerlockchange', ...)` replaces `onLock`/
    `onUnlock` — same event drei used internally via three-stdlib, just handled
    directly, so this isn't a capability regression.
  - `mousemove` accumulates a **target** yaw/pitch (pitch clamped ±~89°, matching
    three-stdlib's own default clamp); a separate **displayed** yaw/pitch lerps
    toward the target every `useFrame` tick with the same exponential-damp idiom as
    the movement velocity; `camera.quaternion.setFromEuler(new THREE.Euler(pitch,
    yaw, 0, 'YXZ'))` applied from the displayed values — identical Euler order to
    three-stdlib's implementation, just with a smoothing stage inserted before it
    reaches the camera.
  - `syncPosition` (ADR-0001 §6, used by TimelineIndicator teleport-while-freeroaming)
    sets both target *and* displayed yaw directly (no lerp) so a teleport snaps
    instantly rather than smoothly drifting into place.
  - Net effect: `@react-three/drei`'s `PointerLockControls` import is dropped from
    this file; pointer-lock becomes hand-rolled alongside the already-hand-rolled
    WASD handling, for one consistent input-handling style in this module.

### 3. Visit ritual
- **Welcome screen**: new `src/ui/MuseumWelcome.jsx`. Clicking the "Museum" button
  in `LifeModeControls` no longer calls `interaction.freeroamMode()` directly — it
  shows `MuseumWelcome` (short bilingual intro + "Enter" button, same overlay
  language as `LoadingScreen`/the lock prompt). Only clicking "Enter" calls
  `interaction.freeroamMode()`. Establishes the "stepping into a museum" framing
  before free-roam starts.
- **Exit hall / CTA**: `SceneRoot` tracks visited zones in a `Set` (accumulated from
  `FreeRoamController`'s `onZoneChange`, entries persist once visited even after
  leaving). Once all three zone ids have been visited, a non-modal
  `MuseumExitPrompt` banner appears (small, dismissible, not blocking further
  exploration — real museums don't eject you either) offering "Download Full CV" /
  contact CTAs sourced from the already-existing `PORTFOLIO_PROFILE` in
  `lifeChapters.config.js` (`cvDownloadUrl`, `profileUrl`) — no new data needed.
- **Suggested path**: the decorative floor strip from §1 — visual only, zero
  collision/gameplay impact, never mandatory.

## Alternatives Considered

### Environment shell: GLB museum-interior asset vs. procedural geometry — **procedural chosen**
No such asset exists and authoring one is outside this session's scope (no 3D
modeling pipeline available); procedural walls/ceiling are cheap, controllable, and
consistent with the codebase's existing procedural floor/`CinematicGrid` patterns.

### Mouse-look: keep drei's `PointerLockControls` (no smoothing) vs. hand-rolled + smoothing — **hand-rolled chosen**
Confirmed with the user directly: drei's component doesn't expose a smoothing hook,
and duplicating its rotation logic just to intercept it would be more convoluted
than replacing it outright with the same browser API we already call for pointer
lock's request/lock/unlock semantics.

### Exit ritual: hard modal takeover vs. non-modal persistent banner — **non-modal chosen**
A hard takeover after the third zone would interrupt a visitor who's still reading
that exhibit's plaque. A small persistent banner respects the museum metaphor
(you're never forced out) while still surfacing the CTA once earned.

## Consequences

### Positive
- All three changes are additive and freeroam-scoped — guided/explore visual
  identity and behavior are completely untouched.
- Reuses established codebase idioms throughout: exponential damping (already used
  in `CameraDirector`), bilingual overlay pattern (`TextRevealSystem`/
  `HeaderStatement`), and existing `PORTFOLIO_PROFILE` data for CTAs — no new content
  pipeline needed.
- Consistent input-handling style in `FreeRoamController.jsx` once pointer-lock is
  hand-rolled alongside the already-hand-rolled WASD.

### Negative
- Drops the `@react-three/drei` `PointerLockControls` dependency for this feature in
  favor of ~30 more lines of hand-rolled pointer-lock/rotation code to maintain.
- One extra click (the welcome screen's "Enter") before free-roam starts — minor,
  intentional friction in service of the "visit" framing.

### Risks
- Hand-rolled pointer-lock must correctly handle the browser's own Escape-driven
  auto-unlock via `pointerlockchange` — same event three-stdlib used internally, so
  this is a like-for-like reimplementation, not new risk surface, but needs explicit
  manual testing (Escape mid-walk should leave the app in a sane state, per
  ADR-0001's existing verification checklist).
- Tuning risk on head-bob amplitude/frequency and accel/decel rate — first-pass
  constants, expect a playtest pass to adjust feel.

## Performance Implications
- Shell geometry: a handful of static quads (walls, ceiling, floor path strip) —
  negligible triangle/draw-call cost, no new dynamic lights, no reflective wall
  material.
- Head-bob/velocity-damping/look-smoothing: CPU-side vector math only, no new draw
  calls or GPU cost.
- Welcome/exit overlays: plain DOM, same cost class as existing `LoadingScreen`/
  `TextRevealSystem` overlays.
- Everything here is freeroam-scoped (already gated to desktop via
  `supportsFreeRoam()`), so it adds zero cost to the default guided/explore path
  most visitors use.

## Related Decisions
Builds directly on [ADR-0001](./adr-0001-museum-freeroam-navigation.md) (museum
free-roam navigation) — extends `FreeRoamController`, keeps its
`InteractionModeManager`/`CameraDirector` contracts unchanged.

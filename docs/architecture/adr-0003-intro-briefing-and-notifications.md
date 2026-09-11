# ADR-0003: Intro Briefing Gate & Site-Wide Notification System

## Status
Proposed

## Date
2026-09-11

## Context

### Problem Statement
Researching `Claude-Code-Game-Studios` (a game-studio Claude Code framework this
project's `.claude/skills` were partly adapted from) surfaced a concrete, reusable
pattern for making the portfolio's first few seconds feel like a game launching
rather than a webpage loading: a blocking "first contact" screen that frames the
visit as a mission and lets the visitor choose how to experience it, plus a
lightweight notification system for the small game-like feedback moments (first
discovery, milestone completion) that don't warrant a full-screen interruption.
Right now `LoadingScreen` fades out straight into the guided tour with no such
moment, and `MuseumWelcome` (ADR-0002) only appears if a visitor happens to
discover the "Museum" button — most visitors never see it.

### Constraints
- Must not change `LoadingScreen.jsx`'s own behavior/timing — it keeps doing what it
  does; the new gate is strictly *after* it, driven by an independent `useProgress()`
  read (drei's loading-manager hook is safe to call from multiple places).
- Must not alter the `TimelineIndicator` `aria-label` contract or break existing
  visual tests.
- Returning visitors must not see the intro gate again — first-visit-only, via
  `localStorage` (this is a static client-only site per `technical-preferences.md`,
  no backend to track visits).
- Free-roam remains desktop-only (`supportsFreeRoam()`) — the intro's "Museum Walk"
  path option only appears where that's already true; nothing here reopens the
  mobile gap.
- Keep the notification system's first real usage concrete and small — ship it wired
  to 2-3 genuine trigger points, not as unused infrastructure.

## Decision

### 1. `src/ui/IntroBriefing.jsx` — first-contact gate
Mounted in `SceneRoot`, shown when: assets finished loading (own `useProgress()`
read) **and** `!hasSeenIntro()` (new `src/core/visitProgress.js` helper, backed by
`localStorage`). Blocks all other overlays while visible (state-machine framing —
one exclusive "gate" state), fades out ~400ms on dismiss.

Content, framed as a mission brief rather than a feature list (per the framework's
"answer the visitor's unspoken question — is this worth my time — don't list
features" principle):
- One-line mission statement (e.g. "Hành trình từ xưởng thép đến real-time 3D —
  chọn cách bạn muốn khám phá.")
- Two path cards:
  - **Guided Tour** (default/recommended) — dismisses the gate, `interaction`
    already defaults to `guided`, narrative plays exactly as it does today.
  - **Museum Walk** — only rendered if `supportsFreeRoam()` — dismisses the gate,
    calls `interaction.freeroamMode()` directly, then the existing
    `#museum-lock-prompt` click-to-lock flow takes over. `MuseumWelcome`
    (ADR-0002) is **not** shown in this path — the intro already delivered that
    framing, showing it twice would repeat the same message the researched
    "tutorial prompts are one-time, never repeat" rule warns against.
- On dismiss (either path): `markIntroSeen()` — never shown again on this device.

`MuseumWelcome.jsx` is kept, unchanged, for its original purpose: a visitor who
started with Guided Tour and *later* clicks "Museum" mid-session still sees it —
the intro only owns the very first moment, not every entry into free-roam.

### 2. `src/life-engine/NotificationCenter.jsx` — site-wide toast system
A small React Context provider + `useNotifications()` hook, mounted once in
`SceneRoot`'s overlay tree, plus a `<NotificationTray />` renderer. This is a new
state-sharing pattern for the codebase (everything else today is hooks/props on
`SceneRoot`) — justified here because three unrelated components (`IntroBriefing`,
zone-entry detection, `HeaderStatement`'s language toggle) all need to trigger
toasts without prop-drilling a callback through the whole tree.

API: `notify({ priority: 'critical' | 'normal', message: {vi, en}, duration? })`.
- **`normal`**: corner toast (stacked, top-right under `HeaderStatement`),
  auto-dismiss after `duration` (default 4000ms). Duplicate `message` within 500ms
  of an existing toast is ignored rather than stacked (researched dedup rule).
- **`critical`**: center-screen, requires explicit dismiss or a longer timeout
  fallback — reserved for genuine milestone moments, used sparingly by design.

Initial wired trigger points (so the system ships with real usage, not inert
infrastructure):
1. **First-ever zone discovery** (`normal`): the first time a visitor enters each
   exhibit zone *ever* (not just this session — tracked via
   `visitProgress.js`'s `hasVisitedZone`/`markZoneVisited`), fire
   `"🏛️ Hiện vật mới: {exhibit title}"`. Session-repeat visits to an
   already-discovered zone don't re-fire — this is a discovery moment, not a
   per-entry event.
2. **Museum fully explored** (`critical`, once ever via `visitProgress.js`):
   the moment all three zones have been visited for the first time, fire
   `"🎉 Đã khám phá toàn bộ bảo tàng!"` — the emotional beat — while
   `MuseumExitPrompt` (ADR-0002, unchanged) keeps handling the actionable CTA
   (download CV / profile links) as its own persistent banner. One priority tier
   for the feeling, one dedicated component for the action — not merged into a
   single generic toast, since `MuseumExitPrompt`'s CTA buttons don't fit the
   generic `notify()` API.
3. **Language toggle confirmation** (`normal`): "Switched to English"/"Đã chuyển
   sang Tiếng Việt" on `HeaderStatement`'s existing toggle — small, standard
   confirming-feedback pattern, cheap to wire, proves the system works for
   everyday (not just milestone) feedback too.

### 3. `src/core/visitProgress.js` — shared localStorage-backed flags
Consolidates every "has this visitor seen/done X before" check in one small,
pure-function module (easy to unit test with a mocked `localStorage`, matching the
project's existing `tests/unit` pattern):
`hasSeenIntro()` / `markIntroSeen()`, `hasVisitedZone(id)` / `markZoneVisited(id)`,
`hasSeenMuseumComplete()` / `markMuseumComplete()`. All keys namespaced under a
single `cv3d:` prefix.

## Alternatives Considered

### Intro gate: repeat on every visit vs. first-visit-only — **first-visit-only chosen**
A returning visitor re-reading the same mission brief every time is exactly the
"tutorial prompts must not repeat to experienced players" anti-pattern the
researched framework calls out. A "what's changed since last visit" retention-hook
variant was considered but explicitly deferred — no content pipeline exists yet to
generate that copy, and the user scoped this round to the board itself.

### Notifications: React Context vs. module-level event emitter — **Context chosen**
An event-emitter singleton would avoid introducing Context to the codebase, but
Context is the idiomatic React answer for "multiple unrelated components read/write
shared UI state," is trivially testable/mockable, and keeps the pattern consistent
with how the rest of the app already thinks in hooks. A vanilla emitter was rejected
as a needless second state-sharing idiom for the same problem Context already
solves cleanly.

### Milestone CTA: fold into generic `notify()` vs. keep `MuseumExitPrompt` separate — **kept separate**
Forcing `MuseumExitPrompt`'s rich CTA buttons through a generic `{message}`-only
toast API would either bloat that API with arbitrary-content support (scope creep
for a first version) or strip the CTA down to plain text (weaker call-to-action).
Two purpose-built pieces — a generic toast for feeling, a dedicated banner for
action — is simpler than one over-general component.

## Consequences

### Positive
- First-time visitors get a real "this is an experience, not just a CV" moment,
  directly answering the framework's "First Contact" question instead of leaving it
  to chance discovery of the Museum button.
- Notification system is generically reusable for any future game-like feedback
  (achievements, easter eggs) without new plumbing — same `notify()` call.
- `visitProgress.js` centralizes every localStorage flag this and future features
  need, instead of ad hoc `localStorage` calls scattered per component.

### Negative
- One more blocking screen between page load and content — mitigated by being
  strictly first-visit-only and skippable in one click.
- New Context provider is a state-management pattern not used elsewhere in the
  codebase yet — small learning-curve cost for future contributors, justified by
  avoiding prop-drilling across `SceneRoot`'s already-large component tree.

### Risks
- `localStorage` can be unavailable/blocked (private browsing, storage-disabled
  browsers) — `visitProgress.js` must fail safe (treat as "not seen yet" / no-op on
  write) rather than throwing, so the intro gate degrades to "always show once per
  session" rather than crashing.
- Dedup/priority rules for the notification tray are first-pass constants (500ms
  window, 4000ms default duration) — expect a playtest pass to tune.

## Performance Implications
- `IntroBriefing`/`NotificationTray` are plain DOM overlays, same cost class as
  existing `LoadingScreen`/`TextRevealSystem` — no new Canvas/WebGL work.
- `visitProgress.js` is synchronous `localStorage` reads/writes, negligible cost,
  called only on mount/dismiss/zone-change, not per-frame.
- No change to any `performanceProfile.lowEnd` budget.

## Related Decisions
Builds on [ADR-0001](./adr-0001-museum-freeroam-navigation.md) (free-roam) and
[ADR-0002](./adr-0002-museum-shell-and-visit-ritual.md) (`MuseumWelcome`,
`MuseumExitPrompt`, zone-visit tracking) — reuses their zone-entry detection and
keeps both components' existing contracts unchanged.

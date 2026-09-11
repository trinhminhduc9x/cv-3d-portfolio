# UX Spec: Museum Plaque

> Status: In Design | Last Updated: 2026-09-11

## Purpose & Visitor Need
Sells the "museum" framing from Concept 1: when a free-roaming visitor walks up to a
physical exhibit (mechanical / architecture / software zone), the moment should read
like reading a placard beside a real installation — a short, structured caption
(exhibit title, date range, material/medium, one curatorial line) — instead of the
long cinematic narrative used everywhere else in the portfolio. It takes over
`TextRevealSystem`'s role for that specific moment (freeroam + inside a zone) only;
`TextRevealSystem` keeps doing its job everywhere else (guided, explore, and
freeroam-but-between-zones).

## Entry & Exit Points
- **Entry**: `FreeRoamController`'s per-frame zone check (already implemented,
  `findActiveZoneId` in `FreeRoamController.jsx`) needs to also surface the raw
  **zone id** (`mechanical`/`architecture`/`software`), not just the mapped
  `primaryChapterId` it currently emits — plaque content is keyed by physical
  exhibit, and the software zone hosts 3 chapters behind one physical plaque.
  `onZoneChange` becomes `onZoneChange(zoneId)`; `SceneRoot` derives
  `chapterId = MUSEUM_ZONES[zoneId]?.primaryChapterId` for `setChapter(...)` and
  keeps `zoneId` itself in state for `MuseumPlaque`.
- **Exit**: `onZoneChange(null)` (leaving `radius + ZONE_ENTER_MARGIN`) fades the
  plaque out. `TextRevealSystem` is not forced back on automatically — it simply
  becomes visible again per the state rule below, showing whatever chapter is
  currently active while the visitor walks between exhibits.
- **Mode exit**: switching away from `freeroam` (Guided/Explore button, or a
  TimelineIndicator teleport per ADR-0001 §6) unmounts `MuseumPlaque` unconditionally
  — it only ever exists inside freeroam.

## Layout & Component Inventory
- New file `src/ui/MuseumPlaque.jsx`, sibling to `TextRevealSystem.jsx`.
- New data file `src/data/museumPlaques.config.js`, keyed by zone id
  (`mechanical`/`architecture`/`software`) — see draft content below.
- Props: `{ zoneId, lang }`. Renders `null` when `zoneId` is falsy.
- **Position**: fixed, **bottom-left** corner (bottom-right is free but keeps the
  compass clear if one is ever added; bottom-center is `TimelineIndicator`; top-right
  is `HeaderStatement`/`LifeModeControls` is bottom-right — bottom-left is the one
  quadrant with nothing else in it). `pointerEvents: 'none'` — never blocks
  WASD/mouse-look.
- **Card**: ~320px wide, background `rgba(20, 15, 12, 0.82)`, border
  `1px solid rgba(255, 179, 122, 0.28)` — reuses the exact surface/border tokens
  already established by `LifeModeControls` buttons, so it reads as part of the same
  UI system rather than a new visual language.
- **Content hierarchy** (top to bottom): `EXHIBIT №0{n}` eyebrow (small-caps, matches
  `TextRevealSystem`'s chapter-label treatment) → title (bold, primary-lang) → title
  secondary-lang line (smaller, italic — same bilingual pattern as
  `TextRevealSystem`) → date range (accent color, e.g. `#87ceeb`-family already used
  for secondary text) → material line → curatorial note (italic, smallest, bilingual
  pair same as title).

## States & Variants
- **Hidden** (default): `zoneId` is `null`, or `interaction.mode !== 'freeroam'`.
- **Entering**: `zoneId` changes from `null`/another zone to a new zone — fade +
  slight translateY, mirroring `TextRevealSystem`'s existing 180ms-delay/opacity
  pattern (same felt timing across both overlays).
- **Exiting**: `zoneId` becomes `null` — fade out, no special "transitioning" prop
  needed (plaque timing is independent of `TransitionOrchestrator`'s `visualState`,
  since zone entry/exit isn't a chapter transition).
- No loading/empty/error state — content is static local config, always available
  synchronously; if a zone id somehow has no config entry, render `null` (fail
  silent, never a broken card).

## Interaction Map
- Passive, read-only — no keyboard or pointer interaction on the card itself
  (`pointerEvents: 'none'`, matching `TextRevealSystem`).
- Not reachable from `CommandPalette` — it's a proximity side-effect, not a
  navigable destination.

## Accessibility
- `aria-live="polite"` + `aria-label={`${exhibit title} museum plaque`}`, directly
  mirroring `TextRevealSystem`'s `aria-label={`${chapter.label} narrative text`}`
  pattern — screen readers announce the new plaque non-disruptively as the visitor
  walks up, same as narrative text already does today.
- No new mobile/touch consideration needed — freeroam (and therefore the plaque) is
  already gated to `supportsFreeRoam()` desktop-only per ADR-0001; this doesn't open
  a second accessibility gap, it inherits the existing accepted one.
- Zero change to `TimelineIndicator`'s `aria-label="Show {Chapter} chapter"`
  contract — entirely separate overlay, existing visual tests unaffected.

## Acceptance Criteria
- [ ] Walking into a zone during freeroam shows `MuseumPlaque` with that exhibit's
      title/date range/material/curatorial note in the current `lang`.
- [ ] `TextRevealSystem` is hidden while a zone's plaque is showing (freeroam + zone
      active); it's visible again the moment `zoneId` returns to `null`.
- [ ] Toggling `lang` (vi/en) while a plaque is visible updates its text immediately.
- [ ] Guided/explore modes are completely unaffected — plaque never renders outside
      `freeroam`.
- [ ] Plaque never intercepts pointer/keyboard input — WASD/mouse-look keep working
      while it's visible.
- [ ] No change to `TimelineIndicator`'s `aria-label` contract; existing visual tests
      (`tests/visual/layers.visual.test.js`) unaffected.

## Draft Exhibit Content
(Title + date range are the user's own words from the Concept 1 proposal; material
and curatorial note are drafted here to match the existing narrative voice in
`lifeChapters.config.js` — **flag for edit**, not final copy.)

| Zone | Title (vi / en) | Date range | Material (vi / en) | Curatorial note (vi / en) |
|---|---|---|---|---|
| `mechanical` | Kết cấu thép & động lực học biển / Structural steel & marine dynamics | 2017–2020 | Thép kết cấu tàu · Bản vẽ kỹ thuật hải quân / Structural steel · Naval technical drawings | Nơi hình học đối mặt vật lý — mỗi đường cong thân tàu là một phép tính không được phép sai. / Where geometry met physics — every hull curve was a calculation with no room for error. |
| `architecture` | Ánh sáng & hình học không gian / Light & spatial geometry | 2020–2022 | Ánh sáng vật lý (PBR) · Vật liệu kiến trúc số / Physically-based lighting · Digital architectural materials | Ánh sáng không chỉ chiếu sáng — nó thuyết phục. Không gian học cách kéo ánh nhìn. / Light didn't just illuminate — it persuaded. Space learned to draw the eye. |
| `software` | Hệ sinh thái tính toán thời gian thực / Real-time computational ecosystem | 2022–nay / 2022–present | WebGL · Three.js · Vòng lặp thời gian thực / WebGL · Three.js · Real-time render loop | Từ khung hình tĩnh đến thế giới sống trong trình duyệt — kỷ luật biến cảm hứng thành kiến trúc bền vững. / From static frames to worlds alive in the browser — discipline turned inspiration into architecture built to last. |

## Open Questions
- Final copy approval for material/curatorial note fields above (title + date range
  already confirmed by the user).
- Exhibit numbering `#01/#02/#03` assumed spatial (mechanical=01 at the hub,
  architecture=02, software=03) matching the user's own numbering — confirm before
  implementation.

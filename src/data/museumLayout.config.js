/**
 * Single source of truth for the hub-and-spokes world layout shared by
 * `SceneRoot.jsx` (zone group positions) and `FreeRoamController.js`
 * (collision + proximity detection during freeroam).
 *
 * Radius/bounds values are initial estimates — tune by hand during manual
 * playtest (`npm run dev`, Museum mode) rather than computed from GLB
 * dimensions, since `layerScale` multipliers don't map directly to
 * world-space collision size.
 */

export const MUSEUM_ZONES = {
    mechanical: {
        position: [0, 0, 0],
        radius: 6,
        primaryChapterId: 'origin',
    },
    architecture: {
        position: [-9, 0, -15.588],
        radius: 4,
        primaryChapterId: 'awakening',
    },
    software: {
        position: [9, 0, -15.588],
        radius: 4,
        primaryChapterId: 'transformation',
    },
};

/** Walkable floor rectangle — keeps free-roam visitors from wandering into the void. */
export const MUSEUM_BOUNDS = {
    minX: -22,
    maxX: 22,
    minZ: -30,
    maxZ: 12,
};

/** ADR-0002: procedural shell (walls/ceiling) sizing, built from MUSEUM_BOUNDS. */
export const MUSEUM_SHELL = {
    wallMargin: 3,
    ceilingHeight: 14,
    wallThickness: 0.6,
};

/** ADR-0002: visiting order for the decorative suggested-path floor strip. */
export const MUSEUM_PATH_ORDER = ['mechanical', 'architecture', 'software'];

export function getMuseumZoneIds() {
    return Object.keys(MUSEUM_ZONES);
}

export function getMuseumZone(zoneId) {
    return MUSEUM_ZONES[zoneId] || null;
}

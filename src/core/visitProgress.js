/**
 * Shared localStorage-backed "has this visitor seen/done X before" flags.
 * Every read/write fails safe (returns `false` / no-ops) when `localStorage`
 * is unavailable or blocked (private browsing, storage-disabled browsers) —
 * degrading to "always show once per session" rather than throwing.
 */

const PREFIX = 'cv3d:';
const INTRO_SEEN_KEY = `${PREFIX}intro-seen`;
const VISITED_ZONES_KEY = `${PREFIX}visited-zones`;
const MUSEUM_COMPLETE_KEY = `${PREFIX}museum-complete`;

function readFlag(key) {
    try {
        return window.localStorage.getItem(key) === '1';
    } catch {
        return false;
    }
}

function writeFlag(key) {
    try {
        window.localStorage.setItem(key, '1');
    } catch {
        // Storage unavailable — silently no-op, caller's UI state still updates.
    }
}

function readVisitedZones() {
    try {
        const raw = window.localStorage.getItem(VISITED_ZONES_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function hasSeenIntro() {
    return readFlag(INTRO_SEEN_KEY);
}

export function markIntroSeen() {
    writeFlag(INTRO_SEEN_KEY);
}

export function hasVisitedZone(zoneId) {
    return readVisitedZones().includes(zoneId);
}

export function markZoneVisited(zoneId) {
    try {
        const zones = readVisitedZones();
        if (!zones.includes(zoneId)) {
            window.localStorage.setItem(VISITED_ZONES_KEY, JSON.stringify([...zones, zoneId]));
        }
    } catch {
        // Storage unavailable — silently no-op.
    }
}

export function hasSeenMuseumComplete() {
    return readFlag(MUSEUM_COMPLETE_KEY);
}

export function markMuseumComplete() {
    writeFlag(MUSEUM_COMPLETE_KEY);
}

import { MUSEUM_BOUNDS, MUSEUM_ZONES, getMuseumZoneIds } from '../../src/data/museumLayout.config.js';
import { getAllModelIds } from '../../src/scene/models/modelRegistry.js';

describe('museumLayout.config', () => {
    test('every zone id matches a registered model id', () => {
        const modelIds = getAllModelIds();

        getMuseumZoneIds().forEach((zoneId) => {
            expect(modelIds).toContain(zoneId);
        });
    });

    test('every zone position falls within the walkable bounds', () => {
        Object.values(MUSEUM_ZONES).forEach((zone) => {
            const [x, , z] = zone.position;

            expect(x).toBeGreaterThanOrEqual(MUSEUM_BOUNDS.minX);
            expect(x).toBeLessThanOrEqual(MUSEUM_BOUNDS.maxX);
            expect(z).toBeGreaterThanOrEqual(MUSEUM_BOUNDS.minZ);
            expect(z).toBeLessThanOrEqual(MUSEUM_BOUNDS.maxZ);
        });
    });

    test('every zone has a positive collision radius and a primaryChapterId', () => {
        Object.values(MUSEUM_ZONES).forEach((zone) => {
            expect(zone.radius).toBeGreaterThan(0);
            expect(typeof zone.primaryChapterId).toBe('string');
            expect(zone.primaryChapterId.length).toBeGreaterThan(0);
        });
    });

    test('no two zones overlap (distance between centers exceeds combined radii)', () => {
        const zones = Object.values(MUSEUM_ZONES);

        for (let i = 0; i < zones.length; i += 1) {
            for (let j = i + 1; j < zones.length; j += 1) {
                const [ax, , az] = zones[i].position;
                const [bx, , bz] = zones[j].position;
                const distance = Math.sqrt(((ax - bx) ** 2) + ((az - bz) ** 2));

                expect(distance).toBeGreaterThan(zones[i].radius + zones[j].radius);
            }
        }
    });
});

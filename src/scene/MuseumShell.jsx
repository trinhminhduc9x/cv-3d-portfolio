/* eslint-disable react/no-unknown-property */
import { useMemo } from 'react';
import * as THREE from 'three';

import {
    MUSEUM_BOUNDS,
    MUSEUM_PATH_ORDER,
    MUSEUM_SHELL,
    MUSEUM_ZONES,
} from '../data/museumLayout.config';

const noRaycast = () => null;
const WALL_BOTTOM = -1;

/**
 * One segment of the decorative suggested-path floor strip between two
 * exhibit zones. Purely visual — raycast disabled, never affects
 * `FreeRoamController`'s (circle-math, non-raycast) collision.
 *
 * @param {object} props Segment endpoints.
 * @param {[number, number, number]} props.from Start zone world position.
 * @param {[number, number, number]} props.to End zone world position.
 * @returns {JSX.Element} Flat glowing strip mesh.
 */
function PathSegment({ from, to }) {
    const { center, length, angle } = useMemo(() => {
        const dx = to[0] - from[0];
        const dz = to[2] - from[2];

        return {
            center: [(from[0] + to[0]) / 2, -0.58, (from[2] + to[2]) / 2],
            length: Math.sqrt((dx * dx) + (dz * dz)),
            angle: Math.atan2(dx, dz),
        };
    }, [from, to]);

    return (
        <mesh position={center} rotation={[-Math.PI / 2, 0, angle]} raycast={noRaycast}>
            <planeGeometry args={[0.7, length]} />
            <meshBasicMaterial color="#3f9adf" transparent opacity={0.16} depthWrite={false} />
        </mesh>
    );
}

/**
 * Procedural museum hall shell (walls + ceiling) enclosing the existing
 * hub-and-spokes exhibit layout, plus a decorative suggested-path floor
 * strip. Mounted only while free-roaming (ADR-0002) — guided/explore modes
 * keep their current unenclosed cinematic look untouched. Walls use a fixed
 * neutral material rather than reacting to per-chapter `lightingMood`, so
 * the building itself reads as stable architecture around the exhibits.
 *
 * @returns {JSX.Element} Static hall geometry.
 */
function MuseumShell() {
    const { width, depth, centerX, centerZ } = useMemo(() => {
        const w = (MUSEUM_BOUNDS.maxX - MUSEUM_BOUNDS.minX) + (MUSEUM_SHELL.wallMargin * 2);
        const d = (MUSEUM_BOUNDS.maxZ - MUSEUM_BOUNDS.minZ) + (MUSEUM_SHELL.wallMargin * 2);

        return {
            width: w,
            depth: d,
            centerX: (MUSEUM_BOUNDS.minX + MUSEUM_BOUNDS.maxX) / 2,
            centerZ: (MUSEUM_BOUNDS.minZ + MUSEUM_BOUNDS.maxZ) / 2,
        };
    }, []);

    const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#0c0f14',
        roughness: 0.92,
        metalness: 0.05,
    }), []);

    const pathSegments = useMemo(() => MUSEUM_PATH_ORDER.slice(1).map((zoneId, i) => ({
        from: MUSEUM_ZONES[MUSEUM_PATH_ORDER[i]].position,
        to: MUSEUM_ZONES[zoneId].position,
    })), []);

    const { ceilingHeight, wallThickness } = MUSEUM_SHELL;
    const halfWidth = width / 2;
    const halfDepth = depth / 2;
    const wallHeight = ceilingHeight - WALL_BOTTOM;
    const wallCenterY = (ceilingHeight + WALL_BOTTOM) / 2;

    return (
        <group>
            {/* Ceiling — normal faces down (-Y), visible from inside the hall. */}
            <mesh position={[centerX, ceilingHeight, centerZ]} rotation={[Math.PI / 2, 0, 0]} material={wallMaterial}>
                <planeGeometry args={[width, depth]} />
            </mesh>

            {/* North / south walls (span X) */}
            <mesh position={[centerX, wallCenterY, centerZ - halfDepth]} material={wallMaterial}>
                <boxGeometry args={[width, wallHeight, wallThickness]} />
            </mesh>
            <mesh position={[centerX, wallCenterY, centerZ + halfDepth]} material={wallMaterial}>
                <boxGeometry args={[width, wallHeight, wallThickness]} />
            </mesh>

            {/* East / west walls (span Z) */}
            <mesh position={[centerX - halfWidth, wallCenterY, centerZ]} material={wallMaterial}>
                <boxGeometry args={[wallThickness, wallHeight, depth]} />
            </mesh>
            <mesh position={[centerX + halfWidth, wallCenterY, centerZ]} material={wallMaterial}>
                <boxGeometry args={[wallThickness, wallHeight, depth]} />
            </mesh>

            {pathSegments.map((segment) => (
                <PathSegment key={`${segment.from.join(',')}-${segment.to.join(',')}`} {...segment} />
            ))}
        </group>
    );
}

export default MuseumShell;

/* eslint-disable react/prop-types, react/no-unknown-property */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Html, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import BVHVisualizer from '../modules/BVHVisualizer';
import BoundingBoxOverlay from '../modules/BoundingBoxOverlay';
import WireframeToggle from '../modules/WireframeToggle';
import BaseLayer from './BaseLayer';

const INITIAL_BOXES = {
    solverA: [-1.4, 0.45, 0.9],
    solverB: [1.2, 0.45, 0.9],
};

const DEMO_OBJECTS = [
    {
        id: 'software-root',
        label: 'Software Layer',
        children: [
            {
                id: 'geometry-engine',
                label: 'Geometry Engine',
                children: [
                    { id: 'bvh-target', label: 'BVH Raycast Mesh' },
                    { id: 'raycast-marker', label: 'Raycast Hit Marker' },
                ],
            },
            {
                id: 'collision-system',
                label: 'AABB Collision System',
                children: [
                    { id: 'solver-a', label: 'Draggable Box A' },
                    { id: 'solver-b', label: 'Draggable Box B' },
                ],
            },
        ],
    },
];

const CONTROL_STYLE = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '6px 0',
};

/*
 * SoftwareLayer is a self-contained geometry-systems demo. It intentionally
 * keeps debug visualization state local to the layer so narrative state can
 * toggle the layer without knowing about BVH, raycast, or collision internals.
 */
function toVector3(position) {
    return new THREE.Vector3(position[0], position[1], position[2]);
}

function SceneGraphNode({ node, depth = 0 }) {
    return (
        <div>
            <div
                style={{
                    paddingLeft: depth * 12,
                    color: depth === 0 ? '#ffffff' : 'rgba(220, 240, 255, 0.78)',
                    fontSize: 11,
                    lineHeight: 1.65,
                    whiteSpace: 'nowrap',
                }}
            >
                {depth > 0 ? '- ' : ''}
                {node.label}
            </div>
            {node.children?.map((child) => (
                <SceneGraphNode key={child.id} node={child} depth={depth + 1} />
            ))}
        </div>
    );
}

function ToggleRow({ label, checked, onChange }) {
    return (
        <label style={CONTROL_STYLE}>
            <span>{label}</span>
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
        </label>
    );
}

function SceneGraphPanel({
    active,
    controls,
    setControls,
    collisionActive,
    hitInfo,
}) {
    if (!active) {
        return null;
    }

    return (
        <Html fullscreen zIndexRange={[40, 0]}>
            <aside
                style={{
                    position: 'absolute',
                    top: 96,
                    left: 24,
                    width: 270,
                    padding: 16,
                    borderRadius: 8,
                    border: '1px solid rgba(135, 206, 235, 0.24)',
                    background: 'rgba(10, 16, 22, 0.86)',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.38)',
                    backdropFilter: 'blur(12px)',
                    color: '#ffffff',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: 12,
                    pointerEvents: 'auto',
                    userSelect: 'none',
                }}
            >
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#87ceeb' }}>
                        Geometry Systems
                    </div>
                    <div style={{ marginTop: 4, color: 'rgba(255, 255, 255, 0.58)', fontSize: 11 }}>
                        BVH, raycast, scene graph, AABB
                    </div>
                </div>

                <div
                    style={{
                        borderTop: '1px solid rgba(135, 206, 235, 0.18)',
                        borderBottom: '1px solid rgba(135, 206, 235, 0.18)',
                        padding: '8px 0',
                        marginBottom: 12,
                    }}
                >
                    <ToggleRow
                        label="Scene graph"
                        checked={controls.sceneGraph}
                        onChange={(sceneGraph) => setControls((value) => ({ ...value, sceneGraph }))}
                    />
                    <ToggleRow
                        label="BVH tree"
                        checked={controls.bvh}
                        onChange={(bvh) => setControls((value) => ({ ...value, bvh }))}
                    />
                    <ToggleRow
                        label="AABB bounds"
                        checked={controls.aabb}
                        onChange={(aabb) => setControls((value) => ({ ...value, aabb }))}
                    />
                    <ToggleRow
                        label="Wireframe"
                        checked={controls.wireframe}
                        onChange={(wireframe) => setControls((value) => ({ ...value, wireframe }))}
                    />
                    <ToggleRow
                        label="Raycast marker"
                        checked={controls.raycast}
                        onChange={(raycast) => setControls((value) => ({ ...value, raycast }))}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <div style={{ color: '#87ceeb', fontWeight: 700, marginBottom: 6 }}>
                        Scene Graph
                    </div>
                    {controls.sceneGraph ? (
                        DEMO_OBJECTS.map((node) => <SceneGraphNode key={node.id} node={node} />)
                    ) : (
                        <div style={{ color: 'rgba(255, 255, 255, 0.48)' }}>Hidden</div>
                    )}
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: 6,
                        color: 'rgba(255, 255, 255, 0.72)',
                    }}
                >
                    <div>
                        Collision:{' '}
                        <span style={{ color: collisionActive ? '#ff8a66' : '#8ef7b0', fontWeight: 700 }}>
                            {collisionActive ? 'intersecting' : 'clear'}
                        </span>
                    </div>
                    <div>
                        Raycast:{' '}
                        <span style={{ color: hitInfo ? '#87ceeb' : 'rgba(255, 255, 255, 0.48)' }}>
                            {hitInfo ? `${hitInfo.objectName} @ ${hitInfo.distance.toFixed(2)}` : 'none'}
                        </span>
                    </div>
                </div>
            </aside>
        </Html>
    );
}

function DraggableCollisionBox({
    id,
    name,
    color,
    active,
    colliding,
    position,
    onPositionChange,
}) {
    const meshRef = useRef(null);
    const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.45), []);
    const dragPoint = useMemo(() => new THREE.Vector3(), []);
    const offset = useRef(new THREE.Vector3());
    const dragging = useRef(false);

    const updatePositionFromPointer = useCallback((event) => {
        if (!event.ray.intersectPlane(dragPlane, dragPoint)) {
            return;
        }

        const nextPosition = dragPoint.clone().add(offset.current);
        nextPosition.y = 0.45;

        onPositionChange(id, nextPosition.toArray());
    }, [dragPlane, dragPoint, id, onPositionChange]);

    const handlePointerDown = useCallback((event) => {
        if (!active) {
            return;
        }

        event.stopPropagation();
        event.target.setPointerCapture?.(event.pointerId);
        dragging.current = true;

        if (!event.ray.intersectPlane(dragPlane, dragPoint)) {
            return;
        }

        offset.current.copy(toVector3(position)).sub(dragPoint);
    }, [active, dragPlane, dragPoint, position]);

    const handlePointerMove = useCallback((event) => {
        if (!dragging.current) {
            return;
        }

        event.stopPropagation();
        updatePositionFromPointer(event);
    }, [updatePositionFromPointer]);

    const handlePointerUp = useCallback((event) => {
        if (!dragging.current) {
            return;
        }

        event.stopPropagation();
        event.target.releasePointerCapture?.(event.pointerId);
        dragging.current = false;
    }, []);

    return (
        <group>
            <mesh
                ref={meshRef}
                name={name}
                position={position}
                castShadow
                receiveShadow
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <boxGeometry args={[0.9, 0.9, 0.9]} />
                <meshStandardMaterial
                    color={colliding ? '#ff7043' : color}
                    emissive={colliding ? '#551400' : '#000000'}
                    roughness={0.42}
                    metalness={0.12}
                />
            </mesh>
            <Text
                position={[position[0], 1.22, position[2]]}
                fontSize={0.12}
                color={colliding ? '#ffb199' : '#cfeeff'}
                anchorX="center"
                anchorY="middle"
            >
                {name}
            </Text>
            <BoundingBoxOverlay active={active} targetRef={meshRef} color={colliding ? '#ff7043' : '#87ceeb'} />
        </group>
    );
}

function RaycastTarget({ active, showMarker, onHit, bvhMeshRef }) {
    const hitMarkerRef = useRef(null);
    const [hitPoint, setHitPoint] = useState(null);

    const handlePointerMove = useCallback((event) => {
        if (!active) {
            return;
        }

        event.stopPropagation();

        /*
         * R3F converts browser pointer movement into a Three.js Raycaster.
         * The event already contains the nearest intersection point, so this
         * demonstrates raycast hit testing without manually allocating a
         * Raycaster every frame.
         */
        setHitPoint(event.point.toArray());
        onHit({
            objectName: event.object.name || 'BVH Raycast Mesh',
            distance: event.distance,
        });
    }, [active, onHit]);

    const handlePointerOut = useCallback(() => {
        setHitPoint(null);
        onHit(null);
    }, [onHit]);

    useFrame(() => {
        if (hitMarkerRef.current && hitPoint) {
            hitMarkerRef.current.position.fromArray(hitPoint);
        }
    });

    return (
        <group name="geometry-engine">
            {/* Static geometry is a good BVH candidate: build the tree once, then reuse it for raycasts/spatial queries. */}
            <mesh
                ref={bvhMeshRef}
                name="BVH Raycast Mesh"
                position={[0, 1.1, -0.75]}
                rotation={[0.25, 0.6, -0.12]}
                castShadow
                receiveShadow
                onPointerMove={handlePointerMove}
                onPointerOut={handlePointerOut}
            >
                {/* Segment counts are high enough to make BVH boxes meaningful, but still cheap for a portfolio demo. */}
                <torusKnotGeometry args={[0.72, 0.18, 140, 24]} />
                <meshStandardMaterial color="#4a90e2" roughness={0.36} metalness={0.28} />
            </mesh>

            {showMarker && hitPoint && (
                <mesh ref={hitMarkerRef} name="Raycast Hit Marker">
                    <sphereGeometry args={[0.055, 16, 16]} />
                    <meshBasicMaterial color="#ffdf6e" depthTest={false} />
                </mesh>
            )}
        </group>
    );
}

function SoftwareLayer({ active = false }) {
    const rootRef = useRef(null);
    const bvhMeshRef = useRef(null);
    const boxARef = useRef(new THREE.Box3());
    const boxBRef = useRef(new THREE.Box3());
    const collisionState = useRef(false);

    const [controls, setControls] = useState({
        sceneGraph: true,
        bvh: true,
        aabb: true,
        wireframe: false,
        raycast: true,
    });
    const [boxPositions, setBoxPositions] = useState(INITIAL_BOXES);
    const [collisionActive, setCollisionActive] = useState(false);
    const [hitInfo, setHitInfo] = useState(null);

    const handleBoxPositionChange = useCallback((id, position) => {
        setBoxPositions((value) => ({
            ...value,
            [id]: position,
        }));
    }, []);

    useEffect(() => {
        if (!active) {
            setHitInfo(null);
        }
    }, [active]);

    useFrame(() => {
        const boxAMesh = rootRef.current?.getObjectByName('Draggable Box A');
        const boxBMesh = rootRef.current?.getObjectByName('Draggable Box B');

        if (!boxAMesh || !boxBMesh) {
            return;
        }

        /*
         * AABB collision is intentionally cheap: Box3.setFromObject computes
         * world-space min/max extents, then intersectsBox performs six scalar
         * interval checks. For dense scenes, cache boxes per object and update
         * only when transforms change instead of recomputing the whole graph.
         */
        boxARef.current.setFromObject(boxAMesh);
        boxBRef.current.setFromObject(boxBMesh);

        const intersects = boxARef.current.intersectsBox(boxBRef.current);

        if (collisionState.current !== intersects) {
            collisionState.current = intersects;
            setCollisionActive(intersects);
        }
    });

    return (
        <BaseLayer active={active} rotationSpeed={0}>
            <group ref={rootRef} name="software-root" visible={active}>
                <group name="collision-system">
                    <DraggableCollisionBox
                        id="solverA"
                        name="Draggable Box A"
                        color="#2dd4bf"
                        active={active && controls.aabb}
                        colliding={collisionActive}
                        position={boxPositions.solverA}
                        onPositionChange={handleBoxPositionChange}
                    />
                    <DraggableCollisionBox
                        id="solverB"
                        name="Draggable Box B"
                        color="#a78bfa"
                        active={active && controls.aabb}
                        colliding={collisionActive}
                        position={boxPositions.solverB}
                        onPositionChange={handleBoxPositionChange}
                    />
                </group>

                <RaycastTarget
                    active={active}
                    showMarker={controls.raycast}
                    onHit={setHitInfo}
                    bvhMeshRef={bvhMeshRef}
                />

                <BVHVisualizer
                    active={active && controls.bvh}
                    meshRef={bvhMeshRef}
                    depth={7}
                    opacity={0.28}
                    displayEdges
                />
                <WireframeToggle active={active && controls.wireframe} targetRef={rootRef} />

                <gridHelper args={[5, 10, '#24465c', '#183140']} position={[0, -0.02, 0]} />

                <Text
                    position={[0, 2.25, -0.75]}
                    fontSize={0.16}
                    color="#87ceeb"
                    anchorX="center"
                    anchorY="middle"
                >
                    Software Geometry Engine
                </Text>
            </group>

            <SceneGraphPanel
                active={active}
                controls={controls}
                setControls={setControls}
                collisionActive={collisionActive}
                hitInfo={hitInfo}
            />
        </BaseLayer>
    );
}

export default SoftwareLayer;

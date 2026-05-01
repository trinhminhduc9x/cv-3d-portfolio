/* eslint-disable react/prop-types, react/no-unknown-property */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
    computeBoundsTree,
    disposeBoundsTree,
    MeshBVHVisualizer as ThreeMeshBVHVisualizer,
} from 'three-mesh-bvh';

function resolveRoot(target, targetRef, scene) {
    return targetRef?.current || target || scene;
}

function findFirstMesh(object) {
    if (!object) {
        return null;
    }

    if (object.isMesh && object.geometry) {
        return object;
    }

    let mesh = null;
    object.traverse((child) => {
        if (!mesh && child.isMesh && child.geometry) {
            mesh = child;
        }
    });

    return mesh;
}

/**
 * Visualizes the bounding volume hierarchy for a selected mesh.
 *
 * three-mesh-bvh stores a tree of nested bounding boxes on
 * `geometry.boundsTree`. The visualizer renders boxes at the requested depth,
 * making it useful for debugging raycast and spatial-query acceleration.
 */
function BVHVisualizer({
    active = false,
    target = null,
    targetRef = null,
    mesh = null,
    meshRef = null,
    depth = 8,
    color = '#00ff88',
    opacity = 0.35,
    displayParents = false,
    displayEdges = true,
    bvhOptions = undefined,
    disposeGeneratedTreeOnUnmount = false,
}) {
    const scene = useThree((state) => state.scene);
    const [visualizer, setVisualizer] = useState(null);
    const visualizerRef = useRef(null);
    const meshRefCache = useRef(null);
    const generatedTrees = useRef(new WeakSet());

    const disposeVisualizer = useCallback((updateState = true) => {
        if (visualizerRef.current) {
            visualizerRef.current.dispose();
            visualizerRef.current = null;

            if (updateState) {
                setVisualizer(null);
            }
        }
    }, []);

    const resolveMesh = useCallback(() => {
        const explicitMesh = meshRef?.current || mesh;

        if (explicitMesh?.isMesh && explicitMesh.geometry) {
            return explicitMesh;
        }

        return findFirstMesh(resolveRoot(target, targetRef, scene));
    }, [mesh, meshRef, scene, target, targetRef]);

    const ensureBoundsTree = useCallback((geometry) => {
        if (!geometry.boundsTree) {
            computeBoundsTree.call(geometry, bvhOptions);
            generatedTrees.current.add(geometry);
        }
    }, [bvhOptions]);

    const syncVisualizer = useCallback(() => {
        if (!active) {
            disposeVisualizer();
            meshRefCache.current = null;
            return;
        }

        const selectedMesh = resolveMesh();

        if (!selectedMesh) {
            disposeVisualizer();
            meshRefCache.current = null;
            return;
        }

        ensureBoundsTree(selectedMesh.geometry);

        if (!visualizerRef.current || meshRefCache.current !== selectedMesh) {
            disposeVisualizer();
            visualizerRef.current = new ThreeMeshBVHVisualizer(selectedMesh, depth);
            meshRefCache.current = selectedMesh;
            setVisualizer(visualizerRef.current);
        }

        visualizerRef.current.depth = depth;
        visualizerRef.current.displayParents = displayParents;
        visualizerRef.current.displayEdges = displayEdges;
        visualizerRef.current.color.set(color);
        visualizerRef.current.opacity = opacity;
        visualizerRef.current.update();
    }, [
        active,
        color,
        depth,
        displayEdges,
        displayParents,
        disposeVisualizer,
        ensureBoundsTree,
        opacity,
        resolveMesh,
    ]);

    useEffect(() => {
        const generatedTreesRef = generatedTrees.current;

        syncVisualizer();

        return () => {
            const selectedMesh = meshRefCache.current;

            disposeVisualizer(false);

            if (
                disposeGeneratedTreeOnUnmount &&
                selectedMesh?.geometry &&
                generatedTreesRef.has(selectedMesh.geometry)
            ) {
                disposeBoundsTree.call(selectedMesh.geometry);
                generatedTreesRef.delete(selectedMesh.geometry);
            }
        };
    }, [disposeGeneratedTreeOnUnmount, disposeVisualizer, syncVisualizer]);

    useFrame(() => {
        if (active) {
            syncVisualizer();
        }
    });

    if (!active || !visualizer) {
        return null;
    }

    return <primitive object={visualizer} />;
}

export default BVHVisualizer;

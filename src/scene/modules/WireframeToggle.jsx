/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

function resolveRoot(target, targetRef, scene) {
    return targetRef?.current || target || scene;
}

function getMaterials(object) {
    if (!object?.material) {
        return [];
    }

    return Array.isArray(object.material) ? object.material : [object.material];
}

/**
 * Toggles wireframe rendering for every mesh material under a root Object3D.
 *
 * Previous material wireframe values are stored before mutation and restored
 * when `active` becomes false or the component unmounts. This keeps the module
 * safe for debugging narrative states without permanently changing materials.
 */
function WireframeToggle({
    active = false,
    target = null,
    targetRef = null,
    watchDynamicMeshes = true,
}) {
    const scene = useThree((state) => state.scene);
    const previousWireframes = useRef(new Map());

    const applyWireframe = (root) => {
        root.traverse((object) => {
            if (!object.isMesh) {
                return;
            }

            getMaterials(object).forEach((material) => {
                if (!previousWireframes.current.has(material)) {
                    previousWireframes.current.set(material, material.wireframe);
                }

                material.wireframe = true;
                material.needsUpdate = true;
            });
        });
    };

    const restoreWireframe = () => {
        previousWireframes.current.forEach((wireframe, material) => {
            material.wireframe = wireframe;
            material.needsUpdate = true;
        });
        previousWireframes.current.clear();
    };

    useEffect(() => {
        const root = resolveRoot(target, targetRef, scene);

        if (active && root) {
            applyWireframe(root);
        } else {
            restoreWireframe();
        }

        return restoreWireframe;
    }, [active, scene, target, targetRef]);

    useFrame(() => {
        if (!active || !watchDynamicMeshes) {
            return;
        }

        const root = resolveRoot(target, targetRef, scene);

        if (root) {
            applyWireframe(root);
        }
    });

    return null;
}

export default WireframeToggle;

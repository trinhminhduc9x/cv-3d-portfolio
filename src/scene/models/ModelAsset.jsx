/* eslint-disable react/prop-types */
import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

import { getModelConfig, getModelUrl } from './modelRegistry';

function asVector3Array(value, fallback = [1, 1, 1]) {
    if (Array.isArray(value) && value.length === 3) {
        return value;
    }

    if (typeof value === 'number') {
        return [value, value, value];
    }

    return fallback;
}

function asMaterialArray(materialOrMaterials) {
    if (!materialOrMaterials) {
        return [];
    }

    return Array.isArray(materialOrMaterials)
        ? materialOrMaterials.filter(Boolean)
        : [materialOrMaterials];
}

function configureMaterial(material) {
    const cloned = material.clone();
    cloned.transparent = false;
    cloned.opacity = 1;
    cloned.side = THREE.DoubleSide;
    cloned.depthTest = true;
    cloned.depthWrite = true;
    cloned.needsUpdate = true;
    return cloned;
}

function configureMesh(mesh) {
    mesh.visible = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const materials = asMaterialArray(mesh.material).map(configureMaterial);

    if (materials.length === 1) {
        mesh.material = materials[0];
    } else if (materials.length > 1) {
        mesh.material = materials;
    }
}

function disposeModelMaterials(root) {
    const disposed = new Set();

    root?.traverse?.((child) => {
        if (!child.isMesh) {
            return;
        }

        asMaterialArray(child.material).forEach((material) => {
            if (!disposed.has(material)) {
                material.dispose();
                disposed.add(material);
            }
        });
    });
}

function cloneSceneForModel(scene, config) {
    const clone = scene.clone(true);
    const scale = asVector3Array(config.modelScale);

    clone.position.set(0, 0, 0);
    clone.rotation.set(0, 0, 0);
    clone.scale.set(scale[0], scale[1], scale[2]);

    clone.traverse((child) => {
        if (child.isMesh) {
            configureMesh(child);
        }
    });

    return clone;
}

function ModelAsset({ modelId, ...props }) {
    const config = getModelConfig(modelId);
    const modelUrl = getModelUrl(modelId);

    if (!config || !modelUrl) {
        return null;
    }

    const { scene } = useGLTF(modelUrl);

    const clonedScene = useMemo(
        () => cloneSceneForModel(scene, config),
        [config, scene],
    );

    useEffect(() => () => {
        disposeModelMaterials(clonedScene);
    }, [clonedScene]);

    return <primitive object={clonedScene} {...props} />;
}

export default ModelAsset;

import * as THREE from 'three';

import { AnimationTimelineSystem, cubicInOut } from './AnimationTimelineSystem';

function asMaterialArray(materialOrMaterials) {
    if (!materialOrMaterials) {
        return [];
    }

    return Array.isArray(materialOrMaterials)
        ? materialOrMaterials.filter(Boolean)
        : [materialOrMaterials];
}

function collectMeshMaterials(root) {
    const materials = [];

    if (!root) {
        return materials;
    }

    if (root.isMaterial) {
        return [root];
    }

    if (root.isMesh) {
        materials.push(...asMaterialArray(root.material));
        return materials;
    }

    root.traverse?.((child) => {
        if (child.isMesh) {
            materials.push(...asMaterialArray(child.material));
        }
    });

    return materials;
}

function prepareFadeMaterial(material) {
    if (!material) {
        return;
    }

    material.transparent = true;
    material.depthWrite = false;
    material.needsUpdate = true;
}

function restoreOpaqueMaterialIfNeeded(material) {
    if (!material) {
        return;
    }

    if (material.opacity >= 0.999) {
        material.opacity = 1;
        material.transparent = false;
        material.depthWrite = true;
    }

    material.needsUpdate = true;
}

function toVector3Scale(targetScale) {
    if (Array.isArray(targetScale)) {
        return new THREE.Vector3(
            targetScale[0] ?? 1,
            targetScale[1] ?? targetScale[0] ?? 1,
            targetScale[2] ?? targetScale[0] ?? 1,
        );
    }

    if (targetScale?.isVector3) {
        return targetScale.clone();
    }

    return new THREE.Vector3(targetScale, targetScale, targetScale);
}

/**
 * Creates an engine-owned morph task around AnimationTimelineSystem.
 *
 * @param {number} duration Duration in seconds.
 * @param {(state:object)=>void} onUpdate Update callback.
 * @param {Function} onComplete Completion callback.
 * @returns {object} Morph task.
 */
export function createMorphTask(duration, onUpdate, onComplete = () => {}) {
    const timeline = new AnimationTimelineSystem(duration, {
        easing: cubicInOut,
        onUpdate,
        onComplete,
    });

    timeline.play();

    return {
        timeline,
        get active() {
            return timeline.playing;
        },
        /**
         * Advances this morph task.
         *
         * @param {number} delta Frame delta in seconds.
         */
        update(delta) {
            timeline.update(delta);
        },
        /**
         * Stops this morph task.
         */
        dispose() {
            timeline.stop();
        },
    };
}

/**
 * Fades one material or an array of materials between opacity values.
 *
 * @param {THREE.Material | Array<THREE.Material>} material Material or materials.
 * @param {number} from Starting opacity.
 * @param {number} to Target opacity.
 * @param {number} duration Duration in seconds.
 * @returns {object} Morph task.
 */
export function fadeMaterial(material, from = 1, to = 0, duration = 1) {
    const materials = asMaterialArray(material);

    materials.forEach((entry) => {
        entry.opacity = from;
        prepareFadeMaterial(entry);
    });

    return createMorphTask(
        duration,
        ({ eased }) => {
            materials.forEach((entry) => {
                entry.opacity = THREE.MathUtils.lerp(from, to, eased);
                entry.needsUpdate = true;
            });
        },
        () => {
            materials.forEach((entry) => {
                entry.opacity = to;
                restoreOpaqueMaterialIfNeeded(entry);
            });
        },
    );
}

/**
 * Dissolves all mesh materials below an Object3D to opacity 0.
 *
 * @param {THREE.Object3D} mesh Mesh or Object3D root.
 * @param {number} duration Duration in seconds.
 * @returns {object} Morph task.
 */
export function dissolveMesh(mesh, duration = 1) {
    const materials = collectMeshMaterials(mesh);
    const fromValues = materials.map((material) => material.opacity ?? 1);

    materials.forEach(prepareFadeMaterial);

    return createMorphTask(
        duration,
        ({ eased }) => {
            materials.forEach((material, index) => {
                material.opacity = THREE.MathUtils.lerp(fromValues[index], 0, eased);
                material.needsUpdate = true;
            });
        },
        () => {
            materials.forEach((material) => {
                material.opacity = 0;
                material.transparent = true;
                material.depthWrite = false;
                material.needsUpdate = true;
            });
        },
    );
}

/**
 * Smoothly scales an Object3D to a target scale.
 *
 * @param {THREE.Object3D} object Object to scale.
 * @param {number | Array<number> | THREE.Vector3} targetScale Target scale.
 * @param {number} duration Duration in seconds.
 * @returns {object} Morph task.
 */
export function scaleObject(object, targetScale = 1, duration = 1) {
    const fromScale = object?.scale?.clone?.() || new THREE.Vector3(1, 1, 1);
    const toScale = toVector3Scale(targetScale);

    return createMorphTask(
        duration,
        ({ eased }) => {
            if (object?.scale) {
                object.scale.lerpVectors(fromScale, toScale, eased);
            }
        },
        () => {
            if (object?.scale) {
                object.scale.copy(toScale);
            }
        },
    );
}

/**
 * Enables or disables wireframe mode for materials below an Object3D.
 *
 * @param {THREE.Object3D | THREE.Material | Array<THREE.Material>} target Object or material target.
 * @param {boolean} enabled Whether wireframe should be enabled.
 */
export function setWireframe(target, enabled = true) {
    const materials = target?.isMaterial || Array.isArray(target)
        ? asMaterialArray(target)
        : collectMeshMaterials(target);

    materials.forEach((material) => {
        if ('wireframe' in material) {
            material.wireframe = enabled;
            material.needsUpdate = true;
        }
    });
}

/**
 * Owns and updates active scene morph tasks.
 */
export class SceneMorphSystem {
    constructor() {
        this.tasks = new Set();
    }

    /**
     * Starts a dissolve task for a mesh or Object3D.
     *
     * @param {THREE.Object3D} mesh Mesh or Object3D root.
     * @param {number} duration Duration in seconds.
     * @returns {object} Morph task.
     */
    dissolveMesh(mesh, duration = 1) {
        const task = dissolveMesh(mesh, duration);
        this.tasks.add(task);
        return task;
    }

    /**
     * Starts a material fade task.
     *
     * @param {THREE.Material | Array<THREE.Material>} material Material target.
     * @param {number} from Starting opacity.
     * @param {number} to Target opacity.
     * @param {number} duration Duration in seconds.
     * @returns {object} Morph task.
     */
    fadeMaterial(material, from = 1, to = 0, duration = 1) {
        const task = fadeMaterial(material, from, to, duration);
        this.tasks.add(task);
        return task;
    }

    /**
     * Starts a scale morph task.
     *
     * @param {THREE.Object3D} object Object to scale.
     * @param {number | Array<number> | THREE.Vector3} targetScale Target scale.
     * @param {number} duration Duration in seconds.
     * @returns {object} Morph task.
     */
    scaleObject(object, targetScale = 1, duration = 1) {
        const task = scaleObject(object, targetScale, duration);
        this.tasks.add(task);
        return task;
    }

    /**
     * Enables or disables wireframe mode.
     *
     * @param {THREE.Object3D | THREE.Material | Array<THREE.Material>} target Object or material target.
     * @param {boolean} enabled Whether wireframe should be enabled.
     */
    setWireframe(target, enabled = true) {
        setWireframe(target, enabled);
    }

    /**
     * Advances all active morph tasks.
     *
     * @param {number} delta Frame delta in seconds.
     */
    update(delta) {
        this.tasks.forEach((task) => {
            task.update(delta);

            if (!task.active) {
                this.tasks.delete(task);
            }
        });
    }

    /**
     * Stops and clears all active morph tasks.
     */
    dispose() {
        this.tasks.forEach((task) => task.dispose());
        this.tasks.clear();
    }
}

/**
 * Creates a SceneMorphSystem instance.
 *
 * @returns {SceneMorphSystem} Scene morph system.
 */
export function createSceneMorphSystem() {
    return new SceneMorphSystem();
}

export default SceneMorphSystem;

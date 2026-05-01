function collectMaterials(object) {
    const materials = [];

    object?.traverse?.((child) => {
        if (!child.isMesh || !child.material) {
            return;
        }

        if (Array.isArray(child.material)) {
            materials.push(...child.material);
        } else {
            materials.push(child.material);
        }
    });

    return materials;
}

/**
 * Applies opacity and wireframe state to all mesh materials below an Object3D.
 *
 * @param {object} object Three.js Object3D root.
 * @param {object} state Visual state.
 * @param {number} state.opacity Material opacity between 0 and 1.
 * @param {boolean} state.wireframe Whether to show wireframe.
 */
export function applyLayerVisualState(object, { opacity = 1, wireframe = false }) {
    const clampedOpacity = Math.min(Math.max(opacity, 0), 1);

    collectMaterials(object).forEach((material) => {
        material.transparent = clampedOpacity < 0.999;
        material.opacity = clampedOpacity;
        material.wireframe = wireframe;
        material.depthWrite = clampedOpacity > 0.95;
        material.needsUpdate = true;
    });
}

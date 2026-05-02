import { useGLTF } from '@react-three/drei';

export const MODEL_REGISTRY = {
    mechanical: {
        id: 'mechanical',
        label: 'Mechanical',
        path: 'models/liberty_ship.glb',
        modelScale: [1, 1, 1],
        layerScale: {
            active: 40,
            inactive: 38.4,
        },
        rotationSpeed: 0.15,
    },
    architecture: {
        id: 'architecture',
        label: 'Architecture',
        path: 'models/architecture.glb',
        modelScale: [0.1, 0.1, 0.1],
        layerScale: {
            active: 1,
            inactive: 0.96,
        },
        rotationSpeed: 0.15,
    },
    software: {
        id: 'software',
        label: 'Software',
        path: 'models/software.glb',
        modelScale: [0.1, 0.1, 0.1],
        layerScale: {
            active: 1,
            inactive: 0.96,
        },
        rotationSpeed: 0.15,
    },
};

const preloadedModelIds = new Set();

export function getModelConfig(modelId) {
    return MODEL_REGISTRY[modelId] || null;
}

export function getModelUrl(modelId) {
    const config = getModelConfig(modelId);

    if (!config) {
        return null;
    }

    return `${import.meta.env.BASE_URL}${config.path}`;
}

export function getAllModelIds() {
    return Object.keys(MODEL_REGISTRY);
}

export function getChapterModelId(chapter) {
    const sceneId = chapter?.scene;
    return getModelConfig(sceneId) ? sceneId : null;
}

export function preloadModel(modelId) {
    const modelUrl = getModelUrl(modelId);

    if (!modelUrl || preloadedModelIds.has(modelId)) {
        return false;
    }

    useGLTF.preload(modelUrl);
    preloadedModelIds.add(modelId);
    return true;
}

export function preloadModels(modelIds = []) {
    modelIds.forEach((modelId) => {
        preloadModel(modelId);
    });
}

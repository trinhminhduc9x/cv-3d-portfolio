import * as THREE from 'three';

// TODO: Keep renderer, canvas, background, and fog defaults here.
export const CANVAS_CAMERA = {
    position: [0, 4, 14],
    fov: 50,
};

export const CANVAS_STYLE = {
    width: '100vw',
    height: '100vh',
};

export const GL_CONFIG = {
    alpha: false,
    outputColorSpace: THREE.SRGBColorSpace,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 0.9,
};

export const SCENE_BACKGROUND = '#0f1419';

export const FOG_CONFIG = {
    color: '#0f1419',
    near: 15,
    far: 50,
};

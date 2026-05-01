export const CHAPTER_SEQUENCE = [
    'prologue',
    'origin',
    'awakening',
    'transformation',
    'mastery',
    'vision',
];

export const LIFE_CHAPTERS = [
    {
        id: 'prologue',
        label: 'Prologue',
        scene: 'prologue',
        cameraPreset: {
            position: [0, 4.5, 18],
            target: [0, 0.2, 0],
            fov: 54,
        },
        lightingMood: {
            background: '#081018',
            fogColor: '#081018',
            fogDensity: 0.015,
            bloomIntensity: 0.18,
            vignetteDarkness: 0.72,
            exposure: 0.82,
            warmLightIntensity: 0,
        },
        transitionProfile: {
            origin: {
                duration: 4.0,
                easing: 'cubicInOut',
                climaxPause: 1000,
                // Fog auto-lerps 0.015 → 0.03 (barely perceptible lift)
                // Hull materialises from nothing
                mechanicalOpacity: { from: 0, to: 1 },
                fadeOpacity: 0.2,
            },
            default: { duration: 2.4, easing: 'quadInOut', climaxPause: 600 },
        },
        modules: {
            grid: true,
            infiniteGrid: false,
            nodes: false,
            wireframe: false,
        },
        textSequence: [
            'A career path built from structure, space, and systems.',
            'Scroll to move from foundations into applied geometry.',
        ],
    },
    {
        id: 'origin',
        label: 'Origin',
        scene: 'mechanical',
        cameraPreset: {
            position: [-2.8, 2.1, 12],
            target: [0, 0, 0],
            fov: 50,
        },
        lightingMood: {
            background: '#0c1620',
            fogColor: '#0c1620',
            fogDensity: 0.03,
            bloomIntensity: 0.12,
            vignetteDarkness: 0.55,
            exposure: 0.88,
            warmLightIntensity: 0,
        },
        transitionProfile: {
            awakening: {
                duration: 3.5,
                easing: 'cubicInOut',
                climaxPause: 1000,
                fog: { from: 0.03, to: 0.018 },
                // Hull dissolves to wireframe at 40 % then fades out; architecture scales in
                wireframe: { layer: 'mechanical', at: 0.4 },
                mechanicalOpacity: { from: 1, to: 0 },
                architectureOpacity: { from: 0, to: 1 },
                architectureScale: { from: 0.72, to: 1.0 },
                warmLightIntensity: { from: 0, to: 1.2 },
            },
            default: { duration: 2.4, easing: 'quadInOut', climaxPause: 600 },
        },
        modules: {
            grid: true,
            infiniteGrid: false,
            nodes: false,
            wireframe: false,
        },
        textSequence: [
            'Mechanical engineering formed the baseline: force, tolerance, measurement.',
            'The ship becomes a memory of constraints translated into 3D thinking.',
        ],
    },
    {
        id: 'awakening',
        label: 'Awakening',
        scene: 'architecture',
        cameraPreset: {
            position: [5, 6.5, 12],
            target: [5, 0, 0],
            fov: 48,
        },
        lightingMood: {
            background: '#15110c',
            fogColor: '#17130d',
            fogDensity: 0.018,
            bloomIntensity: 0.25,
            vignetteDarkness: 0.48,
            exposure: 0.98,
            warmLightIntensity: 1.2,
        },
        transitionProfile: {
            transformation: {
                duration: 3.8,
                easing: 'cubicInOut',
                climaxPause: 1000,
                fog: { from: 0.018, to: 0.02 },
                // Architectural form desaturates at midpoint then colour snaps to neon
                desaturateArc: 0.85,
                architectureOpacity: { from: 1, to: 0 },
                softwareOpacity: { from: 0, to: 1 },
                // Nodes spawn in the second half
                nodeOpacity: { from: 0, to: 1 },
                // Neon rim builds as the software world arrives
                neonRimIntensity: { from: 0, to: 1 },
                bloomIntensity: { from: 0.25, to: 1.2 },
            },
            default: { duration: 2.4, easing: 'quadInOut', climaxPause: 600 },
        },
        modules: {
            grid: true,
            infiniteGrid: false,
            nodes: false,
            wireframe: false,
        },
        textSequence: [
            'Architectural visualization sharpened composition, scale, lighting, and spatial rhythm.',
            'Geometry was no longer only correct; it had to be readable.',
        ],
    },
    {
        id: 'transformation',
        label: 'Transformation',
        scene: 'software',
        cameraPreset: {
            position: [7.2, 2.1, 4.2],
            target: [10, 0, 0],
            fov: 50,
        },
        lightingMood: {
            background: '#080a10',
            fogColor: '#080a10',
            fogDensity: 0.02,
            bloomIntensity: 1.2,
            vignetteDarkness: 0.62,
            exposure: 0.92,
            warmLightIntensity: 0.35,
            // Persistent neon rim for the software chapters
            neonRimIntensity: 1.0,
        },
        transitionProfile: {
            vision: {
                duration: 4.2,
                easing: 'cubicInOut',
                climaxPause: 1000,
                fog: { from: 0.02, to: 0.002 },
                // Nodes fade as the view opens up
                nodeOpacity: { from: 1, to: 0 },
                // Bloom retracts, neon rim fades
                bloomIntensity: { from: 1.2, to: 0.12 },
                neonRimIntensity: { from: 1.0, to: 0 },
                // FOV 50 → 38 is handled by CameraDirector via chapter presets
            },
            default: { duration: 2.5, easing: 'quadInOut', climaxPause: 700 },
        },
        modules: {
            grid: true,
            infiniteGrid: false,
            nodes: true,
            wireframe: true,
        },
        textSequence: [
            'C++ and computational geometry turned spatial intuition into systems.',
            'Raycasts, BVH, collisions, constraints, and scene updates become the working language.',
        ],
    },
    {
        id: 'mastery',
        label: 'Mastery',
        scene: 'software',
        cameraPreset: {
            position: [8.4, 3.1, 6.4],
            target: [10, 0.2, 0],
            fov: 46,
        },
        lightingMood: {
            background: '#080b0f',
            fogColor: '#080b0f',
            fogDensity: 0.012,
            bloomIntensity: 0.65,
            vignetteDarkness: 0.54,
            exposure: 0.9,
            warmLightIntensity: 0.2,
            neonRimIntensity: 0.55,
        },
        transitionProfile: {
            vision: {
                duration: 3.0,
                easing: 'expoOut',
                climaxPause: 800,
                fog: { from: 0.012, to: 0.002 },
                nodeOpacity: { from: 1, to: 0 },
                bloomIntensity: { from: 0.65, to: 0.12 },
                neonRimIntensity: { from: 0.55, to: 0 },
            },
            default: { duration: 2.2, easing: 'quadInOut', climaxPause: 600 },
        },
        modules: {
            grid: true,
            infiniteGrid: false,
            nodes: true,
            wireframe: false,
        },
        textSequence: [
            'The craft matures into performance-aware design: stable commands, predictable geometry, fast loading.',
            'Engineering discipline becomes software architecture.',
        ],
    },
    {
        id: 'vision',
        label: 'Vision',
        scene: 'software',
        cameraPreset: {
            position: [10, 5.8, 15],
            target: [10, 0, 0],
            fov: 38,
        },
        lightingMood: {
            background: '#05070a',
            fogColor: '#05070a',
            fogDensity: 0.002,
            bloomIntensity: 0.12,
            vignetteDarkness: 0.42,
            exposure: 0.86,
            warmLightIntensity: 0,
        },
        transitionProfile: {
            default: { duration: 2.6, easing: 'expoOut', climaxPause: 1000 },
        },
        modules: {
            grid: false,
            infiniteGrid: true,
            nodes: false,
            wireframe: false,
        },
        textSequence: [
            'The next chapter is clear: robust 3D systems, geometry engines, and tools that turn complexity into usable space.',
            'Explore mode is unlocked.',
        ],
    },
];

export const LIFE_CHAPTER_MAP = LIFE_CHAPTERS.reduce((accumulator, chapter) => {
    accumulator[chapter.id] = chapter;
    return accumulator;
}, {});

/**
 * Reads a chapter config by id.
 *
 * @param {string} id Chapter id.
 * @returns {object | undefined} Chapter config.
 */
export function getLifeChapterById(id) {
    return LIFE_CHAPTER_MAP[id];
}

/**
 * Reads a chapter index by id.
 *
 * @param {string} id Chapter id.
 * @returns {number} Chapter index.
 */
export function getLifeChapterIndex(id) {
    return LIFE_CHAPTERS.findIndex((chapter) => chapter.id === id);
}

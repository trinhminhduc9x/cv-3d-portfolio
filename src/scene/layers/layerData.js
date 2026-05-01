// TODO: Treat this as engine-level layer metadata, not CV content.
export const LAYER_SPACING = 5;

export const LAYER_DATA = [
    {
        id: 'mechanical',
        component: 'mechanical',
        position: [0, 0, 0],
    },
    {
        id: 'architecture',
        component: 'architecture',
        position: [LAYER_SPACING, 0, 0],
    },
    {
        id: 'software',
        component: 'software',
        position: [LAYER_SPACING * 2, 0, 0],
    },
];

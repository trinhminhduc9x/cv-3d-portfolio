import { LIFE_CHAPTERS } from './lifeChapters.config';

export const LIFE_CAMERA_PRESETS = LIFE_CHAPTERS.reduce((accumulator, chapter) => {
    accumulator[chapter.id] = chapter.cameraPreset;
    return accumulator;
}, {});

/**
 * Reads a camera preset for a life chapter.
 *
 * @param {string} chapterId Life chapter id.
 * @returns {object | undefined} Camera preset.
 */
export function getLifeCameraPreset(chapterId) {
    return LIFE_CAMERA_PRESETS[chapterId];
}

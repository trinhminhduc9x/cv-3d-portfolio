const baseUrl = import.meta.env.BASE_URL || '/';
const musicFileName = encodeURI('Kings & Queens.mp3');

export const BACKGROUND_MUSIC = {
    title: 'Kings & Queens',
    src: `${baseUrl}${musicFileName}`,
    volume: 0.42,
    fadeSeconds: 1.2,
    fallbackVolume: 0.14,
};

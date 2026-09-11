import { createAmbientScore } from './ambientScore';
import { connectAudioReactiveSource } from './audioReactiveEngine';

const DEFAULT_VOLUME = 0.38;
const DEFAULT_FADE_SECONDS = 1.2;

let sharedAudioContext = null;

function getSharedAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!sharedAudioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            sharedAudioContext = new AudioCtx();
        }
    }
    return sharedAudioContext;
}

function createFileMusic({ src, volume = DEFAULT_VOLUME, fadeSeconds = DEFAULT_FADE_SECONDS }) {
    if (typeof window === 'undefined' || !src) {
        return null;
    }

    const audio = new Audio(src);
    let fadeFrame = null;
    let connected = false;

    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    audio.crossOrigin = 'anonymous';

    const cancelFade = () => {
        if (fadeFrame) {
            window.cancelAnimationFrame(fadeFrame);
            fadeFrame = null;
        }
    };

    const fadeTo = (targetVolume, onComplete) => {
        cancelFade();

        const fromVolume = audio.volume;
        const startTime = window.performance.now();
        const duration = Math.max(fadeSeconds * 1000, 1);

        const update = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            audio.volume = fromVolume + ((targetVolume - fromVolume) * progress);

            if (progress < 1) {
                fadeFrame = window.requestAnimationFrame(update);
                return;
            }

            fadeFrame = null;
            onComplete?.();
        };

        fadeFrame = window.requestAnimationFrame(update);
    };

    return {
        async start() {
            const ctx = getSharedAudioContext();
            if (ctx && ctx.state === 'suspended') {
                await ctx.resume().catch(() => {});
            }

            if (ctx && !connected) {
                try {
                    const sourceNode = ctx.createMediaElementSource(audio);
                    sourceNode.connect(ctx.destination);
                    connectAudioReactiveSource(sourceNode, ctx);
                    connected = true;
                } catch {
                    // Fallback to standard audio element if already connected
                }
            }

            await audio.play();
            fadeTo(volume);
        },

        stop() {
            fadeTo(0, () => audio.pause());
        },

        dispose() {
            cancelFade();
            audio.pause();
            audio.removeAttribute('src');
            audio.load();
        },
    };
}

export function createBackgroundMusic(config) {
    const fileMusic = createFileMusic(config);
    let activeMusic = fileMusic;

    return {
        async start() {
            if (activeMusic) {
                try {
                    await activeMusic.start();
                    return;
                } catch (error) {
                    activeMusic.dispose();
                    activeMusic = null;

                    const fallbackMusic = createAmbientScore({ volume: config.fallbackVolume });
                    if (!fallbackMusic) {
                        throw error;
                    }

                    activeMusic = fallbackMusic;
                }
            }

            await activeMusic?.start();
        },

        stop() {
            activeMusic?.stop();
        },

        dispose() {
            activeMusic?.dispose();
        },
    };
}

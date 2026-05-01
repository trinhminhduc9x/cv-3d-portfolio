/**
 * Clamps a number to the normalized timeline range.
 *
 * @param {number} value Input value.
 * @returns {number} Value clamped between 0 and 1.
 */
export function clamp01(value) {
    return Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), 1);
}

/**
 * Cubic ease-in-out curve.
 *
 * @param {number} t Normalized progress.
 * @returns {number} Eased progress.
 */
export function cubicInOut(t) {
    const value = clamp01(t);
    return value < 0.5
        ? 4 * value * value * value
        : 1 - ((-2 * value + 2) ** 3) / 2;
}

/**
 * Quadratic ease-in-out curve.
 *
 * @param {number} t Normalized progress.
 * @returns {number} Eased progress.
 */
export function quadInOut(t) {
    const value = clamp01(t);
    return value < 0.5
        ? 2 * value * value
        : 1 - ((-2 * value + 2) ** 2) / 2;
}

/**
 * Exponential ease-out curve.
 *
 * @param {number} t Normalized progress.
 * @returns {number} Eased progress.
 */
export function expoOut(t) {
    const value = clamp01(t);
    return value === 1 ? 1 : 1 - 2 ** (-10 * value);
}

export const EASING = {
    cubicInOut,
    quadInOut,
    expoOut,
    linear: clamp01,
};

/**
 * Normalized animation timeline for cinematic sequencing.
 */
export class AnimationTimelineSystem {
    /**
     * @param {number} duration Timeline duration in seconds.
     * @param {object} options Timeline options.
     * @param {(t:number)=>number} options.easing Easing function.
     * @param {(state:object)=>void} options.onUpdate Per-frame update callback.
     * @param {(state:object)=>void} options.onComplete Completion callback.
     */
    constructor(duration = 1, options = {}) {
        this.duration = Math.max(duration, 0.0001);
        this.easing = options.easing || EASING.linear;
        this.onUpdate = options.onUpdate || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.clock = 0;
        this.isPlaying = false;
        this.isComplete = false;
        this.keyframes = [];
        this.firedKeyframes = new Set();
    }

    /**
     * Registers a keyframe callback at normalized time.
     *
     * @param {number} timeNormalized Keyframe time between 0 and 1.
     * @param {(state:object)=>void} callback Callback invoked when reached.
     * @returns {AnimationTimelineSystem} This timeline.
     */
    registerKeyframe(timeNormalized, callback) {
        this.keyframes.push({
            id: `${clamp01(timeNormalized)}:${this.keyframes.length}`,
            time: clamp01(timeNormalized),
            callback,
        });
        this.keyframes.sort((a, b) => a.time - b.time);
        return this;
    }

    /**
     * Starts timeline playback from the current clock.
     *
     * @returns {AnimationTimelineSystem} This timeline.
     */
    play() {
        this.isPlaying = true;
        this.isComplete = false;
        return this;
    }

    /**
     * Stops timeline playback.
     *
     * @returns {AnimationTimelineSystem} This timeline.
     */
    stop() {
        this.isPlaying = false;
        return this;
    }

    /**
     * Resets timeline state to the beginning.
     *
     * @returns {AnimationTimelineSystem} This timeline.
     */
    reset() {
        this.clock = 0;
        this.isPlaying = false;
        this.isComplete = false;
        this.firedKeyframes.clear();
        return this;
    }

    /**
     * Updates internal clock and invokes due callbacks.
     *
     * @param {number} delta Delta time in seconds.
     * @returns {object} Timeline state.
     */
    update(delta) {
        if (this.isPlaying) {
            this.clock = Math.min(this.clock + Math.max(delta, 0), this.duration);
        }

        const progress = this.normalized;
        const eased = this.easing(progress);
        const state = {
            clock: this.clock,
            duration: this.duration,
            progress,
            normalized: progress,
            eased,
            playing: this.isPlaying,
            complete: this.isComplete,
        };

        if (this.isPlaying) {
            this.keyframes.forEach((keyframe) => {
                if (progress >= keyframe.time && !this.firedKeyframes.has(keyframe.id)) {
                    this.firedKeyframes.add(keyframe.id);
                    keyframe.callback(state);
                }
            });

            this.onUpdate(state);

            if (progress >= 1 && !this.isComplete) {
                this.isComplete = true;
                this.isPlaying = false;
                this.onComplete({ ...state, complete: true, playing: false });
            }
        }

        return state;
    }

    /**
     * Returns normalized progress from 0 to 1.
     *
     * @returns {number} Normalized progress.
     */
    get normalized() {
        return clamp01(this.clock / this.duration);
    }

    /**
     * Backward-compatible alias for old callers.
     *
     * @returns {AnimationTimelineSystem} This timeline.
     */
    start() {
        this.reset();
        return this.play();
    }

    /**
     * Backward-compatible progress getter.
     *
     * @returns {number} Normalized progress.
     */
    get progress() {
        return this.normalized;
    }

    /**
     * Backward-compatible playing getter.
     *
     * @returns {boolean} Whether the timeline is playing.
     */
    get playing() {
        return this.isPlaying;
    }
}

/**
 * Factory wrapper kept for existing engine callers.
 *
 * @param {object} options Timeline options.
 * @returns {AnimationTimelineSystem} Timeline instance.
 */
export function createAnimationTimelineSystem(options = {}) {
    const timeline = new AnimationTimelineSystem(options.duration, {
        easing: options.easing,
        onUpdate: options.onUpdate,
        onComplete: options.onComplete,
    });

    return timeline;
}

export default AnimationTimelineSystem;

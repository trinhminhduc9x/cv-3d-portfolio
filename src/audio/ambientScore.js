const DEFAULT_VOLUME = 0.16;
const FADE_IN_SECONDS = 1.4;
const FADE_OUT_SECONDS = 0.5;

const CHORDS = [
    [82.41, 123.47, 164.81, 246.94],
    [73.42, 110.0, 146.83, 220.0],
    [92.5, 138.59, 185.0, 277.18],
    [61.74, 98.0, 164.81, 246.94],
];

function getAudioContextConstructor() {
    return window.AudioContext || window.webkitAudioContext;
}

function createLayer(context, destination, frequency, index) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = index % 2 === 0 ? 'sine' : 'triangle';
    oscillator.frequency.value = frequency;
    oscillator.detune.value = (index - 1.5) * 4;
    gain.gain.value = index === 0 ? 0.09 : 0.045;

    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start();

    return { oscillator, gain };
}

function scheduleChord(context, layers, chordIndex) {
    const chord = CHORDS[chordIndex % CHORDS.length];
    const now = context.currentTime;

    layers.forEach((layer, index) => {
        const frequency = chord[index % chord.length];
        layer.oscillator.frequency.cancelScheduledValues(now);
        layer.oscillator.frequency.setTargetAtTime(frequency, now, 1.1);
        layer.gain.gain.cancelScheduledValues(now);
        layer.gain.gain.setTargetAtTime(index === 0 ? 0.09 : 0.045, now, 1.2);
    });
}

export function canPlayAmbientScore() {
    return typeof window !== 'undefined' && Boolean(getAudioContextConstructor());
}

export function createAmbientScore({ volume = DEFAULT_VOLUME } = {}) {
    if (!canPlayAmbientScore()) {
        return null;
    }

    const AudioContextConstructor = getAudioContextConstructor();
    const context = new AudioContextConstructor();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const delay = context.createDelay(5);
    const feedback = context.createGain();
    const delayWet = context.createGain();
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();

    master.gain.value = 0.0001;
    filter.type = 'lowpass';
    filter.frequency.value = 620;
    filter.Q.value = 0.55;
    delay.delayTime.value = 0.42;
    feedback.gain.value = 0.22;
    delayWet.gain.value = 0.18;
    lfo.frequency.value = 0.035;
    lfoGain.gain.value = 280;

    filter.connect(master);
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(delayWet);
    delayWet.connect(master);
    master.connect(context.destination);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const layers = CHORDS[0].map((frequency, index) => createLayer(context, filter, frequency, index));
    let chordIndex = 0;
    const chordTimer = window.setInterval(() => {
        chordIndex += 1;
        scheduleChord(context, layers, chordIndex);
    }, 5600);

    return {
        async start() {
            if (context.state === 'suspended') {
                await context.resume();
            }

            const now = context.currentTime;
            master.gain.cancelScheduledValues(now);
            master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
            master.gain.linearRampToValueAtTime(volume, now + FADE_IN_SECONDS);
        },

        stop() {
            const now = context.currentTime;
            master.gain.cancelScheduledValues(now);
            master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
            master.gain.linearRampToValueAtTime(0.0001, now + FADE_OUT_SECONDS);
        },

        dispose() {
            window.clearInterval(chordTimer);
            layers.forEach(({ oscillator }) => oscillator.stop());
            lfo.stop();
            context.close();
        },
    };
}

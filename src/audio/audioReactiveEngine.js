let analyserNode = null;
let dataArray = null;

export function connectAudioReactiveSource(sourceNode, ctx) {
    if (!ctx) return;
    if (!analyserNode) {
        analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 128;
        analyserNode.smoothingTimeConstant = 0.8;
        dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    }
    try {
        sourceNode.connect(analyserNode);
    } catch {
        // Silently fail if already connected
    }
}

export function getAudioReactiveData(clockTime = 0) {
    if (!analyserNode || !dataArray) {
        // Subtle ambient organic fallback pulse when music is off
        const t = clockTime * 2.0;
        const fakeBass = Math.max(0, Math.sin(t * 1.5)) * 0.15;
        const fakeMid = Math.max(0, Math.cos(t * 2.2)) * 0.12;
        const fakeTreble = Math.max(0, Math.sin(t * 3.7)) * 0.08;
        return {
            bass: fakeBass,
            mid: fakeMid,
            treble: fakeTreble,
            energy: (fakeBass + fakeMid + fakeTreble) / 3,
        };
    }

    analyserNode.getByteFrequencyData(dataArray);

    const binCount = dataArray.length;
    const bassBins = Math.floor(binCount * 0.15);
    const midBins = Math.floor(binCount * 0.5);

    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;

    for (let i = 0; i < bassBins; i++) {
        bassSum += dataArray[i];
    }
    for (let i = bassBins; i < midBins; i++) {
        midSum += dataArray[i];
    }
    for (let i = midBins; i < binCount; i++) {
        trebleSum += dataArray[i];
    }

    const bass = (bassSum / (bassBins || 1)) / 255;
    const mid = (midSum / ((midBins - bassBins) || 1)) / 255;
    const treble = (trebleSum / ((binCount - midBins) || 1)) / 255;
    const energy = (bass * 0.5 + mid * 0.3 + treble * 0.2);

    return { bass, mid, treble, energy };
}

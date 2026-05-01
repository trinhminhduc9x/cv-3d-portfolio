const LOW_END_CORES = 4;
const LOW_END_MEMORY_GB = 4;

function readNavigatorProfile() {
    if (typeof navigator === 'undefined') {
        return {
            cores: LOW_END_CORES,
            memory: LOW_END_MEMORY_GB,
            saveData: false,
            mobileViewport: false,
        };
    }

    return {
        cores: navigator.hardwareConcurrency || LOW_END_CORES,
        memory: navigator.deviceMemory || LOW_END_MEMORY_GB,
        saveData: Boolean(navigator.connection?.saveData),
        mobileViewport: typeof window !== 'undefined' && window.innerWidth < 768,
    };
}

export function getPerformanceProfile() {
    const profile = readNavigatorProfile();
    const lowEnd = (
        profile.saveData ||
        profile.mobileViewport ||
        profile.cores <= LOW_END_CORES ||
        profile.memory <= LOW_END_MEMORY_GB
    );

    return {
        tier: lowEnd ? 'low' : 'high',
        lowEnd,
        shadowMapSize: lowEnd ? 1024 : 2048,
        contactShadowScale: lowEnd ? 9 : 15,
        contactShadowBlur: lowEnd ? 1 : 2,
        maxDevicePixelRatio: lowEnd ? 1.25 : 1.75,
        lazyUnloadDelay: lowEnd ? 300 : 1400,
        showRenderStats: import.meta.env.DEV,
    };
}

export function usePerformanceProfile() {
    return getPerformanceProfile();
}

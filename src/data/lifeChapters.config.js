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
            {
                vi: 'Mỗi sự nghiệp vĩ đại đều có hình dạng riêng — nhìn từ gần chỉ thấy bước tiếp theo, nhìn từ xa mới thấy toàn bộ hành trình.',
                en: 'Every great career has its own shape — up close you see only the next step; only from a distance does the full journey reveal itself.',
            },
            {
                vi: 'Con đường này đi qua thép, qua ánh sáng, rồi đến với code — cuộn xuống để thấy nó dần hiện ra.',
                en: 'This one moves through steel, through light, and into code — scroll to watch it unfold.',
            },
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
            {
                vi: 'Tất cả bắt đầu tại xưởng cơ khí — nơi sai số tính bằng phần nghìn milimet, nơi mỗi chi tiết phải chịu đựng sức nặng không khoan nhượng của thực tế.',
                en: 'Everything began on the workshop floor — where error is measured in thousandths of a millimeter and every part must bear the unforgiving weight of reality.',
            },
            {
                vi: 'Con tàu kia không chỉ là mô hình — đó là tượng đài của kỷ luật đầu tiên, nơi không gian 3D được hiểu bằng trách nhiệm chứ không phải thẩm mỹ.',
                en: 'That ship is not merely a model — it is a monument to first discipline, where 3D space was understood through accountability, not aesthetics.',
            },
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
            {
                vi: 'Rồi kiến trúc đến như một giác ngộ — khi hình học không còn chỉ phải đúng, mà phải đẹp, phải khiến người ta dừng lại và cảm nhận điều gì đó không thể gọi tên.',
                en: 'Then architecture arrived like an awakening — when geometry could no longer merely be correct, but had to be beautiful, had to make people stop and feel something nameless.',
            },
            {
                vi: 'Ánh sáng trở thành ngôn ngữ, bóng đổ trở thành ý nghĩa — và người kỹ sư lần đầu tiên học cách khiến không gian biết kể chuyện.',
                en: 'Light became language, shadow became meaning — and the engineer learned for the first time how to make space tell a story.',
            },
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
            {
                vi: 'Code đến như một ngọn lửa — C++ và hình học tính toán biến ba năm tư duy không gian thành những hệ thống sống, thở và di chuyển theo thời gian thực.',
                en: 'Code arrived like fire — C++ and computational geometry forged three years of spatial thinking into systems that live, breathe, and move in real time.',
            },
            {
                vi: 'Raycasts xuyên bóng tối, cây BVH phân tách thế giới, va chạm vang lên như sấm — đây là hạ tầng vô hình làm cho không gian 3D trở nên có thật dưới chân.',
                en: 'Raycasts pierce the dark, BVH trees split the world, collisions ring out like thunder — the invisible infrastructure that makes 3D space feel real beneath your feet.',
            },
        ],
        links: [
            {
                label: 'Play Cyber Runner 3D',
                url: 'https://tmducdev-source.github.io/cyber-runner-3d-game/',
                type: 'game',
            },
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
            {
                vi: 'Ngọn lửa không tắt — nó trở nên ổn định hơn. Ít thủ thuật, nhiều sự rõ ràng. Kiến trúc vững lại như đá, và code bắt đầu nói bằng sự im lặng có chủ ý.',
                en: 'The fire did not die — it steadied. Fewer tricks, more clarity. The architecture set like stone, and the code began to speak through deliberate silence.',
            },
            {
                vi: 'Kỷ luật kỹ thuật không biến mất khi trở thành phần mềm — nó trở thành nền móng mà mọi quyết định trong hệ thống đều phải trả lời.',
                en: 'Engineering discipline does not vanish when it becomes software — it becomes the bedrock that every decision in the system must answer to.',
            },
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
            {
                vi: 'Phía trước là khoảng không chưa được vẽ — engine hình học chờ được xây, không gian 3D chờ được thổi hồn, những công cụ chờ được rèn giũa bởi đôi tay đã qua lửa.',
                en: 'Ahead lies unmapped space — geometry engines waiting to be built, 3D worlds waiting to be given soul, tools waiting to be forged by hands that have been through fire.',
            },
            {
                vi: 'Màn hình đã mở. Thế giới này là của bạn.',
                en: 'The viewport is open. This world is yours.',
            },
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

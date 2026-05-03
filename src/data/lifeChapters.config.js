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
                vi: 'Mỗi sự nghiệp đều có hình dáng — con đường này hướng tới hệ thống thời gian thực, engine, công cụ, và đôi khi cả trò chơi trong tab trình duyệt.',
                en: 'Every career has a shape — this one bends toward real-time systems, engines, tools, and sometimes games living inside a browser tab.',
            },
            {
                vi: 'Cuộn xuống: từ thép và form mạn tàu, qua ánh sáng của visualization, rồi tới C++, WebSocket và không gian 3D phản hồi từng khung hình.',
                en: 'Scroll through it — from steel and ship hulls, through the light of visualization, into C++, WebSockets, and 3D that answers every frame.',
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
                vi: 'Tất cả bắt đầu tại xưởng — Cử nhân kỹ thuật tàu thủy: form mạn, ổn định, sức cản, kết cấu; sai số đo bằng phần nghìn milimet cùng toán và số áp dụng.',
                en: 'It began in the workshop — a B.Eng. in ship engineering: hulls, stability, resistance, structure; error in thousandths of a millimeter, with applied math and numerics.',
            },
            {
                vi: 'Mô hình tàu là bài tập kỷ luật: không gian 3D gắn với tải trọng, biên giới, trách nhiệm — trước khi engine hay game nào được viết.',
                en: 'The ship model was discipline: 3D space bound to load, boundaries, accountability — long before any engine or game code was written.',
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
                vi: 'Giai đoạn visualization: kiến trúc và nội thất thành khối đặt giữa khung hình — ánh sáng, máy ảnh, render; học cách khiến không gian thuyết phục người xem.',
                en: 'The visualization chapter — architecture and interiors staged as volumes; light, camera, rendering; learning to make space persuade the eye.',
            },
            {
                vi: 'Hình học không chỉ đúng — phải mời gọi. Nền tảng cho mọi pipeline thị giác và tư duy không gian trong công việc 3D sau này.',
                en: 'Geometry had to be not only correct but inviting — groundwork for every visual pipeline and spatial habit that followed.',
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
                vi: 'Code bùng lên — C++ và hình học tính toán; hệ 3D thời gian thực xử lý dữ liệu lớn, cập nhật trạng thái và tương tác tách lớp.',
                en: 'Code caught fire — C++ and computational geometry; real-time 3D at scale, layered data, state, and interaction.',
            },
            {
                vi: 'Phiên chạy qua WebSocket đồng bộ trạng thái; thế giới phẳng trong trình duyệt — WebGL và Three.js gặp vòng lặp game, va chạm, camera.',
                en: 'Sessions sync state over WebSockets; flat worlds run in the browser — WebGL and Three.js meet the loop, collisions, and camera.',
            },
        ],
        links: [
            {
                label: 'Play Cyber Runner 3D',
                url: 'https://tmducdev-source.github.io/cyber-runner-3d-game/',
                type: 'game',
            },
            {
                label: 'Profile & links',
                url: 'https://bit.ly/minhduc-profile',
                type: 'profile',
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
                vi: 'Lửa nguội thành hệ thống — kiến trúc module, validation, automation; sự kiện lan qua đồ thị phụ thuộc để khung cảnh 2D/3D không vỡ giữa chừng.',
                en: 'Fire cooled into systems — modular architecture, validation, automation; events rippling through dependency graphs so 2D/3D scenes stay coherent.',
            },
            {
                vi: 'Real-time 3D đầy đủ ý nghĩa từ 2023: ít mánh lới, nhiều độ tin cậy — kỷ luật kỹ thuật vẫn là nền mà mọi quyết định trong pipeline phải trả lời.',
                en: 'Full-weight real-time 3D from 2023 onward — fewer tricks, more trust; engineering discipline remains the bedrock every pipeline decision must answer to.',
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
                vi: 'Phía trước: engine và công cụ chưa đặt tên, multiplayer và không gian chưa vẽ hết — real-time, pipeline, và những vòng lặp còn chờ ai đó viết tiếp.',
                en: 'Ahead: unnamed engines and tools, unfinished multiplayer spaces — real-time, pipelined, loops still waiting for the next hand on the keyboard.',
            },
            {
                vi: 'Màn hình đã mở. Khung tiếp theo là của người xây nền và công cụ.',
                en: 'The viewport is open. The next frame belongs to whoever builds the foundation and the tools.',
            },
        ],
    },
];

/** Public profile and CV links — keep in sync with HOME/index.html. */
export const PORTFOLIO_PROFILE = {
    displayName: 'Trịnh Minh Đức',
    titleLine: 'Software Engineer · Real-Time Systems · 3D Graphics · Engine & Tools',
    eyebrow: 'Game Dev / Engine / Tools',
    location: 'Da Nang, Vietnam',
    phoneDisplay: '+84 975 514 667',
    phoneTel: '+84975514667',
    email: 'tmduc.dev@gmail.com',
    profileUrl: 'https://bit.ly/minhduc-profile',
    profileLabel: 'bit.ly/minhduc-profile',
    cvDownloadUrl:
        'https://drive.google.com/file/d/1t3d7xtGQSKnYM_iHsHQs6PsBugmzO-JW/view?usp=sharing',
};

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

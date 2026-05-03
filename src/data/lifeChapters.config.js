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
                vi: 'Trước khi có một dòng code — có ý chí. Trước khi có engine — có người quyết định leo lên. Hành trình này không dành cho kẻ đứng nhìn; nó được đúc bằng tay, khắc bằng đêm, và đốt cháy bằng những câu hỏi không chịu tắt.',
                en: 'Before a single line of code — there was will. Before an engine — there was one who decided to climb. This journey was not made for observers; it was cast by hand, carved through night, and fueled by questions that refused to die.',
            },
            {
                vi: 'Từ buồng máy tàu đến đỉnh real-time 3D, từ thép đến shader, từ bản vẽ kỹ thuật đến khung hình sống trong trình duyệt — đây là bản đồ của một người đã chiến đấu để hiểu, không chỉ để biết.',
                en: 'From the engine room of ships to the summit of real-time 3D, from steel to shaders, from technical blueprints to frames alive in the browser — this is the map of one who fought to understand, not merely to know.',
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
                vi: 'Lò rèn đầu tiên là xưởng thép — nơi hình học không tha thứ sai số, nơi vật lý phán xét từng quyết định. Kỹ thuật tàu thủy không dạy lý thuyết; nó ép người học đứng trước thực thể nặng nghìn tấn và chứng minh mình đúng.',
                en: 'The first forge was a steel workshop — where geometry forgave no error, where physics judged every decision. Naval engineering did not teach theory; it forced the student to stand before a thousand-ton mass and prove their calculations true.',
            },
            {
                vi: 'Bài toán ổn định, sức cản, kết cấu — không phải bài tập, mà là thử thách sinh tử của tư duy. Từ đây, tư duy 3D được rèn không bằng cảm hứng, mà bằng trách nhiệm trước từng đường cong của thân tàu.',
                en: 'Stability, resistance, structure — not exercises, but trials where thinking either held or broke. Here, 3D thinking was forged not by inspiration, but by accountability to every curve of the hull.',
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
                vi: 'Rồi ánh sáng mở một mặt trận khác — visualization là ngôn ngữ thứ hai của người làm chủ không gian. Kiến trúc, nội thất, môi trường: mỗi khung hình là một tuyên ngôn về ánh sáng, vật liệu và ý chí.',
                en: 'Then light opened another front — visualization was the second language of one who commanded space. Architecture, interiors, environments: every frame was a declaration of light, material, and intent.',
            },
            {
                vi: 'Từ đây, hình học mang thêm nhiệm vụ: không chỉ đúng, mà phải thuyết phục. Mắt học cách đọc lực — cách không gian kéo người xem, cách bóng tối xây chiều sâu — nền móng cho mọi pipeline 3D phía trước.',
                en: 'From here, geometry carried a second duty: not only correct, but convincing. The eye learned to read force — how space draws the viewer, how shadow builds depth — the foundation beneath every 3D pipeline to come.',
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
                vi: 'Lò rèn thứ hai bùng lên từ code — C++, hình học tính toán, vòng lặp real-time. Không còn là thế giới tĩnh của bản vẽ; đây là chiến trường nơi dữ liệu, trạng thái và vật lý phải vận hành cùng nhau trong từng mili-giây.',
                en: 'The second forge erupted from code — C++, computational geometry, real-time loops. No longer the static world of blueprints; this was a battlefield where data, state, and physics had to run together within every millisecond.',
            },
            {
                vi: 'WebSocket đồng bộ phiên chiến; WebGL và Three.js dựng những thế giới sống trong trình duyệt. Vòng lặp game, va chạm, camera — không phải đỉnh leo một lần, mà leo lại mỗi ngày cho đến khi hiểu tận cùng.',
                en: 'WebSockets synchronized the battle session; WebGL and Three.js raised living worlds inside the browser. The game loop, collisions, camera — not peaks climbed once, but climbed again each day until understood to their core.',
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
                vi: 'Ngọn lửa cần được kiềm chế để cháy lâu hơn — module, validation, automation, dependency graph: kỷ luật biến cảm hứng thành kiến trúc. Không phải code chạy được, mà code đứng vững trước thời gian.',
                en: 'Fire must be disciplined to burn longer — modules, validation, automation, dependency graphs: the craft of turning inspiration into architecture. Not code that runs, but code that stands against time.',
            },
            {
                vi: 'Đến đây, real-time 3D không còn là mục tiêu — nó trở thành tiêu chuẩn: mỗi pipeline phải chịu được sức nặng của thực tế, mỗi quyết định kỹ thuật phải đứng vững trước tương lai. Thép tốt không kêu to.',
                en: 'By now, real-time 3D was no longer a goal — it became the standard: every pipeline must bear the weight of reality, every engineering decision must stand against the future. Good steel does not ring loud.',
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
                vi: 'Phía trước là những engine chưa có tên, những công cụ chưa thành hình, những thế giới multiplayer chưa vẽ xong — không phải khoảng trống đáng sợ, mà là vương quốc chưa được chinh phục, đang chờ người dám bước vào.',
                en: 'Ahead are nameless engines, unbuilt tools, unfinished multiplayer worlds — not voids to fear, but unconquered kingdoms waiting for one who dares to enter.',
            },
            {
                vi: 'Viewport đã mở. Không có điểm kết — chỉ có điểm tiếp theo, cao hơn, sâu hơn, rộng hơn. Khung hình tiếp theo thuộc về người học không nghỉ, rèn không ngại, và xây nền móng đủ vững để chống đỡ cả những thế giới chưa tồn tại.',
                en: 'The viewport is open. There is no endpoint — only the next, higher, deeper, wider. The next frame belongs to one who learns without rest, forges without fear, and builds foundations strong enough to hold worlds that do not yet exist.',
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

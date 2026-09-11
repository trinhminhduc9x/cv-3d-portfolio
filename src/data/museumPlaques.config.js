/**
 * Museum plaque content, keyed by physical exhibit zone id (matches
 * `MUSEUM_ZONES` in `museumLayout.config.js`) — not by chapter id, since the
 * `software` zone hosts three chapters behind one physical plaque.
 *
 * Each text field is a `{ vi, en }` bilingual pair, same shape as
 * `lifeChapters.config.js`'s `textSequence` entries, so `MuseumPlaque` can
 * reuse `TextRevealSystem`'s primary/secondary bilingual rendering pattern.
 */
export const MUSEUM_PLAQUES = {
    mechanical: {
        exhibitNumber: '01',
        title: {
            vi: 'Kết cấu thép & động lực học biển',
            en: 'Structural steel & marine dynamics',
        },
        dateRange: '2017–2020',
        material: {
            vi: 'Thép kết cấu tàu · Bản vẽ kỹ thuật hải quân',
            en: 'Structural steel · Naval technical drawings',
        },
        curatorialNote: {
            vi: 'Nơi hình học đối mặt vật lý — mỗi đường cong thân tàu là một phép tính không được phép sai.',
            en: 'Where geometry met physics — every hull curve was a calculation with no room for error.',
        },
    },
    architecture: {
        exhibitNumber: '02',
        title: {
            vi: 'Ánh sáng & hình học không gian',
            en: 'Light & spatial geometry',
        },
        dateRange: '2020–2022',
        material: {
            vi: 'Ánh sáng vật lý (PBR) · Vật liệu kiến trúc số',
            en: 'Physically-based lighting · Digital architectural materials',
        },
        curatorialNote: {
            vi: 'Ánh sáng không chỉ chiếu sáng — nó thuyết phục. Không gian học cách kéo ánh nhìn.',
            en: "Light didn't just illuminate — it persuaded. Space learned to draw the eye.",
        },
    },
    software: {
        exhibitNumber: '03',
        title: {
            vi: 'Hệ sinh thái tính toán thời gian thực',
            en: 'Real-time computational ecosystem',
        },
        dateRange: '2022–nay / 2022–present',
        material: {
            vi: 'WebGL · Three.js · Vòng lặp thời gian thực',
            en: 'WebGL · Three.js · Real-time render loop',
        },
        curatorialNote: {
            vi: 'Từ khung hình tĩnh đến thế giới sống trong trình duyệt — kỷ luật biến cảm hứng thành kiến trúc bền vững.',
            en: 'From static frames to worlds alive in the browser — discipline turned inspiration into architecture built to last.',
        },
    },
};

export function getMuseumPlaque(zoneId) {
    return MUSEUM_PLAQUES[zoneId] || null;
}

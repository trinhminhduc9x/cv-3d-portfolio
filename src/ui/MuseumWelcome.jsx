/* eslint-disable react/prop-types */
import { PORTFOLIO_PROFILE } from '../data/narrative.config';

const COPY = {
    vi: {
        eyebrow: 'Chào mừng',
        title: `Bảo tàng ${PORTFOLIO_PROFILE.displayName}`,
        body: 'Ba hiện vật, ba giai đoạn sự nghiệp — bước vào và tự do đi lại giữa các gian trưng bày.',
        controls: 'Di chuyển: WASD · Nhìn quanh: chuột (sau khi khóa con trỏ)',
        enter: 'Bước vào',
        cancel: 'Để sau',
    },
    en: {
        eyebrow: 'Welcome',
        title: `${PORTFOLIO_PROFILE.displayName}'s Museum`,
        body: 'Three exhibits, three chapters of a career — step in and walk freely between them.',
        controls: 'Move: WASD · Look around: mouse (after clicking to lock)',
        enter: 'Enter',
        cancel: 'Not now',
    },
};

/**
 * Full-screen welcome overlay shown before free-roam actually activates —
 * establishes the "stepping into a museum" framing (ADR-0002) rather than
 * dropping the visitor straight into free-roam on a single button click.
 *
 * @param {object} props Welcome props.
 * @param {'vi'|'en'} props.lang Display language.
 * @param {() => void} props.onEnter Called when the visitor confirms entry.
 * @param {() => void} props.onCancel Called when the visitor backs out.
 * @returns {JSX.Element} Welcome overlay.
 */
function MuseumWelcome({ lang = 'vi', onEnter, onCancel }) {
    const copy = COPY[lang] || COPY.vi;

    return (
        <div
            role="dialog"
            aria-label={copy.title}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(5, 7, 10, 0.82)',
                fontFamily: 'Inter, system-ui, sans-serif',
            }}
        >
            <div
                style={{
                    width: 'min(440px, calc(100vw - 48px))',
                    padding: '32px 28px',
                    borderRadius: 10,
                    background: 'rgba(20, 15, 12, 0.92)',
                    border: '1px solid rgba(255, 179, 122, 0.28)',
                    color: '#ffffff',
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        fontSize: 11,
                        letterSpacing: 3,
                        textTransform: 'uppercase',
                        color: 'rgba(255, 179, 122, 0.78)',
                        marginBottom: 10,
                    }}
                >
                    {copy.eyebrow}
                </div>
                <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 700 }}>
                    {copy.title}
                </h2>
                <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.82)' }}>
                    {copy.body}
                </p>
                <p style={{ margin: '0 0 24px', fontSize: 12, color: 'rgba(135, 206, 235, 0.75)' }}>
                    {copy.controls}
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '10px 16px',
                            borderRadius: 6,
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            background: 'transparent',
                            color: 'rgba(255, 255, 255, 0.75)',
                            cursor: 'pointer',
                        }}
                    >
                        {copy.cancel}
                    </button>
                    <button
                        type="button"
                        onClick={onEnter}
                        style={{
                            padding: '10px 20px',
                            borderRadius: 6,
                            border: '1px solid rgba(255, 179, 122, 0.5)',
                            background: '#a8531f',
                            color: '#ffffff',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        {copy.enter}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MuseumWelcome;

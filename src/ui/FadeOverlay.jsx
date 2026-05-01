/* eslint-disable react/prop-types */
/**
 * Fullscreen transition overlay for cinematic chapter fades.
 *
 * @param {object} props Overlay props.
 * @param {number} props.opacity Overlay opacity.
 * @returns {JSX.Element} Fade overlay.
 */
function FadeOverlay({ opacity = 0 }) {
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                background: '#030507',
                opacity,
                pointerEvents: 'none',
                transition: 'opacity 120ms linear',
                zIndex: 13,
            }}
        />
    );
}

export default FadeOverlay;

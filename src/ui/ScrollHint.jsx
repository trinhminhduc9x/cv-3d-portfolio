import { useState, useEffect } from 'react';

function ScrollHint() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const hide = () => setVisible(false);
        const timer = setTimeout(hide, 4000);
        window.addEventListener('wheel', hide, { once: true });
        return () => {
            clearTimeout(timer);
            window.removeEventListener('wheel', hide);
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            bottom: 82,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            zIndex: 10,
        }}>
            <span style={{
                fontSize: 10,
                color: 'rgba(135, 206, 235, 0.45)',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '2px',
                textTransform: 'uppercase',
            }}>
                Scroll to navigate
            </span>
            <span style={{
                fontSize: 16,
                color: 'rgba(135, 206, 235, 0.4)',
                animation: 'scrollBounce 1.6s ease-in-out infinite',
                display: 'block',
            }}>
                ↓
            </span>
        </div>
    );
}

export default ScrollHint;

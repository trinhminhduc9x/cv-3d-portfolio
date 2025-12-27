import { useProgress } from '@react-three/drei';
import { useState, useEffect } from 'react';

function LoadingScreen() {
    const { progress, active, total } = useProgress();
    const [visible, setVisible] = useState(true);

    const loaded = !active && (progress >= 100 || total === 0);

    useEffect(() => {
        if (!loaded) return;
        const timer = setTimeout(() => setVisible(false), 600);
        return () => clearTimeout(timer);
    }, [loaded]);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: '#0f1419',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            opacity: loaded ? 0 : 1,
            transition: 'opacity 0.6s ease',
            pointerEvents: loaded ? 'none' : 'auto',
        }}>
            <div style={{
                fontFamily: 'system-ui, sans-serif',
                color: '#87ceeb',
                fontSize: 13,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: 24,
                opacity: 0.8,
            }}>
                Loading
            </div>

            <div style={{
                width: 200,
                height: 2,
                background: 'rgba(135, 206, 235, 0.15)',
                borderRadius: 2,
                overflow: 'hidden',
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #4a90e2, #87ceeb)',
                    transition: 'width 0.3s ease',
                    boxShadow: '0 0 10px rgba(135, 206, 235, 0.7)',
                }} />
            </div>

            <div style={{
                marginTop: 12,
                fontSize: 11,
                color: 'rgba(135, 206, 235, 0.45)',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '1px',
            }}>
                {Math.round(progress)}%
            </div>
        </div>
    );
}

export default LoadingScreen;

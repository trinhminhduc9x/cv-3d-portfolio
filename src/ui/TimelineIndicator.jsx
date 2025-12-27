import { useState } from 'react';

const LABELS = ['Mechanical', 'Architecture', 'Software'];

function TimelineIndicator({ index, onNavigate }) {
    const [hovered, setHovered] = useState(null);

    return (
        <div style={{
            position: 'fixed',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 20,
            zIndex: 10,
        }}>
            {LABELS.map((label, i) => (
                <div
                    key={i}
                    onClick={() => onNavigate(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 7,
                        cursor: 'pointer',
                        padding: '4px 2px',
                    }}
                >
                    <div style={{
                        width: i === index ? 28 : (hovered === i ? 14 : 8),
                        height: 8,
                        borderRadius: 4,
                        background: i === index
                            ? '#87ceeb'
                            : hovered === i
                                ? 'rgba(135, 206, 235, 0.45)'
                                : 'rgba(135, 206, 235, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: i === index ? '0 0 12px rgba(135, 206, 235, 0.55)' : 'none',
                    }} />
                    <span style={{
                        fontSize: 10,
                        color: i === index
                            ? 'rgba(135, 206, 235, 0.9)'
                            : hovered === i
                                ? 'rgba(135, 206, 235, 0.6)'
                                : 'rgba(255, 255, 255, 0.22)',
                        fontFamily: 'system-ui, sans-serif',
                        transition: 'color 0.3s ease',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                    }}>
                        {label}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default TimelineIndicator;

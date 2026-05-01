import { useState } from 'react';

const DEFAULT_ITEMS = [
    { id: 'mechanical', label: 'Mechanical' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'software', label: 'Software' },
];

function TimelineIndicator({ index, onNavigate, items = DEFAULT_ITEMS }) {
    const [hovered, setHovered] = useState(null);

    const handleKeyDown = (event, itemIndex) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            onNavigate(Math.min(itemIndex + 1, items.length - 1));
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            onNavigate(Math.max(itemIndex - 1, 0));
        }

        if (event.key === 'Home') {
            event.preventDefault();
            onNavigate(0);
        }

        if (event.key === 'End') {
            event.preventDefault();
            onNavigate(items.length - 1);
        }
    };

    return (
        <nav
            aria-label="Career timeline"
            role="tablist"
            style={{
                position: 'fixed',
                bottom: 30,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                zIndex: 10,
            }}
        >
            {items.map((item, i) => (
                <button
                    key={item.id || item.label}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show ${item.label} chapter`}
                    tabIndex={i === index ? 0 : -1}
                    onClick={() => onNavigate(i)}
                    onKeyDown={(event) => handleKeyDown(event, i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 7,
                        cursor: 'pointer',
                        padding: '4px 2px',
                        background: 'transparent',
                        border: 'none',
                        outlineOffset: 6,
                    }}
                >
                    <span
                        aria-hidden="true"
                        style={{
                            width: i === index ? 28 : (hovered === i ? 14 : 8),
                            height: 8,
                            borderRadius: 4,
                            display: 'block',
                            background: i === index
                                ? '#87ceeb'
                                : hovered === i
                                    ? 'rgba(135, 206, 235, 0.45)'
                                    : 'rgba(135, 206, 235, 0.2)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: i === index ? '0 0 12px rgba(135, 206, 235, 0.55)' : 'none',
                        }}
                    />
                    <span
                        style={{
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
                        }}
                    >
                        {item.label}
                    </span>
                </button>
            ))}
        </nav>
    );
}

export default TimelineIndicator;

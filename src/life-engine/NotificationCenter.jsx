import {
    createContext, useCallback, useContext, useMemo, useRef, useState,
} from 'react';

const NotificationContext = createContext(null);

const DEDUP_WINDOW_MS = 500;
const DEFAULT_DURATION_MS = 4000;
let nextId = 0;

/**
 * Site-wide toast provider (ADR-0003). Wraps `SceneRoot`'s overlay tree so
 * any descendant can call `useNotifications().notify(...)` without prop
 * drilling — a new Context-based pattern for this codebase, justified by
 * multiple unrelated components (intro gate, zone-entry detection, language
 * toggle) needing to trigger toasts.
 *
 * @param {object} props Provider props.
 * @param {React.ReactNode} props.children Wrapped subtree.
 * @returns {JSX.Element} Context provider.
 */
export function NotificationProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const lastMessageRef = useRef({ text: null, at: 0 });

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    /**
     * Queues a toast.
     *
     * @param {object} options Notification options.
     * @param {'critical'|'normal'} options.priority Visual/dismiss treatment.
     * @param {{vi: string, en: string}|string} options.message Bilingual or plain message.
     * @param {number} [options.duration] Auto-dismiss delay in ms (normal only).
     */
    const notify = useCallback(({ priority = 'normal', message, duration = DEFAULT_DURATION_MS }) => {
        const text = typeof message === 'string' ? message : JSON.stringify(message);
        const now = Date.now();

        if (text === lastMessageRef.current.text && now - lastMessageRef.current.at < DEDUP_WINDOW_MS) {
            return;
        }
        lastMessageRef.current = { text, at: now };

        nextId += 1;
        const id = nextId;
        setToasts((prev) => [...prev, { id, priority, message, duration }]);

        if (priority !== 'critical') {
            window.setTimeout(() => dismiss(id), duration);
        }
    }, [dismiss]);

    const value = useMemo(() => ({ notify, dismiss, toasts }), [notify, dismiss, toasts]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

/**
 * Hook for triggering toasts from anywhere inside `NotificationProvider`.
 *
 * @returns {{notify: Function, dismiss: Function, toasts: Array}} Notification API.
 */
export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

function resolveText(message, lang) {
    if (typeof message === 'string') {
        return message;
    }
    return message[lang] || message.vi || message.en;
}

/**
 * Renders queued toasts — critical ones center-screen (explicit dismiss),
 * normal ones stacked top-right (auto-dismiss, handled by the provider).
 *
 * @param {object} props Tray props.
 * @param {'vi'|'en'} props.lang Display language.
 * @returns {JSX.Element} Toast tray.
 */
export function NotificationTray({ lang = 'vi' }) {
    const { toasts, dismiss } = useNotifications();
    const normalToasts = toasts.filter((toast) => toast.priority !== 'critical');
    const criticalToast = toasts.find((toast) => toast.priority === 'critical');

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 30,
                    zIndex: 25,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    pointerEvents: 'none',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                {normalToasts.map((toast) => (
                    <div
                        key={toast.id}
                        role="status"
                        aria-live="polite"
                        style={{
                            padding: '10px 14px',
                            borderRadius: 6,
                            background: 'rgba(20, 15, 12, 0.9)',
                            border: '1px solid rgba(255, 179, 122, 0.28)',
                            color: '#ffffff',
                            fontSize: 13,
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                        }}
                    >
                        {resolveText(toast.message, lang)}
                    </div>
                ))}
            </div>

            {criticalToast && (
                <div
                    role="alertdialog"
                    aria-live="assertive"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 26,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(5, 7, 10, 0.55)',
                        fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                    onClick={() => dismiss(criticalToast.id)}
                >
                    <div
                        style={{
                            padding: '24px 32px',
                            borderRadius: 10,
                            background: 'rgba(20, 15, 12, 0.94)',
                            border: '1px solid rgba(255, 179, 122, 0.4)',
                            color: '#ffffff',
                            fontSize: 18,
                            fontWeight: 600,
                            textAlign: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        {resolveText(criticalToast.message, lang)}
                    </div>
                </div>
            )}
        </>
    );
}

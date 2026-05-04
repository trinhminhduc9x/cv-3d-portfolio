import { useEffect, useRef, useState } from 'react';

import { createBackgroundMusic } from '../audio/backgroundMusic';
import { BACKGROUND_MUSIC } from '../data/music.config';

function MusicToggle() {
    const scoreRef = useRef(null);
    const [status, setStatus] = useState('idle');
    const playing = status === 'playing';
    const busy = status === 'starting';

    useEffect(() => () => {
        if (scoreRef.current) {
            scoreRef.current.dispose();
            scoreRef.current = null;
        }
    }, []);

    const handleToggle = async () => {
        if (busy) {
            return;
        }

        if (playing) {
            scoreRef.current?.stop();
            setStatus('idle');
            return;
        }

        try {
            if (!scoreRef.current) {
                scoreRef.current = createBackgroundMusic(BACKGROUND_MUSIC);
            }

            if (!scoreRef.current) {
                setStatus('unsupported');
                return;
            }

            setStatus('starting');
            await scoreRef.current.start();
            setStatus('playing');
        } catch (error) {
            console.error('Unable to start background music', error);
            scoreRef.current?.dispose();
            scoreRef.current = null;
            setStatus('unsupported');
        }
    };

    const label = status === 'unsupported'
        ? 'Audio Off'
        : playing
            ? 'Music On'
            : busy
                ? 'Starting'
                : 'Music Off';

    return (
        <button
            type="button"
            className={`music-toggle${playing ? ' music-toggle--active' : ''}`}
            onClick={handleToggle}
            disabled={status === 'unsupported'}
            aria-pressed={playing}
            aria-label={playing
                ? `Turn ${BACKGROUND_MUSIC.title} background music off`
                : `Turn ${BACKGROUND_MUSIC.title} background music on`}
            title={`${BACKGROUND_MUSIC.title} background music`}
        >
            <span className="music-toggle__meter" aria-hidden="true">
                <span />
                <span />
                <span />
            </span>
            <span className="music-toggle__label">{label}</span>
        </button>
    );
}

export default MusicToggle;

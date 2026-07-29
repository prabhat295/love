import { useEffect, useState } from 'react';
import {
  subscribe, nowPlaying, isMuted, toggleMute, unlock, playOpening, hasAnySong,
} from '../backgroundMusic';

export default function MusicPlayer() {
  /* The soundtrack changes as she scrolls, so mirror the engine's state
     rather than keeping our own copy of what's playing. */
  const [title, setTitle] = useState(nowPlaying);
  const [muted, setMuted] = useState(isMuted);

  useEffect(() => subscribe(() => {
    setTitle(nowPlaying());
    setMuted(isMuted());
  }), []);

  useEffect(() => {
    playOpening();

    /* Browsers refuse to autoplay audio until she interacts with the page.
       Her first tap is the password screen, so this is invisible. */
    const onFirstTouch = () => {
      unlock();
      setTitle(nowPlaying());
      detach();
    };
    const detach = () => {
      document.removeEventListener('click', onFirstTouch);
      document.removeEventListener('keydown', onFirstTouch);
      document.removeEventListener('touchstart', onFirstTouch);
    };

    document.addEventListener('click', onFirstTouch);
    document.addEventListener('keydown', onFirstTouch);
    document.addEventListener('touchstart', onFirstTouch, { passive: true });

    return detach;
  }, []);

  /* No mp3 files added yet — don't show a button that can't do anything */
  if (!hasAnySong()) return null;

  const playing = !!title && !muted;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
      <button
        onClick={() => setMuted(toggleMute())}
        title={playing ? 'Gaana rok dijiye' : 'Gaana chalayein'}
        aria-label={playing ? 'Gaana rok dijiye' : 'Gaana chalayein'}
        className="w-11 h-11 flex items-center justify-center rounded-full text-base transition-all duration-300 hover:scale-110"
        style={{
          background: 'rgba(0,21,34,0.85)',
          border: '1px solid rgba(251,82,72,0.45)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        {playing ? '⏸' : '▶'}
      </button>

      {/* The title slides away in the video section, where there's no song */}
      <div
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-opacity duration-500"
        style={{
          background: 'rgba(0,21,34,0.82)',
          border: '1px solid rgba(251,82,72,0.2)',
          backdropFilter: 'blur(12px)',
          color: 'rgba(255,255,255,0.5)',
          fontFamily: "'Lato', sans-serif",
          whiteSpace: 'nowrap',
          opacity: title ? 1 : 0,
          pointerEvents: title ? 'auto' : 'none',
        }}
      >
        <span className="flex gap-0.5 items-end shrink-0" style={{ height: '14px' }}>
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: '3px',
                borderRadius: '2px',
                background: '#FB5248',
                animation: playing ? `eq${i} ${0.5 + i * 0.15}s ease-in-out infinite alternate` : 'none',
                height: `${4 + i * 3}px`,
              }}
            />
          ))}
        </span>
        <span>{title || '—'}</span>
      </div>

      <style>{`
        @keyframes eq1 { 0%{height:4px} 100%{height:12px} }
        @keyframes eq2 { 0%{height:8px} 100%{height:4px}  }
        @keyframes eq3 { 0%{height:5px} 100%{height:14px} }
      `}</style>
    </div>
  );
}

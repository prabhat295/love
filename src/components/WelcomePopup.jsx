import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { welcome } from '../content';
import { welcomePhoto } from '../media';

const BG_HEARTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  fontSize: `${14 + (i % 4) * 8}px`,
  color: ['rgba(251,82,72,0.25)', 'rgba(255,185,185,0.18)', 'rgba(255,201,69,0.2)'][i % 3],
  left: `${(i * 8.3) % 100}%`,
  top: `${(i * 13 + 5) % 95}%`,
  animationDelay: `${i * 0.4}s`,
  animation: `floatHeart ${4 + (i % 3)}s ease-in-out infinite alternate`,
}));

export default function WelcomePopup({ onClose }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const cursorRef = useRef(null);
  const [showImage, setShowImage] = useState(false);

  /* Type the poem out word by word */
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const words = welcome.poem.join('\n').split(/(\s+)/); // keeps the spaces
    let text = '';
    let i = 0;

    const cursorTl = gsap.to(cursorRef.current, {
      opacity: 0, duration: 0.45, repeat: -1, yoyo: true, ease: 'none',
    });

    const interval = setInterval(() => {
      if (i >= words.length) {
        clearInterval(interval);
        cursorTl.kill();
        gsap.set(cursorRef.current, { opacity: 0 });
        setTimeout(() => setShowImage(true), 300);
        return;
      }
      text += words[i];
      el.innerHTML = text
        .split('\n')
        .map((line) => `<span>${line || '&nbsp;'}</span>`)
        .join('<br/>');
      i++;
    }, 38);

    return () => {
      clearInterval(interval);
      cursorTl.kill();
    };
  }, []);

  useEffect(() => {
    if (showImage && imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0, scale: 0.88, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.4)' }
      );
    }
  }, [showImage]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      gsap.fromTo(
        cardRef.current,
        { scale: 0.78, opacity: 0, y: 48 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)', delay: 0.15 }
      );
    });
    return () => ctx.revert();
  }, []);

  /* Escape closes it too */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: onClose });
  };

  return (
    <>
      <style>{`
        @keyframes floatHeart {
          0%   { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-18px) scale(1.12); }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.18); }
        }
        @keyframes slowBlink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.15; }
        }
      `}</style>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 8, 18, 0.88)', backdropFilter: 'blur(6px)', opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        {BG_HEARTS.map((h) => (
          <span key={h.id} className="absolute select-none pointer-events-none" style={h}>♥</span>
        ))}

        <div
          ref={cardRef}
          className="relative w-full max-w-3xl rounded-3xl"
          style={{
            background: 'linear-gradient(160deg, rgba(0,18,34,0.98) 0%, rgba(0,30,52,0.98) 55%, rgba(35,6,10,0.98) 100%)',
            border: '1px solid rgba(251,82,72,0.3)',
            boxShadow: '0 0 80px rgba(193,18,31,0.25), 0 32px 100px rgba(0,0,0,0.8)',
            opacity: 0,
            maxHeight: '90vh',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, #FB5248 50%, transparent 100%)' }}
          />

          <button
            onClick={handleClose}
            aria-label="Band kijiye"
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white transition-colors duration-200"
            style={{ background: 'rgba(255,255,255,0.06)', fontSize: '16px' }}
          >
            ✕
          </button>

          <div className="pt-10 pb-4 px-6 md:px-12 text-center">
            <div className="flex justify-center gap-3 mb-3">
              {['♥', '❤', '♥'].map((h, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: i === 1 ? '28px' : '18px',
                    color: i === 1 ? '#FB5248' : 'rgba(251,82,72,0.5)',
                    animation: `heartPulse ${1.2 + i * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                    display: 'inline-block',
                    filter: i === 1 ? 'drop-shadow(0 0 10px rgba(251,82,72,0.7))' : 'none',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #FB5248 0%, #FFC945 60%, #FFB3B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'slowBlink 1.4s cubic-bezier(0.45, 0, 0.55, 1) infinite',
                display: 'inline-block',
              }}
            >
              {welcome.heading}
            </p>
          </div>

          <div className="px-6 md:px-12 pb-2">
            <div
              className="rounded-2xl p-5 md:p-7"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(251,82,72,0.1)' }}
            >
              <span
                className="block text-4xl leading-none mb-1 select-none"
                style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(251,82,72,0.2)' }}
              >
                &ldquo;
              </span>

              <p
                ref={textRef}
                className="leading-8 min-h-[14rem]"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '1.1rem',
                  color: 'rgba(255,255,255,0.82)',
                  whiteSpace: 'pre-wrap',
                }}
              />

              <span
                ref={cursorRef}
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1.1em',
                  background: '#FB5248',
                  borderRadius: '1px',
                  verticalAlign: 'text-bottom',
                  marginLeft: '2px',
                }}
              />
            </div>
          </div>

          {showImage && welcomePhoto && (
            <div ref={imgRef} className="px-6 md:px-12 pt-4 pb-10" style={{ opacity: 0 }}>
              {/* Capped height and centred, so a tall portrait photo from a
                  phone doesn't run off the bottom of the card. `object-contain`
                  keeps the whole photo visible rather than cropping her out. */}
              <div
                className="rounded-2xl overflow-hidden mx-auto"
                style={{
                  border: '2px solid rgba(251,82,72,0.35)',
                  boxShadow: '0 0 40px rgba(193,18,31,0.3), 0 12px 40px rgba(0,0,0,0.6)',
                  maxWidth: 'fit-content',
                  background: 'rgba(0,0,0,0.3)',
                }}
              >
                <img
                  src={welcomePhoto}
                  alt={welcome.caption}
                  className="block"
                  style={{
                    maxHeight: '58vh',
                    maxWidth: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>

              <div className="flex justify-center gap-2 mt-5">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: i === 2 ? '22px' : '14px',
                      color: i === 2 ? '#FB5248' : 'rgba(251,82,72,0.45)',
                      animation: `heartPulse ${1 + i * 0.15}s ease-in-out infinite`,
                      animationDelay: `${i * 0.12}s`,
                      display: 'inline-block',
                      filter: i === 2 ? 'drop-shadow(0 0 8px rgba(251,82,72,0.8))' : 'none',
                    }}
                  >
                    ♥
                  </span>
                ))}
              </div>

              <p
                className="text-center mt-3 italic"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  background: 'linear-gradient(135deg, #FB5248, #FFC945)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '2rem',
                }}
              >
                {welcome.caption}
              </p>
            </div>
          )}

          {/* No hero photo yet — just pad the bottom so the card isn't cramped */}
          {showImage && !welcomePhoto && <div className="pb-10" />}

          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(251,82,72,0.4) 50%, transparent 100%)' }}
          />
        </div>
      </div>
    </>
  );
}

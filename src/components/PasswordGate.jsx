import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { gate } from '../content';
import { prefetchOpening, playOpening } from '../backgroundMusic';

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const ACCEPTED = gate.acceptedAnswers.map(normalize);

/* Drifting hearts and sparkles behind the card. Rose and gold rather than
   white — white read as grey dust against the navy. */
const FLOATERS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  symbol: ['♥', '❤', '♡', '✦', '✿', '❥'][i % 6],
  size: 12 + ((i * 7) % 26),
  left: (i * 13.7) % 100,
  top: (i * 21.3) % 100,
  color: ['#FB5248', '#FFC945', '#FFB3B0', '#FF85A1'][i % 4],
  delay: (i % 9) * 0.55,
  duration: 7 + ((i * 3) % 6),
  drift: i % 2 === 0 ? 26 : -26,
}));

export default function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const gateRef = useRef(null);
  const frameRef = useRef(null);
  const inputRef = useRef(null);
  const heartRef = useRef(null);
  const ringRefs = useRef([]);
  const floaterRefs = useRef([]);

  /* Start downloading the opening song straight away, while she's still reading
     and typing. That buys the whole duration of the password screen as a head
     start, so the music is ready the instant she's through instead of spending
     several seconds fetching 8.8 MB. */
  useEffect(() => { prefetchOpening(); }, []);

  /* Hearts drifting upward, forever */
  useEffect(() => {
    const ctx = gsap.context(() => {
      floaterRefs.current.forEach((el, i) => {
        if (!el) return;
        const f = FLOATERS[i];
        gsap.set(el, { y: 70, x: 0, opacity: 0 });
        gsap.to(el, {
          y: -140,
          x: f.drift,
          opacity: gsap.utils.random(0.25, 0.7),
          rotation: f.drift > 0 ? 18 : -18,
          duration: f.duration,
          delay: f.delay,
          repeat: -1,
          ease: 'none',
          onRepeat: () => gsap.set(el, { y: 70, x: 0, opacity: 0, rotation: 0 }),
        });
      });
    });
    return () => ctx.revert();
  }, []);

  /* Card entrance, heartbeat, and the rings pulsing out of the heart */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frameRef.current,
        { scale: 0.82, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'back.out(1.5)', delay: 0.25 }
      );

      /* Double thump, like an actual heartbeat, rather than a steady throb */
      gsap.timeline({ repeat: -1, delay: 1 })
        .to(heartRef.current, { scale: 1.18, duration: 0.16, ease: 'power2.out' })
        .to(heartRef.current, { scale: 1, duration: 0.18, ease: 'power2.in' })
        .to(heartRef.current, { scale: 1.11, duration: 0.14, ease: 'power2.out' })
        .to(heartRef.current, { scale: 1, duration: 0.22, ease: 'power2.in' })
        .to({}, { duration: 0.85 });

      ringRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scale: 0.55, opacity: 0.5 },
          {
            scale: 2.1,
            opacity: 0,
            duration: 2.6,
            repeat: -1,
            delay: 1 + i * 0.85,
            ease: 'sine.out',
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (ACCEPTED.includes(normalize(value))) {
      /* Start the music HERE, synchronously inside the click handler. This is
         the user gesture the browser requires — starting it later, after the
         fade-out completes, is no longer attributable to a gesture and gets
         blocked or deferred. Already-buffered, so it begins immediately. */
      playOpening();

      gsap.to(gateRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: onUnlock,
      });
      return;
    }

    setError(true);
    gsap.fromTo(frameRef.current, { x: -14 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    setTimeout(() => setError(false), 2600);
  };

  return (
    <div
      ref={gateRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden px-4"
      style={{
        background:
          'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(193,18,31,0.30) 0%, transparent 72%), ' +
          'radial-gradient(ellipse 50% 40% at 82% 88%, rgba(255,133,161,0.14) 0%, transparent 70%), ' +
          'linear-gradient(150deg, #0a0710 0%, #12071a 22%, #001a30 58%, #000d18 100%)',
      }}
    >
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50%      { opacity: 0.9;  transform: scale(1.25); }
        }
        @keyframes sheen {
          0%   { transform: translateX(-130%) skewX(-18deg); }
          100% { transform: translateX(280%)  skewX(-18deg); }
        }
      `}</style>

      {/* Drifting hearts */}
      {FLOATERS.map((f, i) => (
        <span
          key={f.id}
          ref={(el) => (floaterRefs.current[i] = el)}
          className="absolute select-none pointer-events-none"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            fontSize: `${f.size}px`,
            color: f.color,
            opacity: 0,
            filter: 'drop-shadow(0 0 8px rgba(251,82,72,0.45))',
          }}
        >
          {f.symbol}
        </span>
      ))}

      {/* Static twinkling dust */}
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={`tw-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${(i * 29) % 100}%`,
            top: `${(i * 41) % 100}%`,
            width: 3,
            height: 3,
            background: i % 3 === 0 ? '#FFC945' : '#FFB3B0',
            animation: `twinkle ${2.4 + (i % 5) * 0.6}s ease-in-out ${(i % 7) * 0.4}s infinite`,
          }}
        />
      ))}

      {/* ── The card. Outer div is a 1px gradient ring; inner holds content. ── */}
      <div
        ref={frameRef}
        className="relative w-full max-w-md rounded-[30px] p-[1.5px]"
        style={{
          background: error
            ? 'linear-gradient(160deg, rgba(255,70,70,0.9), rgba(255,120,120,0.35), rgba(255,70,70,0.6))'
            : 'linear-gradient(160deg, rgba(251,82,72,0.85) 0%, rgba(255,201,69,0.55) 34%, rgba(255,133,161,0.35) 62%, rgba(251,82,72,0.7) 100%)',
          boxShadow: '0 0 90px rgba(193,18,31,0.28), 0 30px 90px rgba(0,0,0,0.75)',
          opacity: 0,
          transition: 'background 0.4s',
        }}
      >
        <div
          className="relative rounded-[28px] px-7 py-10 md:px-11 md:py-12 overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(193,18,31,0.22) 0%, transparent 65%), ' +
              'linear-gradient(165deg, rgba(4,14,26,0.97) 0%, rgba(8,22,40,0.97) 55%, rgba(30,6,14,0.97) 100%)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Light sweeping across the card */}
          <div
            className="absolute inset-y-0 w-24 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.055), transparent)',
              animation: 'sheen 6.5s ease-in-out infinite',
            }}
          />

          {/* Heart with rings pulsing out of it */}
          <div className="relative flex justify-center mb-7" style={{ height: 76 }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                ref={(el) => (ringRefs.current[i] = el)}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 76,
                  height: 76,
                  top: 0,
                  border: '1px solid rgba(251,82,72,0.55)',
                  opacity: 0,
                }}
              />
            ))}
            <span
              ref={heartRef}
              className="relative inline-flex items-center justify-center select-none"
              style={{
                width: 76,
                height: 76,
                fontSize: 38,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, rgba(255,201,69,0.28), rgba(193,18,31,0.42))',
                border: '1px solid rgba(251,82,72,0.45)',
                filter: 'drop-shadow(0 0 22px rgba(251,82,72,0.55))',
              }}
            >
              💝
            </span>
          </div>

          {/* For Shivani Priya */}
          <p
            className="text-center text-[10px] md:text-xs tracking-[0.42em] uppercase mb-4"
            style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(255,201,69,0.75)' }}
          >
            {gate.eyebrow}
          </p>

          <h1
            className="text-center font-bold leading-tight mb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
              background: 'linear-gradient(135deg, #ffffff 22%, #FFD9D7 62%, #FFC945 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {gate.heading}
          </h1>

          <p
            className="text-center text-white/45 text-sm italic mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {gate.subheading}
          </p>

          {/* ♥ divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="h-px w-16"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(251,82,72,0.55))' }}
            />
            <span style={{ color: 'rgba(251,82,72,0.5)', fontSize: 9 }}>♥</span>
            <span style={{ color: '#FB5248', fontSize: 14 }}>♥</span>
            <span style={{ color: 'rgba(251,82,72,0.5)', fontSize: 9 }}>♥</span>
            <div
              className="h-px w-16"
              style={{ background: 'linear-gradient(270deg, transparent, rgba(251,82,72,0.55))' }}
            />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <input
                ref={inputRef}
                type="password"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(false); }}
                placeholder={gate.placeholder}
                autoComplete="off"
                autoFocus
                aria-label={gate.heading}
                className="w-full rounded-2xl px-5 py-4 text-center text-white text-lg tracking-[0.18em] outline-none transition-all duration-300 placeholder:tracking-normal placeholder:text-white/25 placeholder:italic"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  background: 'rgba(255,255,255,0.045)',
                  border: `1.5px solid ${error ? 'rgba(255,80,80,0.85)' : 'rgba(251,82,72,0.32)'}`,
                  boxShadow: error ? '0 0 24px rgba(255,60,60,0.22)' : 'none',
                  caretColor: '#FB5248',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1.5px solid rgba(251,82,72,0.85)';
                  e.target.style.boxShadow = '0 0 26px rgba(251,82,72,0.22)';
                }}
                onBlur={(e) => {
                  e.target.style.border = `1.5px solid ${error ? 'rgba(255,80,80,0.85)' : 'rgba(251,82,72,0.32)'}`;
                  e.target.style.boxShadow = error ? '0 0 24px rgba(255,60,60,0.22)' : 'none';
                }}
              />
            </div>

            {/* Reserved height so nothing jumps when the error appears */}
            <p
              className="text-center text-sm transition-opacity duration-300"
              style={{
                fontFamily: "'Lato', sans-serif",
                color: '#FF8A8A',
                opacity: error ? 1 : 0,
                minHeight: '20px',
              }}
            >
              {gate.error}
            </p>

            <button
              type="submit"
              className="group relative w-full rounded-2xl py-4 font-bold text-white text-base tracking-[0.12em] overflow-hidden transition-transform duration-200 hover:scale-[1.025] active:scale-[0.985]"
              style={{
                fontFamily: "'Lato', sans-serif",
                background: 'linear-gradient(135deg, #C1121F 0%, #FB5248 48%, #FF85A1 100%)',
                backgroundSize: '180% auto',
                boxShadow: '0 10px 34px rgba(193,18,31,0.5)',
              }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { backgroundPosition: 'right center', duration: 0.45 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { backgroundPosition: 'left center', duration: 0.45 })}
            >
              <span className="inline-flex items-center gap-2">
                {gate.button}
                <span className="inline-block transition-transform duration-300 group-hover:scale-125">♥</span>
              </span>
            </button>
          </form>

          <p
            className="text-center text-white/25 text-[10px] mt-7 tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {gate.hint}
          </p>
        </div>
      </div>
    </div>
  );
}

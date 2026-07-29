import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionReveal } from '../hooks/useGSAPAnimations';
import { notes, loveMessage } from '../content';

gsap.registerPlugin(ScrollTrigger);

const CARD_STYLE = {
  background: 'linear-gradient(135deg, rgba(0,18,30,0.98) 0%, rgba(0,30,50,0.98) 60%, rgba(40,8,12,0.98) 100%)',
  border: '1px solid rgba(251,82,72,0.3)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
};

/* How far the card must be dragged before it flies away */
const SWIPE_THRESHOLD = 90;

function NoteStack() {
  const [topIdx, setTopIdx] = useState(0);
  const cardRefs = useRef([]);
  const drag = useRef({ active: false, startX: 0, startY: 0 });
  const total = notes.length;

  /* Re-stack the cards below the top one whenever the top changes */
  useEffect(() => {
    for (let i = topIdx; i < Math.min(topIdx + 4, total); i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const offset = i - topIdx;
      gsap.to(el, {
        scale: 1 - offset * 0.035,
        y: offset * 14,
        rotation: offset === 0 ? 0 : (i % 2 === 0 ? offset * 1.8 : -offset * 1.8),
        opacity: offset > 2 ? 0 : 1,
        duration: 0.4,
        ease: 'power2.out',
        zIndex: total - offset,
      });
    }
  }, [topIdx, total]);

  const onPointerDown = useCallback((e) => {
    if (topIdx >= total) return;
    drag.current = { active: true, startX: e.clientX, startY: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    gsap.to(cardRefs.current[topIdx], { scale: 1.02, duration: 0.15 });
  }, [topIdx, total]);

  const onPointerMove = useCallback((e) => {
    if (!drag.current.active || !cardRefs.current[topIdx]) return;
    const dx = e.clientX - drag.current.startX;
    const dy = (e.clientY - drag.current.startY) * 0.25;
    gsap.set(cardRefs.current[topIdx], { x: dx, y: dy, rotation: dx * 0.04 });
  }, [topIdx]);

  const onPointerUp = useCallback((e) => {
    if (!drag.current.active) return;
    drag.current.active = false;

    const dx = e.clientX - drag.current.startX;
    const el = cardRefs.current[topIdx];
    if (!el) return;

    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      const dir = dx > 0 ? 1 : -1;
      gsap.to(el, {
        x: dir * 800, y: -80, rotation: dir * 28, opacity: 0,
        duration: 0.38, ease: 'power2.in',
        onComplete: () => setTopIdx((i) => i + 1),
      });
    } else {
      gsap.to(el, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
    }
  }, [topIdx]);

  /* Reset the flown-off cards so "read again" works */
  const restart = () => {
    cardRefs.current.forEach((el) => {
      if (el) gsap.set(el, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 });
    });
    setTopIdx(0);
  };

  if (topIdx >= total) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">💝</div>
        <p className="italic text-2xl text-white/70" style={{ fontFamily: "'Playfair Display', serif" }}>
          {loveMessage.endTitle}
        </p>
        <button
          onClick={restart}
          className="mt-6 text-sm text-rose-soft/60 hover:text-rose-soft transition-colors tracking-widest uppercase"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {loveMessage.endButton}
        </button>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto select-none" style={{ height: '380px' }}>
      <p
        className="text-center text-white/25 text-xs tracking-widest uppercase"
        style={{
          fontFamily: "'Lato', sans-serif",
          marginTop: '-2rem',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 999,
        }}
      >
        {loveMessage.swipeHint}
      </p>

      {notes.map((note, i) => {
        const offset = i - topIdx;
        const isTop = i === topIdx;
        const hidden = i < topIdx || offset > 3;

        return (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            onPointerDown={isTop ? onPointerDown : undefined}
            onPointerMove={isTop ? onPointerMove : undefined}
            onPointerUp={isTop ? onPointerUp : undefined}
            onPointerCancel={isTop ? onPointerUp : undefined}
            style={{
              position: 'absolute',
              inset: 0,
              top: '24px',
              zIndex: total - offset,
              cursor: isTop ? 'grab' : 'default',
              opacity: hidden ? 0 : 1,
              pointerEvents: hidden ? 'none' : (isTop ? 'auto' : 'none'),
              touchAction: isTop ? 'none' : 'auto',
              transform: hidden
                ? 'scale(0.85)'
                : `scale(${1 - Math.max(0, offset) * 0.035}) translateY(${Math.max(0, offset) * 14}px) rotate(${offset <= 0 ? 0 : (i % 2 === 0 ? offset * 1.8 : -offset * 1.8)}deg)`,
              transformOrigin: 'bottom center',
              willChange: 'transform',
              overflow: 'hidden',
            }}
          >
            {!isTop ? (
              /* Cards further down the stack only show their signature */
              <div className="rounded-3xl w-full h-full flex flex-col justify-end p-6 md:p-8" style={CARD_STYLE}>
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-rose-soft/20" />
                  <span className="text-white text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                    — {note.signature}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl p-6 md:p-8 h-full flex flex-col" style={CARD_STYLE}>
                <div
                  className="text-5xl leading-none text-rose-soft/20 mb-2 select-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  &ldquo;
                </div>

                <div className="space-y-3">
                  {note.lines.map((line, li) => {
                    const isLast = li === note.lines.length - 1;
                    return isLast ? (
                      <p
                        key={li}
                        className="italic text-xl md:text-2xl font-semibold leading-snug"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          background: 'linear-gradient(135deg, #FB5248, #FFC945)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {line}
                      </p>
                    ) : (
                      <p
                        key={li}
                        className="italic text-lg md:text-xl text-white/90 leading-snug"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 mt-auto pt-4">
                  <div className="h-px flex-1 bg-rose-soft/20" />
                  <span className="text-white text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                    — {note.signature}
                  </span>
                </div>
                <p className="text-right text-white/20 text-xs mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {topIdx + 1} / {total}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function LoveMessage() {
  const sectionRef = useSectionReveal(0.18, 55);
  const heartRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heartRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            heartRef.current,
            { scale: 0, rotation: -15 },
            { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(2)' }
          );
        },
      });
      gsap.to(heartRef.current, {
        scale: 1.08, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="love-message"
      ref={sectionRef}
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #001522 0%, #002235 40%, #003049 70%, #002235 100%)' }}
    >
      <div className="divider-rose mb-16 mx-auto w-3/4" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.04 }}>
        <span style={{ fontSize: '32rem', lineHeight: 1, color: '#FB5248', filter: 'blur(2px)' }}>♥</span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div data-animate className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rose-soft/40 max-w-24" />
          <span
            className="text-xs tracking-[0.4em] uppercase text-rose-soft/80"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {loveMessage.badge}
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rose-soft/40 max-w-24" />
        </div>

        <h2
          data-animate
          className="text-center text-4xl md:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {loveMessage.headingBefore}{' '}
          <em className="text-gradient not-italic">{loveMessage.headingHighlight}</em>{' '}
          <span ref={heartRef} className="inline-block" style={{ color: '#FB5248' }}>
            {loveMessage.headingEmoji}
          </span>
        </h2>

        <p
          data-animate
          className="text-center text-white/50 text-lg mb-20 tracking-wide"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {loveMessage.subheading}
        </p>

        <NoteStack />

        <div data-animate className="flex justify-center mt-16">
          <a
            href="#reasons"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-rose-soft transition-colors duration-300 group"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            <span className="tracking-widest uppercase">{loveMessage.cta}</span>
            <span className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
          </a>
        </div>
      </div>

      <div className="divider-rose mt-16 mx-auto w-3/4" />
    </section>
  );
}

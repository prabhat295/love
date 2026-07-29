import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/* Hearts drifting up across whatever this sits on top of.

   Pointer-events are off and it's purely decorative, so it never gets in the
   way of the photo or the buttons underneath. */

const HEARTS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  symbol: ['♥', '❤', '♡', '❥', '✿'][i % 5],
  size: 14 + ((i * 9) % 26),
  left: (i * 17.3) % 100,
  color: ['#FB5248', '#FFC945', '#FFB3B0', '#FF85A1'][i % 4],
  delay: (i % 7) * 0.9,
  duration: 7 + ((i * 5) % 5),
  sway: i % 2 === 0 ? 34 : -34,
}));

export default function FloatingHearts({ count = 14, opacity = 0.5 }) {
  const refs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      refs.current.forEach((el, i) => {
        if (!el) return;
        const h = HEARTS[i];

        /* Rise from just below the frame to just above it, drifting sideways
           and fading at both ends so nothing pops in or out abruptly. */
        gsap.set(el, { y: '12vh', x: 0, opacity: 0, rotation: 0 });
        gsap.timeline({ repeat: -1, delay: h.delay })
          .to(el, { opacity, duration: 1.4, ease: 'sine.out' }, 0)
          .to(el, {
            y: '-105vh',
            x: h.sway,
            rotation: h.sway > 0 ? 22 : -22,
            duration: h.duration,
            ease: 'none',
          }, 0)
          .to(el, { opacity: 0, duration: 1.8, ease: 'sine.in' }, h.duration - 1.8);
      });
    });
    return () => ctx.revert();
  }, [opacity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {HEARTS.slice(0, count).map((h, i) => (
        <span
          key={h.id}
          ref={(el) => (refs.current[i] = el)}
          className="absolute select-none"
          style={{
            left: `${h.left}%`,
            bottom: 0,
            fontSize: `${h.size}px`,
            color: h.color,
            opacity: 0,
            filter: 'drop-shadow(0 0 10px rgba(251,82,72,0.5))',
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
}

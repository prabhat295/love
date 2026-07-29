import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { hero } from '../content';

const FloatingHeart = ({ size, style }) => (
  <span
    className="absolute select-none pointer-events-none opacity-20 heart-float"
    style={{ fontSize: size, ...style }}
  >
    ♥
  </span>
);

/* Positions are hand-placed so the hearts never sit on top of the text. */
const HEARTS = [
  { size: '4rem',   top: '10%', left: '6%',    animationDelay: '0s',   color: '#FB5248' },
  { size: '2.5rem', top: '22%', left: '18%',   animationDelay: '0.8s', color: '#FFB3B0' },
  { size: '1.5rem', top: '38%', left: '10%',   animationDelay: '1.6s', color: '#FFC945' },
  { size: '3rem',   top: '60%', left: '14%',   animationDelay: '0.3s', color: '#FB5248' },
  { size: '1.8rem', top: '75%', left: '4%',    animationDelay: '2.1s', color: '#FFB3B0' },
  { size: '5rem',   bottom: '12%', left: '8%', animationDelay: '1.2s', color: '#FB5248', opacity: 0.12 },
  { size: '2rem',   top: '15%', right: '6%',   animationDelay: '0.5s', color: '#FFC945' },
  { size: '3.5rem', top: '30%', right: '14%',  animationDelay: '1.4s', color: '#FB5248' },
  { size: '1.6rem', top: '48%', right: '8%',   animationDelay: '2.3s', color: '#FFB3B0' },
  { size: '2.8rem', top: '65%', right: '18%',  animationDelay: '0.9s', color: '#FFC945' },
  { size: '4.5rem', bottom: '18%', right: '5%', animationDelay: '1.8s', color: '#FB5248', opacity: 0.15 },
  { size: '1.4rem', top: '82%', right: '12%',  animationDelay: '2.8s', color: '#FFB3B0' },
];

export default function Hero({ onOpenNote }) {
  const heroRef = useRef(null);
  const preTitleRef = useRef(null);
  const titleRef = useRef(null);
  const emojiRef = useRef(null);
  const subtitleRef = useRef(null);
  const cursorRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Start blank so the typing reads as typing */
      preTitleRef.current.textContent = '';
      titleRef.current.textContent = '';
      subtitleRef.current.textContent = '';
      gsap.set([emojiRef.current, ctaRef.current, scrollRef.current], { opacity: 0 });

      gsap.to(cursorRef.current, { opacity: 0, repeat: -1, yoyo: true, duration: 0.5, ease: 'none' });

      /* Types `text` into `ref` at `charsPerSecond` */
      const type = (tl, ref, text, charsPerSecond, position) => {
        const counter = { n: 0 };
        tl.to(counter, {
          n: text.length,
          duration: text.length / charsPerSecond,
          ease: 'none',
          onUpdate() {
            ref.current.textContent = text.slice(0, Math.round(counter.n));
          },
        }, position);
      };

      const tl = gsap.timeline({ delay: 0.4 });

      type(tl, preTitleRef, hero.preTitle, 10);
      type(tl, titleRef, hero.title, 5, '+=0.25');

      tl.fromTo(
        emojiRef.current,
        { opacity: 0, scale: 0.3, rotation: -30 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.5)' }
      ).set(cursorRef.current, { opacity: 0, display: 'none' });

      type(tl, subtitleRef, hero.subtitle, 12, '+=0.3');

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' },
        '+=0.2'
      ).fromTo(
        scrollRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );

      gsap.to(scrollRef.current, {
        y: 10, repeat: -1, yoyo: true, duration: 0.9, ease: 'sine.inOut', delay: 5,
      });
    }, heroRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* The scroll indicator at the bottom — this one just scrolls. */
  const scrollToNext = () => {
    document.getElementById('love-message')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* "Dil Kholiye" opens the note. It deliberately does NOT scroll — the
     message is the reward for pressing it, and scrolling underneath would
     pull the page away behind the popup. */
  const openNote = () => onOpenNote?.();

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(193,18,31,0.25) 0%, transparent 50%), ' +
          'radial-gradient(ellipse at 70% 80%, rgba(53,89,117,0.3) 0%, transparent 50%), ' +
          'linear-gradient(160deg, #001522 0%, #002235 60%, #001830 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(251,82,72,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(251,82,72,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {HEARTS.map((h, i) => {
        const { size, ...style } = h;
        return <FloatingHeart key={i} size={size} style={style} />;
      })}

      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(193,18,31,0.15) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p
          className="text-rose-soft text-sm md:text-base tracking-[0.3em] uppercase mb-6 opacity-80"
          style={{ fontFamily: "'Lato', sans-serif", minHeight: '1.5em' }}
        >
          <span ref={preTitleRef} />
          <span ref={cursorRef} className="inline-block" style={{ color: '#FB5248', fontWeight: 300 }}>|</span>
        </p>

        <h1
          className="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight mb-6"
          style={{ fontFamily: "'Playfair Display', serif", minHeight: '1.2em' }}
        >
          <span ref={titleRef} className="text-gradient" />
          <span ref={emojiRef} style={{ WebkitTextFillColor: 'initial', opacity: 0 }}> {hero.titleEmoji}</span>
        </h1>

        <p
          ref={subtitleRef}
          className="italic text-lg md:text-2xl text-white/80 mb-10 leading-relaxed"
          style={{ fontFamily: "'Playfair Display', serif", minHeight: '2em' }}
        />

        <div ref={ctaRef} className="opacity-0">
          <button
            onClick={openNote}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white text-sm tracking-widest uppercase overflow-hidden transition-all duration-300 hover:scale-105 pulse-glow"
            style={{
              background: 'linear-gradient(135deg, #C1121F 0%, #FB5248 50%, #C1121F 100%)',
              backgroundSize: '200% auto',
              fontFamily: "'Lato', sans-serif",
            }}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { backgroundPosition: 'right center', duration: 0.4 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { backgroundPosition: 'left center', duration: 0.4 })}
          >
            <span>{hero.cta}</span>
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 cursor-pointer"
        onClick={scrollToNext}
      >
        <span className="text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: "'Lato', sans-serif" }}>
          {hero.scrollLabel}
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-rose-soft to-transparent" />
      </div>
    </section>
  );
}

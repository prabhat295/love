import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionReveal, useCardReveal } from '../hooks/useGSAPAnimations';
import { reasons, reasonsSection } from '../content';

gsap.registerPlugin(ScrollTrigger);

function ReasonCard({ reason, index }) {
  const cardRef = useRef(null);

  const hover = (into) => {
    gsap.to(cardRef.current, {
      y: into ? -8 : 0,
      borderColor: into ? 'rgba(251,82,72,0.5)' : 'rgba(251,82,72,0.18)',
      duration: 0.35,
      ease: into ? 'power2.out' : 'power2.inOut',
    });
    gsap.to(cardRef.current.querySelector('.icon-wrap'), {
      scale: into ? 1.2 : 1,
      rotation: into ? 5 : 0,
      duration: 0.35,
      ease: into ? 'back.out(2)' : 'power2.inOut',
    });
  };

  return (
    <div
      ref={cardRef}
      data-card
      className="card-glass shimmer-card rounded-2xl p-7 flex flex-col gap-4"
      style={{
        background:
          index % 2 === 0
            ? 'linear-gradient(135deg, rgba(193,18,31,0.07) 0%, rgba(0,34,53,0.6) 100%)'
            : 'linear-gradient(135deg, rgba(53,89,117,0.1) 0%, rgba(0,34,53,0.6) 100%)',
        border: '1px solid rgba(251,82,72,0.18)',
        cursor: 'default',
      }}
      onMouseEnter={() => hover(true)}
      onMouseLeave={() => hover(false)}
    >
      <div
        className="icon-wrap inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(193,18,31,0.25), rgba(251,82,72,0.15))',
          border: '1px solid rgba(251,82,72,0.3)',
        }}
      >
        {reason.icon}
      </div>

      <h3 className="font-semibold text-xl text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
        {reason.title}
      </h3>

      <p className="text-white/55 text-sm leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
        {reason.desc}
      </p>
    </div>
  );
}

export default function Reasons() {
  const sectionRef = useSectionReveal(0.08, 45);
  const gridRef = useCardReveal({ stagger: 0.1, y: 60, scale: 0.92 });
  const countRef = useRef(null);

  /* Ticks the number up from 0 to however many reasons are in content.js */
  useEffect(() => {
    const el = countRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: reasons.length,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(counter.val); },
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="reasons"
      ref={sectionRef}
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #001830 0%, #002235 50%, #001522 100%)' }}
    >
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-white/[0.03] font-bold select-none pointer-events-none hidden md:block"
        style={{
          fontSize: '12rem',
          fontFamily: "'Playfair Display', serif",
          transformOrigin: 'right center',
          right: '-6rem',
        }}
      >
        PYAAR
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div data-animate className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-light/40 max-w-24" />
            <span
              className="text-xs tracking-[0.4em] uppercase"
              style={{ fontFamily: "'Lato', sans-serif", color: '#FFC945' }}
            >
              {reasonsSection.badge}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-light/40 max-w-24" />
          </div>

          <h2
            data-animate
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span ref={countRef} className="text-gradient">{reasons.length}</span>{' '}
            <span className="text-white">{reasonsSection.headingAfter}</span>
          </h2>

          <h3
            data-animate
            className="italic text-2xl md:text-4xl text-white/70 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {reasonsSection.subheading}
          </h3>

          <p data-animate className="text-white/40 max-w-lg mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
            {reasonsSection.note}
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason, i) => (
            <ReasonCard key={reason.title} reason={reason} index={i} />
          ))}
        </div>

        <div data-animate className="text-center mt-16">
          <p className="italic text-2xl md:text-3xl text-white/60" style={{ fontFamily: "'Playfair Display', serif" }}>
            {reasonsSection.quote}
          </p>
          <p
            className="mt-3 text-white/30 text-sm tracking-widest uppercase"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {reasonsSection.signature}
          </p>
        </div>
      </div>
    </section>
  );
}

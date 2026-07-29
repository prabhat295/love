import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionReveal } from '../hooks/useGSAPAnimations';
import SectionHeader from './SectionHeader';
import { timeline, timelineSection } from '../content';

gsap.registerPlugin(ScrollTrigger);

function TimelineEvent({ event }) {
  const itemRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: 'top 82%', toggleActions: 'play none none none' };

      gsap.fromTo(
        el,
        { opacity: 0, x: event.side === 'left' ? -60 : 60 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: trigger }
      );

      gsap.fromTo(
        dotRef.current,
        { scale: 0 },
        { scale: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.2, scrollTrigger: trigger }
      );
    }, el);

    return () => ctx.revert();
  }, [event.side]);

  const isLeft = event.side === 'left';

  return (
    <div className={`relative flex items-center gap-0 md:gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'} mb-12`}>
      <div
        ref={itemRef}
        className={`w-full md:w-5/12 ${isLeft ? 'md:text-right' : 'md:text-left'}`}
        style={{ opacity: 0 }}
      >
        <div
          className="card-glass rounded-2xl p-6 md:p-8 shimmer-card"
          style={{
            background: 'linear-gradient(135deg, rgba(193,18,31,0.07) 0%, rgba(0,34,53,0.5) 100%)',
            border: '1px solid rgba(251,82,72,0.18)',
          }}
          onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -5, borderColor: 'rgba(251,82,72,0.4)', duration: 0.3 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, borderColor: 'rgba(251,82,72,0.18)', duration: 0.3 })}
        >
          <span
            className="inline-block text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: '#FFC945', fontFamily: "'Lato', sans-serif" }}
          >
            {/* On mobile there's no centre dot, so show the icon next to the date */}
            <span className="md:hidden mr-2">{event.icon}</span>
            {event.date}
          </span>
          <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            {event.title}
          </h3>
          <p className="text-white/55 text-sm leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
            {event.desc}
          </p>
        </div>
      </div>

      {/* Centre dot — desktop only */}
      <div className="hidden md:flex w-2/12 justify-center">
        <div
          ref={dotRef}
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl z-10 pulse-glow"
          style={{
            background: 'linear-gradient(135deg, #C1121F, #FB5248)',
            boxShadow: '0 0 20px rgba(251,82,72,0.4)',
            transform: 'scale(0)',
          }}
        >
          {event.icon}
        </div>
      </div>

      <div className="hidden md:block w-5/12" />
    </div>
  );
}

export default function Timeline() {
  const sectionRef = useSectionReveal(0.1, 40);
  const lineRef = useRef(null);

  /* The vertical line draws itself downward as she scrolls */
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!lineRef.current) return;
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: lineRef.current, start: 'top 80%', end: 'bottom 20%', scrub: 1 },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #001522 0%, #002235 40%, #003049 70%, #001830 100%)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader badge={timelineSection.badge} subheading={timelineSection.subheading} className="mb-20">
          {timelineSection.headingBefore}{' '}
          <span className="text-gradient">{timelineSection.headingHighlight}</span>
        </SectionHeader>

        <div className="relative">
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 bottom-0 hidden md:block"
            style={{
              width: '2px',
              background: 'linear-gradient(to bottom, transparent, #FB5248 10%, #FB5248 90%, transparent)',
              transform: 'translateX(-50%)',
            }}
          />

          {timeline.map((event) => (
            <TimelineEvent key={event.title} event={event} />
          ))}
        </div>

        <div data-animate className="flex flex-col items-center mt-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl pulse-glow"
            style={{
              background: 'linear-gradient(135deg, #C1121F, #FB5248)',
              boxShadow: '0 0 30px rgba(251,82,72,0.5)',
            }}
          >
            ♾️
          </div>
          <p className="italic text-white/50 mt-4 text-lg text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            {timelineSection.endNote}
          </p>
        </div>
      </div>
    </section>
  );
}

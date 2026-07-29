import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Attach the returned ref to a section. Every [data-animate] child inside
 * fades and slides up when the section scrolls into view.
 */
export function useSectionReveal(stagger = 0.15, yOffset = 50) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll('[data-animate]');
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: yOffset },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, yOffset]);

  return ref;
}

/**
 * Staggered entrance for every [data-card] inside the returned ref.
 */
export function useCardReveal({ stagger = 0.1, y = 50, scale = 0.9, start = 'top 78%' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll('[data-card]');
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y, scale },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.78,
          stagger,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, y, scale, start]);

  return ref;
}

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function ScrollToTop() {
  const btnRef = useRef(null);
  const visible = useRef(false);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    gsap.set(btn, { opacity: 0, scale: 0.6, pointerEvents: 'none' });

    const onScroll = () => {
      const shouldShow = window.scrollY > 400;
      if (shouldShow === visible.current) return;
      visible.current = shouldShow;

      gsap.to(btn, {
        opacity: shouldShow ? 1 : 0,
        scale: shouldShow ? 1 : 0.6,
        duration: shouldShow ? 0.4 : 0.3,
        ease: shouldShow ? 'back.out(1.7)' : 'power2.in',
        pointerEvents: shouldShow ? 'auto' : 'none',
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        gsap.fromTo(btnRef.current, { scale: 0.85 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
      }}
      onMouseEnter={() => gsap.to(btnRef.current, { y: -4, duration: 0.25, ease: 'power2.out' })}
      onMouseLeave={() => gsap.to(btnRef.current, { y: 0, duration: 0.25, ease: 'power2.out' })}
      aria-label="Sabse upar jaayein"
      className="fixed bottom-8 right-6 md:right-10 z-50 w-12 h-12 rounded-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #C1121F, #FB5248)',
        boxShadow: '0 4px 20px rgba(193,18,31,0.5)',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 14V4M9 4L4 9M9 4L14 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

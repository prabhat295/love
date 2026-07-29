import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { nav } from '../content';

export default function Navbar() {
  const navRef = useRef(null);
  const borderRef = useRef(null);

  useEffect(() => {
    const el = navRef.current;
    const border = borderRef.current;
    if (!el || !border) return;

    let isSticky = false;

    const onScroll = () => {
      const shouldBeSticky = window.scrollY > 100;
      if (shouldBeSticky === isSticky) return;
      isSticky = shouldBeSticky;

      gsap.to(el, {
        backgroundColor: shouldBeSticky ? 'rgba(0,21,34,0.88)' : 'rgba(0,21,34,0)',
        backdropFilter: shouldBeSticky ? 'blur(18px)' : 'blur(0px)',
        duration: shouldBeSticky ? 0.45 : 0.35,
        ease: 'power2.out',
      });
      gsap.to(border, {
        opacity: shouldBeSticky ? 1 : 0,
        duration: shouldBeSticky ? 0.45 : 0.35,
        ease: 'power2.out',
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
      style={{ backgroundColor: 'rgba(0,21,34,0)', willChange: 'background-color' }}
    >
      <div
        ref={borderRef}
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'rgba(251,82,72,0.18)', opacity: 0 }}
      />

      <span
        className="font-display text-2xl font-bold text-gradient shrink-0"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {nav.logo}
      </span>

      <div
        className="absolute left-1/2 -translate-x-1/2 hidden lg:flex gap-6 text-sm text-white/60 whitespace-nowrap"
        style={{ fontFamily: "'Lato', sans-serif" }}
      >
        {nav.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:text-white transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </div>

      <a
        href="#timeline"
        className="shrink-0 text-sm font-body font-bold text-white px-5 py-2 rounded-full transition-all duration-300 hover:scale-105"
        style={{
          fontFamily: "'Lato', sans-serif",
          background: 'linear-gradient(135deg, #C1121F, #FB5248)',
          boxShadow: '0 4px 16px rgba(193,18,31,0.4)',
        }}
      >
        {nav.cta}
      </a>
    </nav>
  );
}

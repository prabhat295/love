import { useEffect, useRef, useState } from 'react';
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
      className="fixed top-0 left-0 right-0 z-50 px-5 md:px-12 py-4 md:py-5"
      style={{ backgroundColor: 'rgba(0,21,34,0)', willChange: 'background-color' }}
    >
      <div
        ref={borderRef}
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'rgba(251,82,72,0.18)', opacity: 0 }}
      />

      <div className="relative flex items-center justify-between">
        <span
          className="text-xl md:text-2xl font-bold text-gradient shrink-0"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {nav.logo}
        </span>

        {/* Navigation links — desktop centered, mobile scrollable row */}
        <div
          className="flex-1 flex gap-2 sm:gap-4 lg:gap-6 justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2 overflow-x-auto scrollbar-hide text-xs sm:text-sm text-white/60"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#timeline"
          className="shrink-0 text-xs sm:text-sm font-bold text-white px-3 sm:px-4 md:px-5 py-2 rounded-full transition-all duration-300 hover:scale-105"
          style={{
            fontFamily: "'Lato', sans-serif",
            background: 'linear-gradient(135deg, #C1121F, #FB5248)',
            boxShadow: '0 4px 16px rgba(193,18,31,0.4)',
          }}
        >
          {nav.cta}
        </a>
      </div>

    </nav>
  );
}

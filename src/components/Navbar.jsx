import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { nav } from '../content';

export default function Navbar() {
  const navRef = useRef(null);
  const borderRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);

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

  /* Slide the phone menu open and closed */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (open) {
      gsap.set(panel, { display: 'flex' });
      gsap.fromTo(
        panel,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
      gsap.fromTo(
        panel.querySelectorAll('a'),
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.08 }
      );
    } else {
      gsap.to(panel, {
        opacity: 0, y: -12, duration: 0.25, ease: 'power2.in',
        onComplete: () => gsap.set(panel, { display: 'none' }),
      });
    }
  }, [open]);

  /* Escape closes it, and so does resizing up to a desktop width — otherwise
     the panel would still be open, invisible, behind the desktop links. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

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

        {/* Desktop links */}
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

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#timeline"
            className="hidden sm:inline-block text-xs md:text-sm font-bold text-white px-4 md:px-5 py-2 rounded-full transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: "'Lato', sans-serif",
              background: 'linear-gradient(135deg, #C1121F, #FB5248)',
              boxShadow: '0 4px 16px rgba(193,18,31,0.4)',
            }}
          >
            {nav.cta}
          </a>

          {/* Hamburger — phones and tablets only. Six links can't sit side by
              side on a phone, so they move into a panel instead. */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Menu band kijiye' : 'Menu kholiye'}
            aria-expanded={open}
            className="lg:hidden flex flex-col items-center justify-center gap-[5px] w-10 h-10 rounded-full"
            style={{
              background: 'rgba(0,21,34,0.6)',
              border: '1px solid rgba(251,82,72,0.35)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block transition-all duration-300"
                style={{
                  width: 17,
                  height: 1.5,
                  borderRadius: 2,
                  background: '#FB5248',
                  /* Cross when open, three lines when closed */
                  transform: open
                    ? i === 0 ? 'translateY(6.5px) rotate(45deg)'
                      : i === 1 ? 'scaleX(0)'
                      : 'translateY(-6.5px) rotate(-45deg)'
                    : 'none',
                  opacity: open && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* The phone menu */}
      <div
        ref={panelRef}
        className="lg:hidden flex-col gap-1 mt-4 rounded-2xl overflow-hidden"
        style={{
          display: 'none',
          opacity: 0,
          background: 'linear-gradient(160deg, rgba(0,24,42,0.97), rgba(30,5,8,0.97))',
          border: '1px solid rgba(251,82,72,0.25)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(20px)',
          padding: '0.5rem',
        }}
      >
        {nav.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="px-4 py-3 rounded-xl text-white/75 active:text-white transition-colors duration-200 flex items-center gap-3"
            style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.95rem' }}
          >
            <span style={{ color: '#FB5248', fontSize: '0.7rem' }}>♥</span>
            {link.label}
          </a>
        ))}

        {/* The CTA is hidden on the narrowest screens, so repeat it here */}
        <a
          href="#timeline"
          onClick={() => setOpen(false)}
          className="sm:hidden mt-1 px-4 py-3 rounded-xl text-center font-bold text-white"
          style={{
            fontFamily: "'Lato', sans-serif",
            background: 'linear-gradient(135deg, #C1121F, #FB5248)',
            fontSize: '0.95rem',
          }}
        >
          {nav.cta}
        </a>
      </div>
    </nav>
  );
}

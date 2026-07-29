import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionReveal } from '../hooks/useGSAPAnimations';
import SectionHeader from './SectionHeader';
import EmptySlot from './EmptySlot';
import FloatingHearts from './FloatingHearts';
import { gallery } from '../content';
import { photos as allPhotos } from '../media';
import { playFor } from '../backgroundMusic';

gsap.registerPlugin(ScrollTrigger);

/* How many show in the grid before the "see more" button */
const VISIBLE_COUNT = 7;

/* Seconds each photo stays up in the slideshow */
const SLIDE_SECONDS = 3;

function Lightbox({ photos, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const [playing, setPlaying] = useState(true);   // slideshow runs by default
  const imgRef = useRef(null);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % photos.length), [photos.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { setPlaying(false); prev(); }
      else if (e.key === 'ArrowRight') { setPlaying(false); next(); }
      else if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p); }
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [prev, next, onClose]);

  /* Advance every SLIDE_SECONDS. The interval is keyed on `current` as well as
     `playing`, so tapping an arrow restarts the countdown rather than leaving a
     photo up for a fraction of a second. */
  useEffect(() => {
    if (!playing || photos.length < 2) return;
    const t = setTimeout(next, SLIDE_SECONDS * 1000);
    return () => clearTimeout(t);
  }, [playing, current, next, photos.length]);

  /* Cross-fade and drift each photo in, so the slideshow glides rather than
     cutting. Re-runs on every change of `current`. */
  useEffect(() => {
    if (!imgRef.current) return;
    const tween = gsap.fromTo(
      imgRef.current,
      { opacity: 0, scale: 1.06 },
      { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }
    );
    return () => tween.kill();
  }, [current]);

  /* Preload the next photo so the fade never lands on a blank frame */
  useEffect(() => {
    const upcoming = photos[(current + 1) % photos.length];
    if (upcoming) { const img = new Image(); img.src = upcoming.full; }
  }, [current, photos]);

  /* Swipe left/right on a phone */
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.changedTouches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 60) prev();
    else if (dx < -60) next();
    touchStartX.current = null;
  };

  const photo = photos[current];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'rgba(0,10,20,0.96)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Hearts drifting up behind the photo */}
      <FloatingHearts count={12} opacity={0.4} />

      <button
        onClick={onClose}
        aria-label="Band kijiye"
        className="absolute top-5 right-6 z-20 text-white/70 hover:text-white text-3xl font-light leading-none"
      >
        ×
      </button>

      <p className="absolute top-5 left-6 z-20 text-white/50 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
        {current + 1} / {photos.length}
      </p>

      {/* Play / pause, with a ring that drains over the 3 seconds */}
      {photos.length > 1 && (
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Slideshow roken' : 'Slideshow chalayein'}
          title={playing ? 'Pause' : 'Play'}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
          style={{
            background: 'rgba(0,21,34,0.75)',
            border: '1px solid rgba(251,82,72,0.45)',
            backdropFilter: 'blur(10px)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 13,
          }}
        >
          {playing && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
              {/* key={current} restarts the CSS animation on every slide */}
              <circle
                key={current}
                cx="22" cy="22" r="20"
                fill="none" stroke="#FB5248" strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="125.6"
                style={{ animation: `drain ${SLIDE_SECONDS}s linear` }}
              />
            </svg>
          )}
          <span className="relative">{playing ? '❚❚' : '▶'}</span>
        </button>
      )}

      <style>{`
        @keyframes drain {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: 125.6; }
        }
      `}</style>

      <div className="relative z-10 flex items-center justify-center w-full px-4 md:px-16" style={{ maxHeight: '75vh' }}>
        {/* Using an arrow means she's steering, so stop auto-advancing */}
        <button
          onClick={() => { setPlaying(false); prev(); }}
          aria-label="Pichhla"
          className="absolute left-1 md:left-4 z-20 text-white/60 hover:text-white text-4xl select-none px-2"
        >
          ‹
        </button>

        {/* `full` is the high-res version; the grid uses the smaller `src`.
            No `key` here — remounting would kill the cross-fade tween. */}
        <img
          ref={imgRef}
          src={photo.full}
          alt={photo.label}
          className="rounded-xl object-contain"
          style={{
            maxHeight: '72vh',
            maxWidth: '80vw',
            boxShadow: '0 0 70px rgba(193,18,31,0.25), 0 24px 70px rgba(0,0,0,0.7)',
          }}
        />

        <button
          onClick={() => { setPlaying(false); next(); }}
          aria-label="Agla"
          className="absolute right-1 md:right-4 z-20 text-white/60 hover:text-white text-4xl select-none px-2"
        >
          ›
        </button>
      </div>

      <div className="relative z-10 mt-4 text-center px-4">
        <span
          className="text-xs tracking-widest uppercase px-3 py-1 rounded-full mr-2"
          style={{
            background: 'rgba(251,82,72,0.2)',
            border: '1px solid rgba(251,82,72,0.4)',
            color: '#FB5248',
            fontFamily: "'Lato', sans-serif",
          }}
        >
          {photo.tag}
        </span>
        <span className="text-white/80 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
          {photo.label}
        </span>
      </div>

      <div className="relative z-10 flex gap-2 mt-5 overflow-x-auto px-4 pb-1" style={{ maxWidth: '90vw' }}>
        {photos.map((thumb, i) => (
          <button
            key={thumb.id}
            onClick={() => { setPlaying(false); setCurrent(i); }}
            aria-label={thumb.label}
            className="flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200"
            style={{
              width: 56,
              height: 56,
              outline: i === current ? '2px solid #FB5248' : '2px solid transparent',
              opacity: i === current ? 1 : 0.5,
            }}
          >
            <img
              src={thumb.thumb}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function MemoryCard({ photo, index, onOpen }) {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);
  /* The 1st and 4th cards are double-height, which makes the grid look
     hand-arranged rather than like a spreadsheet. */
  const isTall = index === 0 || index === 3;

  const handleMouseEnter = () => {
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    gsap.to(cardRef.current.querySelector('img'), { scale: 1.08, duration: 0.6, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' });
    gsap.to(cardRef.current.querySelector('img'), { scale: 1, duration: 0.6, ease: 'power2.out' });
  };

  return (
    <div
      ref={cardRef}
      data-card
      className={`relative rounded-2xl overflow-hidden cursor-pointer group ${isTall ? 'row-span-2' : ''}`}
      style={{ border: '1px solid rgba(251,82,72,0.15)', minHeight: isTall ? '420px' : '220px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(index)}
    >
      <img
        src={photo.src}
        alt={photo.label}
        className="w-full h-full object-cover"
        style={{ display: 'block', minHeight: isTall ? '420px' : '220px' }}
        loading="lazy"
        decoding="async"
      />

      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,21,34,0.85) 0%, transparent 60%)' }}
      />

      <div className="absolute bottom-4 left-4 right-4">
        <span
          className="text-xs tracking-widest uppercase px-3 py-1 rounded-full mb-2 inline-block"
          style={{
            background: 'rgba(251,82,72,0.2)',
            border: '1px solid rgba(251,82,72,0.4)',
            fontFamily: "'Lato', sans-serif",
            color: '#FB5248',
          }}
        >
          {photo.tag}
        </span>
        <h3 className="text-white text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
          {photo.label}
        </h3>
      </div>

      <div
        ref={overlayRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: 0,
          background: 'linear-gradient(135deg, rgba(193,18,31,0.7) 0%, rgba(53,89,117,0.7) 100%)',
        }}
      >
        <span className="text-5xl heart-beat" style={{ color: 'white' }}>♥</span>
      </div>
    </div>
  );
}

/* One gallery section. `filter` picks which photos belong to it — that's what
   lets the engagement photos and Shivani's photos be two separate sections,
   each with its own song and its own lightbox. */
export default function Gallery({
  id = 'gallery',
  copy = gallery,
  filter = null,
  songKey = null,
  background = 'linear-gradient(180deg, #002235 0%, #001830 50%, #002235 100%)',
}) {
  const sectionRef = useSectionReveal(0.1, 40);
  const gridRef = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const photos = filter ? allPhotos.filter(filter) : allPhotos;

  /* Starting the song here — inside the click handler — is what makes it
     actually play. Browsers block audio that isn't triggered by a real user
     gesture, and a click is one. Starting it on scroll would get blocked. */
  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    if (songKey) playFor(songKey);
  }, [songKey]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const visible = photos.slice(0, VISIBLE_COUNT);
  const hasMore = photos.length > VISIBLE_COUNT;

  useEffect(() => {
    if (!photos.length) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('[data-card]');
      if (!cards?.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.88, y: 50 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.8, stagger: 0.1, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: gridRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        }
      );
    });

    return () => ctx.revert();
  }, [photos.length]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader badge={copy.badge} subheading={copy.subheading}>
          {copy.headingBefore} <span className="text-gradient">{copy.headingHighlight}</span>
        </SectionHeader>

        {photos.length === 0 ? (
          <EmptySlot icon="🖼️" title={copy.emptyTitle} hint={copy.emptyHint} />
        ) : (
          <>
            {/* Tells her a photo does something when tapped — without this the
                song never starts, because she has no reason to click. */}
            {songKey && (
              <p
                data-animate
                className="text-center text-xs tracking-[0.25em] uppercase mb-8 flex items-center justify-center gap-2"
                style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(255,201,69,0.6)' }}
              >
                <span>♪</span>
                <span>{copy.tapHint}</span>
              </p>
            )}

            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              style={{ gridAutoRows: '220px' }}
            >
              {visible.map((photo, i) => (
                <MemoryCard key={photo.id} photo={photo} index={i} onOpen={openLightbox} />
              ))}
            </div>

            <div className="text-center mt-10">
              <button
                onClick={() => openLightbox(hasMore ? VISIBLE_COUNT : 0)}
                className="inline-flex items-center gap-3 px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(193,18,31,0.15) 0%, rgba(53,89,117,0.15) 100%)',
                  border: '1px solid rgba(251,82,72,0.5)',
                  color: '#FB5248',
                  fontFamily: "'Lato', sans-serif",
                  boxShadow: '0 0 24px rgba(251,82,72,0.15)',
                }}
              >
                <span>♥</span>
                <span>{copy.seeMore} ({photos.length})</span>
              </button>
            </div>
          </>
        )}

        <div data-animate className="text-center mt-10">
          <p className="italic text-white/40 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            {copy.quote}
          </p>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox photos={photos} startIndex={lightboxIndex} onClose={closeLightbox} />
      )}
    </section>
  );
}

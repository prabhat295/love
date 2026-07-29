import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionReveal } from '../hooks/useGSAPAnimations';
import { finale } from '../content';

gsap.registerPlugin(ScrollTrigger);

const CONFETTI_COLORS = ['#FB5248', '#FFC945', '#FFB3B0', '#fff', '#C1121F', '#FF85A1', '#FFD700'];

/* Fixed positions so the burst looks the same every time */
const PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: `${5 + ((i * 37) % 90)}%`,
  y: `${5 + ((i * 61) % 90)}%`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  isRect: i % 3 === 0,
}));

function ChoiceButtons() {
  const [answered, setAnswered] = useState(false);
  /* Which line the No button is currently showing. Kept in state rather than
     poked into the DOM so the button can restyle itself as it gets desperate. */
  const [dodges, setDodges] = useState(0);
  const noRef = useRef(null);
  const confettiRef = useRef(null);
  const messageRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });

  const isLastPlea = dodges === finale.noTexts.length - 1;

  const burst = (spread) => {
    if (!confettiRef.current) return;
    gsap.fromTo(
      confettiRef.current.querySelectorAll('div'),
      { scale: 0, x: 0, y: 0, rotation: 0, opacity: 1 },
      {
        scale: () => gsap.utils.random(0.8, 1.6),
        x: () => gsap.utils.random(-spread, spread),
        y: () => gsap.utils.random(-spread - 50, 60),
        rotation: () => gsap.utils.random(-360, 360),
        opacity: 0,
        duration: () => gsap.utils.random(1, 1.9),
        stagger: { amount: 0.35, from: 'random' },
        ease: 'power3.out',
      }
    );
  };

  const handleYes = () => {
    /* Let the No button admit defeat before it vanishes */
    if (noRef.current) {
      gsap.to(noRef.current, { x: 0, y: 0, duration: 0.2 });
      noRef.current.textContent = finale.noCaught;
      gsap.fromTo(noRef.current, { scale: 0.8, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' });
    }

    burst(200);
    setTimeout(() => {
      setAnswered(true);
      burst(220);
    }, 900);
  };

  /* Called on hover (desktop) and on tap (phone) — so it dodges either way */
  const dodge = () => {
    const btn = noRef.current;
    if (answered || !btn) return;

    const next = Math.min(dodges + 1, finale.noTexts.length - 1);
    setDodges(next);
    gsap.fromTo(btn, { scale: 0.85 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });

    /* Once it's begging, stop running — let her actually reach it */
    if (next === finale.noTexts.length - 1) {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
      lastPos.current = { x: 0, y: 0 };
      return;
    }

    /* Pick a spot that isn't basically where it already was */
    const RANGE = 100;
    let nx, ny, attempts = 0;
    do {
      nx = Math.round((Math.random() * 2 - 1) * RANGE);
      ny = Math.round((Math.random() * 2 - 1) * RANGE);
      attempts++;
    } while (
      attempts < 12 &&
      Math.abs(nx - lastPos.current.x) < 80 &&
      Math.abs(ny - lastPos.current.y) < 40
    );

    lastPos.current = { x: nx, y: ny };
    gsap.to(btn, { x: nx, y: ny, duration: 0.32, ease: 'power3.out' });
  };

  useEffect(() => {
    if (answered && messageRef.current) {
      gsap.fromTo(
        messageRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2)' }
      );
    }
  }, [answered]);

  /* The final plea gets a slow, sad pulse so it reads as begging */
  useEffect(() => {
    if (!isLastPlea || !noRef.current) return;
    const tween = gsap.to(noRef.current, {
      scale: 1.04,
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    return () => tween.kill();
  }, [isLastPlea]);

  /* Hovering YES pulls the No button back into place — makes YES feel easy */
  const recallNo = () => {
    if (!noRef.current || isLastPlea) return;
    gsap.to(noRef.current, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' });
    lastPos.current = { x: 0, y: 0 };
  };

  return (
    <div className="relative flex flex-col items-center gap-8">
      <h3
        className="text-2xl md:text-4xl font-bold text-white text-center"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {finale.question.replace(finale.questionHighlight, '')}
        <em className="text-gradient not-italic">{finale.questionHighlight}</em>
      </h3>

      {!answered ? (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleYes}
            onMouseEnter={recallNo}
            className="relative px-8 md:px-10 py-4 rounded-full font-bold text-white text-lg tracking-wider overflow-hidden transition-transform duration-200 hover:scale-105 shrink-0"
            style={{
              background: 'linear-gradient(135deg, #C1121F, #FB5248)',
              boxShadow: '0 8px 30px rgba(193,18,31,0.5)',
              fontFamily: "'Lato', sans-serif",
            }}
          >
            {finale.yesButton}
          </button>

          {/* Anchor stays put and holds a FIXED width; the button inside moves.
              Without the fixed width, longer lines like "Aise picha nahi
              chhutega" stretched the button and shoved the heading off-screen. */}
          <div
            className="shrink-0 flex justify-center"
            style={{ overflow: 'visible', width: 'min(19rem, 80vw)' }}
          >
            <button
              ref={noRef}
              onMouseEnter={dodge}
              onClick={dodge}
              className="block px-6 py-4 rounded-full font-bold text-base sm:text-lg tracking-wide border select-none whitespace-nowrap transition-colors duration-500"
              style={{
                fontFamily: "'Lato', sans-serif",
                cursor: 'default',
                position: 'relative',
                zIndex: 50,
                /* Fades from dismissive grey to a soft, sad rose as it gives up */
                color: isLastPlea ? 'rgba(255,179,176,0.95)' : 'rgba(255,255,255,0.4)',
                borderColor: isLastPlea ? 'rgba(251,82,72,0.55)' : 'rgba(255,255,255,0.15)',
                background: isLastPlea ? 'rgba(251,82,72,0.10)' : 'transparent',
                boxShadow: isLastPlea ? '0 0 26px rgba(251,82,72,0.18)' : 'none',
              }}
            >
              {finale.noTexts[dodges]}
            </button>
          </div>
        </div>
      ) : (
        <div ref={messageRef} className="text-center" style={{ opacity: 0 }}>
          <p
            className="italic text-xl md:text-3xl text-gradient"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {finale.yesReply}
          </p>
        </div>
      )}

      <div ref={confettiRef} className="absolute inset-0 pointer-events-none overflow-visible">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              width: p.isRect ? '10px' : '8px',
              height: p.isRect ? '5px' : '8px',
              borderRadius: p.isRect ? '2px' : '50%',
              background: p.color,
              transform: 'scale(0)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const sectionRef = useSectionReveal(0.15, 45);
  const bigHeartRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = bigHeartRef.current;
      if (!el) return;

      gsap.fromTo(
        el,
        { scale: 0.5, opacity: 0, rotation: -20 },
        {
          scale: 1, opacity: 1, rotation: 0,
          duration: 1.2, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      gsap.to(el, { scale: 1.07, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="say-yes"
        ref={sectionRef}
        className="relative py-24 md:py-36 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #001830 0%, #002235 50%, #001522 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="divider-rose mb-16 mx-auto w-3/4" />

          <div className="text-center mb-12">
            <span ref={bigHeartRef} className="inline-block text-8xl md:text-9xl select-none" style={{ opacity: 0 }}>
              ❤️
            </span>
          </div>

          {/* The No button moves up to 100px in any direction, so this needs
              room to spare — otherwise it clips against the heading below. */}
          <div data-animate className="mb-24 md:mb-28 py-6">
            <ChoiceButtons />
          </div>

          <div data-animate className="text-center">
            <h2
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {finale.headingBefore}{' '}
              <span className="text-gradient">{finale.headingHighlight}</span>
            </h2>
            <p
              className="text-white/50 text-lg max-w-lg mx-auto mb-10"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {finale.closing}
            </p>

            <div
              className="inline-flex flex-col items-center gap-2 text-sm text-white/30"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {finale.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </div>

          <div className="divider-rose mt-16 mx-auto w-3/4" />
        </div>
      </section>

      <footer
        className="py-8 text-center px-6"
        style={{ background: '#000e18', borderTop: '1px solid rgba(251,82,72,0.15)' }}
      >
        <p className="text-white/30 text-sm tracking-wide" style={{ fontFamily: "'Lato', sans-serif" }}>
          {finale.footerNote} <span style={{ color: '#FB5248' }}>❤️</span>
        </p>
        <p className="text-white/30 text-xs mt-2" style={{ fontFamily: "'Lato', sans-serif" }}>
          {finale.footerCredit}
        </p>
      </footer>
    </>
  );
}

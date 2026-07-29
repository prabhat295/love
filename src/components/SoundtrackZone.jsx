import { useEffect, useRef } from 'react';
import { playFor } from '../backgroundMusic';

/* Silences whatever song is playing while this section is on screen, and lets
   it resume afterwards. Used for the video section, which has its own audio.

   Songs are STARTED by clicking a photo (see Gallery.jsx) rather than by
   scrolling — browsers block audio that isn't triggered by a real user gesture,
   so a scroll-started song simply never plays. Stopping audio has no such
   restriction, which is why this direction works fine on scroll.

   IntersectionObserver rather than a scroll handler: it fires only on the way
   in and out, and costs nothing while she's just watching. */
export default function SoundtrackZone({ songKey, children }) {
  const ref = useRef(null);
  const wasPlaying = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !songKey) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          wasPlaying.current = playFor(songKey);   // returns the key it replaced
        } else if (wasPlaying.current) {
          playFor(wasPlaying.current);             // put the song back
          wasPlaying.current = null;
        }
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [songKey]);

  return <div ref={ref}>{children}</div>;
}

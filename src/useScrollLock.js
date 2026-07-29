import { useEffect } from 'react';

/* Freezes the page behind a modal.

   `body { overflow: hidden }` on its own is not enough:
     - iOS Safari ignores it and rubber-band scrolls anyway
     - the scrollbar vanishing makes the page jump sideways
     - touchmove still drags the page under the overlay

   So: pin the body at its current offset with position: fixed, pad for the
   scrollbar width, and restore the exact scroll position on the way out.

   Nested locks are counted, so a lightbox opened over a popup doesn't unlock
   the page when only the inner one closes. */

let depth = 0;
let saved = null;

function lock() {
  if (depth++ > 0) return;

  const y = window.scrollY;
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  const body = document.body;

  saved = {
    y,
    position: body.style.position,
    top: body.style.top,
    width: body.style.width,
    paddingRight: body.style.paddingRight,
    overflow: body.style.overflow,
  };

  body.style.position = 'fixed';
  body.style.top = `-${y}px`;
  body.style.width = '100%';
  body.style.overflow = 'hidden';
  /* Stops the layout shifting left when the scrollbar disappears */
  if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
}

function unlock() {
  if (--depth > 0) return;
  if (!saved) return;

  const body = document.body;
  body.style.position = saved.position;
  body.style.top = saved.top;
  body.style.width = saved.width;
  body.style.paddingRight = saved.paddingRight;
  body.style.overflow = saved.overflow;

  /* 'auto' so it snaps back rather than visibly gliding, which would look
     like the page moving on its own */
  window.scrollTo({ top: saved.y, behavior: 'auto' });
  saved = null;
  depth = 0;
}

export default function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}

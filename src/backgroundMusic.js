/* The soundtrack. Lives outside React so that scrolling into a section can
   change the song without components needing to know about each other.

   One Audio object per track, created lazily and kept module-level: React
   StrictMode mounts twice in dev, and two Audio objects would play the same
   song a fraction of a second apart. */

import { soundtrack, openingSong } from './content';
import { publicUrl } from './publicUrl';

const tracks = new Map();   // key -> HTMLAudioElement
const listeners = new Set();
const failed = new Set();   // keys whose file is missing or won't decode

let currentKey = null;      // what should be playing
let mutedByUser = false;    // she pressed pause — respect it until she presses play
let started = false;        // has playback ever been allowed by the browser

const config = (key) => soundtrack.find((s) => s.for === key);

/* Works out where a song actually lives. `file` may be a plain filename in
   public/songs/, any full URL, or a Google Drive share link — Drive's
   /file/d/<id>/view page can't be played directly, so pull the ID out and
   rewrite it to the endpoint that serves the bytes. */
export function songUrl(file) {
  if (!file) return '';

  if (/^https?:\/\//i.test(file)) {
    const driveId = file.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/)?.[1]
                 || file.match(/[?&]id=([a-zA-Z0-9_-]{25,})/)?.[1];
    if (driveId) return `https://drive.google.com/uc?export=download&id=${driveId}`;
    return file;
  }

  return publicUrl(`songs/${file}`);
}

function audioFor(key) {
  const cfg = config(key);
  if (!cfg?.file || failed.has(key)) return null;

  if (!tracks.has(key)) {
    const src = songUrl(cfg.file);
    const el = new Audio(src);
    el.loop = true;
    el.volume = 0;                       // always fade in, never start at full
    el.addEventListener('error', () => {
      failed.add(key);
      tracks.delete(key);
      /* Silent failure is what made this so confusing to debug — say it out
         loud in the console so the cause is obvious. */
      const isUrl = /^https?:\/\//i.test(cfg.file);
      console.warn(
        `[music] Could not load the song for the "${key}" section.\n` +
        `  Tried: ${src}\n` +
        (isUrl
          ? '  If this is a Google Drive link, check the file is shared as\n' +
            '  "Anyone with the link". Very large files can also hit Drive\'s\n' +
            '  virus-scan page, which returns HTML instead of audio.'
          : `  Put the file at public/songs/${cfg.file}, or fix the name in\n` +
            '  src/content.js → soundtrack.')
      );
      notify();
    });
    tracks.set(key, el);
  }
  return tracks.get(key);
}

/* ── Fading ───────────────────────────────────────────────────────────
   requestAnimationFrame rather than CSS or setInterval: it stops running
   when the tab is hidden, which is exactly what we want. */
const fades = new Map();

function fadeTo(el, target, ms, onDone) {
  fades.get(el)?.();                     // cancel any fade already in flight

  const from = el.volume;
  const start = performance.now();
  let cancelled = false;
  fades.set(el, () => { cancelled = true; });

  const step = (now) => {
    if (cancelled) return;
    const t = ms === 0 ? 1 : Math.min(1, (now - start) / ms);
    el.volume = Math.max(0, Math.min(1, from + (target - from) * t));
    if (t < 1) requestAnimationFrame(step);
    else { fades.delete(el); onDone?.(); }
  };
  requestAnimationFrame(step);
}

/* ── Public API ───────────────────────────────────────────────────────── */

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
const notify = () => listeners.forEach((fn) => fn());

export function nowPlaying() {
  const el = currentKey ? tracks.get(currentKey) : null;
  if (!el || el.paused || mutedByUser) return null;
  return config(currentKey)?.title || null;
}

export function isMuted() {
  return mutedByUser;
}

export function hasAnySong() {
  return soundtrack.some((s) => s.file && !failed.has(s.for));
}

/* Switch to the song for `key`, cross-fading out whatever is playing.
   Passing 'video' (or any key with no file) fades everything to silence.

   Returns the key that was playing before, so a caller can restore it —
   that's how the video section puts the song back when she scrolls away.

   Must be called from inside a click handler the first time, or the browser
   will refuse to start any audio at all. */
export function playFor(key) {
  const previous = currentKey;
  if (key === currentKey) return previous;
  currentKey = key;

  /* Fade out everything that isn't the new track. Pausing rather than
     resetting currentTime, so a resumed song picks up where it left off. */
  for (const [k, el] of tracks) {
    if (k !== key && !el.paused) {
      fadeTo(el, 0, 700, () => el.pause());
    }
  }

  const next = audioFor(key);
  if (!next || mutedByUser) { notify(); return previous; }

  const target = config(key)?.volume ?? 0.5;
  next.play()
    .then(() => { started = true; fadeTo(next, target, 900); notify(); })
    .catch(() => { /* not a user gesture — the play button still works */ });

  return previous;
}

/* Her first tap anywhere. Only does something if content.js sets an
   openingSong — by default nothing plays until she opens a photo. */
export function unlock() {
  if (started || mutedByUser || !openingSong) return;
  playFor(openingSong);
}

export function toggleMute() {
  mutedByUser = !mutedByUser;

  if (mutedByUser) {
    for (const el of tracks.values()) {
      if (!el.paused) fadeTo(el, 0, 350, () => el.pause());
    }
    notify();
    return mutedByUser;
  }

  /* Un-muting: resume the current song, or the opening one if she pressed
     play before opening any photo. */
  const key = currentKey || openingSong;
  const el = key ? audioFor(key) : null;
  if (el) {
    currentKey = key;
    const target = config(key)?.volume ?? 0.5;
    el.play().then(() => { started = true; fadeTo(el, target, 600); notify(); }).catch(() => {});
  }

  notify();
  return mutedByUser;
}

/* Kept for App/MusicPlayer to call on mount — a no-op unless openingSong is set */
export function playOpening() {
  if (openingSong) playFor(openingSong);
}

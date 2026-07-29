/* Keeps her signed in for a while, then sends her back to the password screen.

   Stores an expiry timestamp rather than running a countdown, so the session
   still expires correctly if she refreshes, or leaves the tab open overnight
   and comes back — a plain setTimeout would restart from scratch each reload. */

import { session } from './content';

const KEY = 'unlockedUntil';
const store = () => window.sessionStorage;

/* Every touch, scroll or keypress pushes the expiry back, so she is never
   logged out mid-scroll — only after genuinely being idle. */
const ACTIVITY_EVENTS = ['click', 'keydown', 'touchstart', 'scroll', 'pointerdown'];

export const timeoutMs = () => Math.max(1, session.timeoutMinutes) * 60_000;

export function isUnlocked() {
  const until = Number(store().getItem(KEY));
  if (!until) return false;

  if (Date.now() >= until) {
    store().removeItem(KEY);
    return false;
  }
  return true;
}

export function unlock() {
  store().setItem(KEY, String(Date.now() + timeoutMs()));
}

export function lock() {
  store().removeItem(KEY);
}

/* Push the expiry back, but only if she's currently unlocked — otherwise a
   stray click on the password screen would silently grant a session. */
export function touch() {
  if (!store().getItem(KEY)) return;
  if (Date.now() >= Number(store().getItem(KEY))) return;
  store().setItem(KEY, String(Date.now() + timeoutMs()));
}

/* Calls `onExpire` the moment the session runs out.

   Checks on a 1s tick as well as on activity, because a laptop that goes to
   sleep freezes timers — on wake, comparing timestamps gets the right answer
   where a pending setTimeout would fire late. */
export function watch(onExpire) {
  if (!session.idleLogout) return () => {};

  const check = () => { if (!isUnlocked()) onExpire(); };

  const onActivity = () => { touch(); check(); };
  ACTIVITY_EVENTS.forEach((e) =>
    document.addEventListener(e, onActivity, { passive: true })
  );

  const tick = setInterval(check, 1000);
  document.addEventListener('visibilitychange', check);

  return () => {
    ACTIVITY_EVENTS.forEach((e) => document.removeEventListener(e, onActivity));
    document.removeEventListener('visibilitychange', check);
    clearInterval(tick);
  };
}

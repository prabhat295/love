/* Tells you what's missing before you find out by staring at a silent page.
   Run it any time:   npm run check                                        */

import { readdirSync, existsSync } from 'node:fs';
import { soundtrack, drivePhotos, videos, welcomeDrivePhoto } from './src/content.js';

const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const no = (m) => console.log(`  \x1b[31m✗\x1b[0m ${m}`);
const info = (m) => console.log(`    \x1b[2m${m}\x1b[0m`);

let problems = 0;

console.log('\n\x1b[1mSongs\x1b[0m');
const songDir = 'public/songs';
const songFiles = existsSync(songDir)
  ? readdirSync(songDir).filter((f) => /\.(mp3|m4a|ogg|wav)$/i.test(f))
  : [];

for (const s of soundtrack) {
  if (!s.file) { info(`"${s.for}" section is silent on purpose`); continue; }

  /* A full URL is hosted elsewhere — check it actually serves audio */
  if (/^https?:\/\//i.test(s.file)) {
    const driveId = s.file.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/)?.[1];
    const url = driveId
      ? `https://drive.google.com/uc?export=download&id=${driveId}`
      : s.file;

    try {
      const res = await fetch(url, { redirect: 'follow' });
      const type = res.headers.get('content-type') || '';
      const mb = ((+res.headers.get('content-length') || 0) / 1048576).toFixed(1);

      if (res.ok && type.startsWith('audio/')) {
        ok(`${s.for.padEnd(11)} ${s.title} — ${type}, ${mb} MB`);
      } else {
        problems++;
        no(`${s.for.padEnd(11)} ${s.title} — served "${type}", not audio`);
        info(driveId ? 'is the file shared as "Anyone with the link"?' : url);
      }
    } catch (e) {
      problems++;
      no(`${s.for.padEnd(11)} ${s.title} — could not reach it (${e.message})`);
    }
    continue;
  }

  if (songFiles.includes(s.file)) {
    ok(`${s.for.padEnd(11)} ${s.file}`);
  } else {
    problems++;
    no(`${s.for.padEnd(11)} ${s.file}  — NOT FOUND`);
    info(`put it at public/songs/${s.file}`);
  }
}

/* Files sitting there unused — usually a filename typo, so worth pointing out.
   URLs are excluded; they're not meant to be in public/songs/. */
const wanted = soundtrack
  .map((s) => s.file)
  .filter((f) => f && !/^https?:\/\//i.test(f));
const stray = songFiles.filter((f) => !wanted.includes(f));
if (stray.length) {
  console.log('');
  for (const f of stray) {
    no(`public/songs/${f} is not used by any section`);
    info(`rename it, or point soundtrack[].file at it in src/content.js`);
    problems++;
  }
}

console.log('\n\x1b[1mVideo\x1b[0m');
for (const v of videos) {
  if (v.youtubeId) ok(`${v.title} — YouTube ${v.youtubeId}`);
  else if (v.driveId) ok(`${v.title} — Google Drive embed`);
  else if (v.file) {
    if (existsSync(`public/videos/${v.file}`)) ok(`${v.title} — ${v.file}`);
    else { problems++; no(`${v.title} — public/videos/${v.file} NOT FOUND`); }
  } else { problems++; no(`${v.title} has no source at all`); }
}

console.log('\n\x1b[1mPhotos\x1b[0m');
const heroDir = 'src/assets/photos/hero';
const heroFiles = existsSync(heroDir)
  ? readdirSync(heroDir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
  : [];

for (const g of drivePhotos) ok(`${g.key.padEnd(11)} ${g.ids.length} photos from Drive`);

if (heroFiles.length) ok(`welcome popup uses local ${heroFiles[0]}`);
else if (welcomeDrivePhoto?.id) ok(`welcome popup uses Drive ${welcomeDrivePhoto.id.slice(0, 12)}…`);
else { problems++; no('welcome popup has no photo'); }

console.log(
  problems === 0
    ? '\n\x1b[32mAll media present.\x1b[0m\n'
    : `\n\x1b[33m${problems} thing(s) still missing — the site will run, just without them.\x1b[0m\n`
);

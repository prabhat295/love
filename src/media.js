/* Where the gallery photos come from. Two sources, both optional:

   1. GOOGLE DRIVE — the `drivePhotos` list in content.js. Loads over the
      internet, so nothing has to sit on this laptop.
   2. LOCAL FILES — anything dropped into src/assets/photos/<folder>/.
      Auto-discovered, no filenames listed anywhere.

   Drive photos come first, then local. Using both at once is fine.

   Local files only pick up .jpg .jpeg .png .webp .avif (any case).
   iPhone .heic will NOT render in a browser — convert it to .jpg. */

import { galleryGroups, photoCaptions, drivePhotos, welcomeDrivePhoto } from './content';

/* ── Google Drive ──────────────────────────────────────────────────────
   `lh3.googleusercontent.com/d/<id>` serves the raw image bytes, and the
   =wNNNN suffix asks Drive to resize before sending. That matters a lot:
   these are ~775 KB straight off a phone, but ~130 KB at w800. Over mobile
   data that's the difference between instant and a ten-second wait.        */
const GRID_WIDTH = 900;   // the small cards in the grid
const FULL_WIDTH = 1600;  // the full-screen lightbox view
const THUMB_WIDTH = 160;  // the little strip along the bottom of the lightbox

const driveUrl = (id, width) => `https://lh3.googleusercontent.com/d/${id}=w${width}`;

/* ── Local files ───────────────────────────────────────────────────────
   Vite reads these calls without running the file, so both arguments have
   to be written out literally — no variables, no shared options object.
   That's why the same pattern is repeated on every line.                  */
const FOLDERS = {
  'hero': import.meta.glob(
    './assets/photos/hero/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
    { eager: true, query: '?url', import: 'default' }),
  'first-meet': import.meta.glob(
    './assets/photos/first-meet/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
    { eager: true, query: '?url', import: 'default' }),
  'birthday': import.meta.glob(
    './assets/photos/birthday/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
    { eager: true, query: '?url', import: 'default' }),
  'families-said-yes': import.meta.glob(
    './assets/photos/families-said-yes/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
    { eager: true, query: '?url', import: 'default' }),
  'engagement': import.meta.glob(
    './assets/photos/engagement/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
    { eager: true, query: '?url', import: 'default' }),
  'us': import.meta.glob(
    './assets/photos/us/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
    { eager: true, query: '?url', import: 'default' }),
};

const basename = (path) => path.slice(path.lastIndexOf('/') + 1);

/* Sort so 1.jpg, 2.jpg, 10.jpg come out in that order rather than 1, 10, 2 */
const naturally = (a, b) =>
  basename(a).localeCompare(basename(b), undefined, { numeric: true, sensitivity: 'base' });

function filesIn(folder) {
  const found = FOLDERS[folder] || {};
  return Object.keys(found)
    .sort(naturally)
    .map((path) => ({ url: found[path], file: basename(path) }));
}

/* ── Build the one list the gallery renders ────────────────────────────
   Every photo, Drive or local, ends up with the same shape:
     { id, src, full, thumb, tag, label }                                  */

const fromDrive = drivePhotos.flatMap((group) =>
  group.ids.map((id, i) => ({
    id: `drive/${id}`,
    group: group.key,          // 'engagement' | 'us' — sections filter on this
    src: driveUrl(id, GRID_WIDTH),
    full: driveUrl(id, FULL_WIDTH),
    thumb: driveUrl(id, THUMB_WIDTH),
    tag: group.tag,
    label: photoCaptions[`${group.key}/${id}`] || group.labels[i % group.labels.length],
  }))
);

const fromLocal = galleryGroups.flatMap((group) =>
  filesIn(group.key).map((p, i) => ({
    id: `${group.key}/${p.file}`,
    group: group.key,
    /* Local files are already the right size — one URL serves all three uses */
    src: p.url,
    full: p.url,
    thumb: p.url,
    tag: group.tag,
    label: photoCaptions[`${group.key}/${p.file}`] || group.labels[i % group.labels.length],
  }))
);

export const photos = [...fromDrive, ...fromLocal];

/* ── The photo in the welcome popup ────────────────────────────────────
   Prefers a local file in src/assets/photos/hero/, then the Drive photo
   named in content.js, then just the first gallery photo.                 */
const heroLocal = filesIn('hero').map((p) => p.url);

function pickWelcome() {
  /* A local file in src/assets/photos/hero/ always wins */
  if (heroLocal[0]) return heroLocal[0];

  /* Then the Drive photo named in content.js */
  if (welcomeDrivePhoto?.id) return driveUrl(welcomeDrivePhoto.id, FULL_WIDTH);

  /* Last resort so the popup is never empty */
  return photos[0]?.full || '';
}

export const welcomePhoto = pickWelcome();

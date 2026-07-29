# Photos go here

Drop your photos straight into these folders. **No filenames to type anywhere** —
the site finds them automatically and sorts them by name.

| Folder | What goes in it |
|---|---|
| `hero/` | 1–2 favourite photos of you both. The first one shows in the welcome popup |
| `first-meet/` | 25 December 2025 — the first meeting |
| `birthday/` | 4 February — Shivani's birthday |
| `families-said-yes/` | 8 February 2026 |
| `engagement/` | 13 March 2026 — this is the main gallery, put the most here |
| `us/` | Anything else — candids, selfies, screenshots |

## Formats

Works: `.jpg` `.jpeg` `.png` `.webp` `.avif`

**Does not work: `.heic`** (what iPhones save by default). Browsers can't display
HEIC at all. On an iPhone, either set Camera → Formats → **Most Compatible**
before shooting, or convert the files to `.jpg` first.

## Naming, if you care about order

Photos are sorted by filename, so `1.jpg`, `2.jpg`, `3.jpg` gives you exact
control. Phone filenames like `IMG_20260313_154501.jpg` work fine too — they
sort into the order they were taken.

## Captions

Each folder has a default caption set in `src/content.js`. To name one specific
photo, add it to `photoCaptions` there:

```js
export const photoCaptions = {
  'engagement/IMG_1234.jpg': 'Jab haath kaanp rahe the',
};
```

# Videos go here

Put your engagement video in this folder and name it **`sagai.mp4`** — that's the
filename `src/content.js` is already looking for.

Want a different name, or more than one video? Edit the `videos` list in
`src/content.js`:

```js
export const videos = [
  {
    file: 'sagai.mp4',        // exact filename in this folder
    poster: '',               // optional: a .jpg in this folder, shown before play
    title: 'Sagai Ka Din',
    caption: '13 March 2026 — jo din main kabhi nahi bhool paunga.',
  },
];
```

## Format

**`.mp4` (H.264)** plays everywhere — phones, laptops, WhatsApp-shared links.
`.mov` from an iPhone usually works on Apple devices but not reliably elsewhere,
so convert it.

## Size

Keep it under about 100 MB. A big raw phone video can be 500 MB+, which makes
the site slow to load and is too large for GitHub Pages. If yours is huge, tell
Claude and it'll compress it with ffmpeg — a 10-minute video compresses to
roughly 50 MB with no visible quality loss.

If the file isn't here yet, the site shows a dashed placeholder box instead of
breaking. Only you will ever see that.

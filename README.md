# Sirf Aapke Liye ❤️

A surprise site for **Shivani Priya**, from **Prabhat Kumar**.

---

## Run it

You need Node.js installed ([nodejs.org](https://nodejs.org), the LTS version).
Then, in this folder:

```bash
npm install     # once, the first time
npm run dev     # every time you want to see it
```

It prints a link like `http://localhost:5173/` — open that. Leave it running:
every time you save a file, the page updates itself.

The password is **`i love you`** (spaces and capitals don't matter).

## The two things you'll actually touch

| File | What it holds |
|---|---|
| **`src/content.js`** | Every single word on the site. All of it. Nothing else needs editing |
| **`src/assets/photos/`** | Drop photos into the folders. They appear on their own |

Plus `public/videos/sagai.mp4` for the engagement video.

`src/content.js` is written as a first draft — the dates are real, the words are
my guess at your voice. Rewrite anything that doesn't sound like you. That's the
part she'll actually remember.

---

## Where everything is

```
src/
├── content.js          ← ALL the words. Start here.
├── media.js            ← finds your photos automatically. Don't touch.
├── index.css           ← colours and fonts
├── App.jsx             ← the order the sections appear in
├── assets/photos/      ← YOUR PHOTOS GO HERE (see the README inside)
└── components/
    ├── PasswordGate    the "say the three magical words" screen
    ├── Hero            the first screen that types itself out
    ├── WelcomePopup    the poem that types itself, with a photo
    ├── LoveMessage     the love notes she swipes through
    ├── Gallery         photo grid + full-screen viewer
    ├── VideoSection    the engagement video
    ├── Reasons         the "why I love you" cards
    ├── Timeline        your dates, on a line that draws itself
    ├── Footer          "will you be mine" + the No button that runs away
    ├── MusicPlayer     background song (off until you add one)
    └── ScrollToTop     the little arrow button

public/
├── videos/             ← the engagement video (see README inside)
└── songs/              ← optional background mp3 (see README inside)
```

## Common changes

**Change the password** — `gate.acceptedAnswers` in `src/content.js`. Any of the
listed answers works.

**Add or remove a reason** — add to / delete from the `reasons` list. The big
number at the top counts them automatically.

**Add a date to the timeline** — add to the `timeline` list. Keep `side`
alternating `'left'`, `'right'`, `'left'`… so it zig-zags nicely.

**Change the colours** — the `@theme` block at the top of `src/index.css`.

**Reorder the sections** — the list inside `src/App.jsx`.

---

## Give it to her

### Easiest — just show her on your laptop
`npm run dev`, then press F11 for fullscreen. Done. Nothing to set up.

### Send her a link she can open on her phone

```bash
npm run build
```

That makes a `dist/` folder — the whole site as plain files. Then either:

- **Netlify Drop** — go to [app.netlify.com/drop](https://app.netlify.com/drop)
  and drag the `dist` folder onto the page. You get a live link in about ten
  seconds. No account needed to start.
- **GitHub Pages** — push this folder to a GitHub repo, then enable Pages. The
  build uses relative paths, so it works under any repo name without changes.

The password screen is the only thing keeping it private, and the page is marked
`noindex` so Google won't list it. Don't put anything on here you'd mind a
stranger seeing if they guessed the link.

### Offline, on a laptop with no internet
After `npm run build`, open `dist/index.html` directly in a browser — it works.
The only catch is the fonts come from Google, so offline it falls back to a
system serif. Everything else, including photos and video, works fine.

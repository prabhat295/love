# Background song (optional)

Put an `.mp3` in this folder, then open `src/content.js` and set its filename:

```js
export const music = {
  file: 'apna-gaana.mp3',   // exact filename in this folder
  title: 'Hamara Gaana',    // shown next to the play button
  volume: 0.5,              // 0 = silent, 1 = full
};
```

Leave `file: ''` (as it is now) and the music button doesn't appear at all.

## How it behaves

Browsers block audio from starting on its own. So the song starts on her very
first tap — which is the password screen — and she'll never notice the delay.
There's a small play/pause button in the bottom-left corner if she wants it off.

Keep the volume around `0.4`–`0.55`. Louder than that and it competes with the
engagement video's own audio.

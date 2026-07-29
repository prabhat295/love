/* Streams a Google Drive audio file through this site's own domain.

   Why this exists: Drive serves image bytes to an <img> tag happily, which is
   how the 47 photos work. Audio is different — a browser sends an `Origin`
   header on media requests, and Drive answers those with 403 Forbidden. So an
   <audio src="https://drive.google.com/..."> silently never plays.

   Fetching server-side sidesteps that entirely: there's no Origin header here,
   Drive returns the bytes, and we re-serve them from our own origin where the
   browser has no complaint.

   Runs on Vercel automatically. In local dev, vite.config.js proxies
   /api/song to the same logic.

   Usage:  /api/song?id=<drive-file-id>                                      */

/* Only these IDs may be requested, so this can't be used as an open proxy
   for arbitrary Drive files. Keep in step with `soundtrack` in content.js. */
const ALLOWED = new Set([
  '14OUHVAc3nX2PaudJqGDcpYBV5kO1f2Eo', // Tujhe Na Dekhu Toh Chain
  '1utqG8fzYroHJzzlv3gzkj0R-JXwjIK3i', // Janam Janam Jo Saath Nibhaye
  '1WsMhXOfhCTABDioGBtzUDgxXjmqDVkjK', // Aane Se Uske Aaye Bahar
]);

export default async function handler(req, res) {
  const id = new URL(req.url, `http://${req.headers.host}`).searchParams.get('id');

  if (!id || !ALLOWED.has(id)) {
    res.statusCode = 400;
    return res.end('Unknown song id');
  }

  try {
    const upstream = await fetch(
      `https://drive.google.com/uc?export=download&id=${id}`,
      {
        redirect: 'follow',
        /* Pass the browser's Range header through, so seeking still works */
        headers: req.headers.range ? { Range: req.headers.range } : {},
      }
    );

    if (!upstream.ok && upstream.status !== 206) {
      res.statusCode = 502;
      return res.end(`Drive returned ${upstream.status}`);
    }

    const type = upstream.headers.get('content-type') || '';

    /* Drive shows an HTML virus-scan page for some files — that would arrive as
       text/html and the browser would fail to decode it as audio. Reject only
       HTML: Drive labels some mp3s application/octet-stream, which is a real
       audio payload that just isn't typed usefully. */
    if (type.includes('text/html')) {
      res.statusCode = 502;
      return res.end('Drive served its download-warning page instead of the file');
    }

    res.statusCode = upstream.status;
    /* Always announce audio/mpeg. An octet-stream Content-Type makes some
       browsers refuse to decode the response as playable media. */
    res.setHeader('Content-Type', type.startsWith('audio/') ? type : 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    /* A day of browser caching, a week on Vercel's CDN — the songs never
       change, so there's no reason to re-fetch them from Drive. */
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');

    for (const h of ['content-length', 'content-range']) {
      const v = upstream.headers.get(h);
      if (v) res.setHeader(h, v);
    }

    /* Buffer rather than pipe: these are 3–14 MB, small enough that this is
       simpler and avoids stream-compatibility differences between runtimes. */
    res.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (err) {
    res.statusCode = 500;
    res.end(`Could not fetch the song: ${err.message}`);
  }
}

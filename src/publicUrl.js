/* Builds a URL for a file sitting in the public/ folder.

   Needed because vite.config.js uses a relative base ('./') so the built
   site works from any folder or GitHub Pages path. A hardcoded '/videos/x.mp4'
   would break there; this respects whatever base the build was made with. */
export function publicUrl(path) {
  if (!path) return '';
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

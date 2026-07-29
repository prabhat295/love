/* Shown where a photo or video should be, until the file is actually added.
   Only Prabhat will ever see this — once the media is in place it disappears. */
export default function EmptySlot({ icon = '🖼️', title, hint }) {
  return (
    <div
      className="rounded-2xl px-6 py-16 text-center"
      style={{
        border: '1px dashed rgba(251,82,72,0.35)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <div className="text-5xl mb-4 opacity-60">{icon}</div>
      <p className="text-white/70 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </p>
      <code
        className="inline-block mt-3 text-xs px-3 py-1.5 rounded-md text-rose-soft/90"
        style={{ background: 'rgba(251,82,72,0.1)', border: '1px solid rgba(251,82,72,0.2)' }}
      >
        {hint}
      </code>
    </div>
  );
}

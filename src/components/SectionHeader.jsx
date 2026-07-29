/* The badge + heading + subtitle block that sits at the top of every section. */
export default function SectionHeader({
  badge,
  badgeColor = 'rgba(251,82,72,0.8)',
  lineColor = 'rgba(251,82,72,0.4)',
  children,
  subheading,
  className = 'mb-16',
}) {
  return (
    <div className={`text-center ${className}`}>
      <div data-animate className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(90deg, transparent, ${lineColor})` }} />
        <span
          className="text-xs tracking-[0.4em] uppercase"
          style={{ fontFamily: "'Lato', sans-serif", color: badgeColor }}
        >
          {badge}
        </span>
        <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(270deg, transparent, ${lineColor})` }} />
      </div>

      <h2
        data-animate
        className="text-4xl md:text-6xl font-bold mb-4 text-white"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {children}
      </h2>

      {subheading && (
        <p
          data-animate
          className="text-white/50 text-lg max-w-xl mx-auto"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}

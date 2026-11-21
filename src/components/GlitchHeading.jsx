export default function GlitchHeading({ children, className = '' }) {
  return (
    <h2
      className={`glitch-hover section-title font-display text-4xl font-extrabold sm:text-5xl md:text-6xl ${className}`}
    >
      <span data-text={children}>{children}</span>
      <span className="underline" aria-hidden="true" />
    </h2>
  );
}

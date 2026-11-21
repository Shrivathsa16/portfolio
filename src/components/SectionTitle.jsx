import { useEffect, useRef, useState } from 'react';

export default function SectionTitle({ children, className = '' }) {
  const ref = useRef(null);
  const [glitching, setGlitching] = useState(false);
  const text = typeof children === 'string' ? children : '';

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGlitching(true);
          const timeout = setTimeout(() => setGlitching(false), 420);
          observer.unobserve(el);
          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <h2
      ref={ref}
      className={`section-title font-display text-3xl sm:text-4xl md:text-5xl ${
        glitching ? 'glitching' : ''
      } ${className}`}
    >
      <span data-text={text}>{children}</span>
      <span className="dot">.</span>
      <span className="underline" aria-hidden="true" />
    </h2>
  );
}

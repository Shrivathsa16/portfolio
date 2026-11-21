import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { hero, profile } from '../data/content.js';
import PhotoBreak from '../components/PhotoBreak.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

const photoSrc = `${import.meta.env.BASE_URL}${profile.photo}`;

export default function Hero() {
  const scopeRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-intro',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.15 }
      );
      gsap.fromTo(
        '.hero-visual',
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', delay: 0.3 }
      );
    }, scopeRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={scopeRef}
      id="top"
      className="relative flex min-h-screen items-center px-6 pt-28 pb-16"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div>
          <p className="hero-intro mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            {hero.greeting}
          </p>
          <h1 className="hero-intro font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl">
            {profile.name}
          </h1>
          <p className="hero-intro mt-5 max-w-md text-lg text-[var(--text-dim)]">
            {profile.role}
          </p>
          <p className="hero-intro mt-2 max-w-md text-base text-[var(--text-dim)]">
            {profile.tagline}
          </p>
          <div className="hero-intro mt-8 flex flex-wrap gap-4">
            <a
              href={hero.ctaPrimary.href}
              data-cursor-hover
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_0_30px_var(--accent-soft)] transition-transform hover:scale-105"
            >
              {hero.ctaPrimary.label}
            </a>
            <a
              href={hero.ctaSecondary.href}
              data-cursor-hover
              className="glass rounded-full px-6 py-3 text-sm font-semibold no-underline transition-transform hover:scale-105"
            >
              {hero.ctaSecondary.label}
            </a>
          </div>
        </div>
        <div className="hero-visual relative h-[420px] md:h-[560px]">
          <div
            className="glass absolute -right-4 top-6 h-40 w-40 rotate-12 rounded-3xl sm:h-56 sm:w-56"
            aria-hidden="true"
          />
          <div
            className="glass absolute -left-6 bottom-8 h-32 w-32 -rotate-6 rounded-3xl sm:h-44 sm:w-44"
            aria-hidden="true"
          />
          <div className="relative h-full w-full">
            <PhotoBreak src={photoSrc} />
          </div>
        </div>
      </div>
    </section>
  );
}

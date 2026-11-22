import { useEffect, useRef, useState } from 'react';
import { hero, profile } from '../../data/content.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { DESKTOP_BREAKPOINT, DESKTOP_SHAPES, MOBILE_SHAPES } from './shardShapes.js';
import Shard from './Shard.jsx';

// One entry per shard: which direction it flies in from on load, and how
// far it drifts under pointer parallax (depth in px, rotation in deg).
const SHARD_META = [
  { id: 's1', variant: 'moss', hasPhoto: false, entryFrom: 'left', depth: -16, rotation: 1.2 },
  { id: 's2', variant: 'teal', hasPhoto: true, entryFrom: 'top', depth: 6, rotation: -0.8 },
  { id: 's3', variant: 'ember', hasPhoto: true, smoke: true, entryFrom: 'right', depth: 24, rotation: 1.6 },
  { id: 's4', variant: 'ember', hasPhoto: true, smoke: true, entryFrom: 'bottom', depth: -10, rotation: -1.1 },
];

const ENTRY_TRANSFORMS = {
  left: 'translate3d(-60%, 0, 0)',
  top: 'translate3d(0, -60%, 0)',
  right: 'translate3d(60%, 0, 0)',
  bottom: 'translate3d(0, 60%, 0)',
};

const IDLE_TIMEOUT_MS = 1200;
const LERP_SPEED = 0.08;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function HeroCard() {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef(null);
  const innerRefs = useRef({});
  const textInnerRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const lastMoveRef = useRef(0);
  const currentRef = useRef({});

  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= DESKTOP_BREAKPOINT : true
  );
  // Photo + name are read straight from content.js — edit profile.photo /
  // profile.name there, not in this file, to change what the hero shows.
  const photoSrc = `${import.meta.env.BASE_URL}${profile.photo}`;
  const shapes = isDesktop ? DESKTOP_SHAPES : MOBILE_SHAPES;

  // Re-apply shard shapes whenever the 860px breakpoint flips.
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Fly the shards in one frame after mount so the transition actually plays.
  useEffect(() => {
    if (reducedMotion) {
      setMounted(true);
      return undefined;
    }
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  // Single shared rAF loop drives pointer parallax (+ idle sine drift) for
  // every shard's inner wrapper and the text block, which tracks S1.
  useEffect(() => {
    if (reducedMotion) return undefined;
    const card = cardRef.current;
    if (!card) return undefined;

    const registry = [
      ...SHARD_META.map((m) => ({ id: m.id, depth: m.depth, rotation: m.rotation })),
      { id: 'text', depth: SHARD_META[0].depth, rotation: SHARD_META[0].rotation },
    ];
    registry.forEach((entry) => {
      if (!currentRef.current[entry.id]) currentRef.current[entry.id] = { x: 0, y: 0, rot: 0 };
    });

    const handlePointer = (clientX, clientY) => {
      const rect = card.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((clientY - rect.top) / rect.height) * 2 - 1;
      pointerRef.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
      };
      lastMoveRef.current = performance.now();
    };

    const onMouseMove = (e) => handlePointer(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (touch) handlePointer(touch.clientX, touch.clientY);
    };
    const onLeave = () => {
      pointerRef.current = { x: 0, y: 0 };
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('touchmove', onTouchMove, { passive: true });
    card.addEventListener('mouseleave', onLeave);

    let rafId;
    const tick = (now) => {
      const idle = now - lastMoveRef.current > IDLE_TIMEOUT_MS;
      let tx;
      let ty;
      if (idle) {
        const t = now / 1000;
        tx = Math.sin(t * 0.6) * 0.4;
        ty = Math.cos(t * 0.5) * 0.3;
      } else {
        tx = pointerRef.current.x;
        ty = pointerRef.current.y;
      }

      registry.forEach(({ id, depth, rotation }) => {
        const el = id === 'text' ? textInnerRef.current : innerRefs.current[id];
        if (!el) return;
        const current = currentRef.current[id];
        current.x = lerp(current.x, tx * depth, LERP_SPEED);
        current.y = lerp(current.y, ty * depth * 0.6, LERP_SPEED);
        current.rot = lerp(current.rot, tx * rotation, LERP_SPEED);
        el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0) rotate(${current.rot.toFixed(2)}deg)`;
      });

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('touchmove', onTouchMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, [reducedMotion]);

  const photoStyleFor = (hasPhoto) => {
    if (!hasPhoto) return undefined;
    return isDesktop
      ? { height: '96%', left: '82%', bottom: 0, transform: 'translateX(-50%)' }
      : { height: '52%', left: '50%', bottom: 0, transform: 'translateX(-50%)' };
  };

  return (
    <div className="mx-auto w-full max-w-[1240px] px-1">
      <div
        ref={cardRef}
        className="glass relative w-full overflow-hidden rounded-[28px]"
        style={{ aspectRatio: isDesktop ? '16 / 9.4' : '3 / 5.2' }}
      >
        {SHARD_META.map((meta, index) => (
          <Shard
            key={meta.id}
            ref={(el) => {
              innerRefs.current[meta.id] = el;
            }}
            points={shapes[meta.id]}
            variant={meta.variant}
            hasPhoto={meta.hasPhoto}
            photoSrc={photoSrc}
            photoAlt={profile.name}
            photoStyle={photoStyleFor(meta.hasPhoto)}
            smoke={Boolean(meta.smoke)}
            mounted={mounted}
            entryTransform={ENTRY_TRANSFORMS[meta.entryFrom]}
            entryDelay={index * 0.1}
            reducedMotion={reducedMotion}
          />
        ))}

        {/* Text block sits above every shard and tracks S1's entry + parallax motion. */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            transform: mounted || reducedMotion ? 'none' : ENTRY_TRANSFORMS.left,
            opacity: mounted || reducedMotion ? 1 : 0,
            transition: reducedMotion
              ? 'none'
              : 'transform 0.9s cubic-bezier(.16,.84,.33,1) 0s, opacity 0.7s ease 0s',
          }}
        >
          <div ref={textInnerRef} className="pointer-events-none h-full w-full">
            <div
              className={
                isDesktop
                  ? 'pointer-events-auto flex h-full max-w-[44%] flex-col justify-center px-10 md:px-14'
                  : 'pointer-events-auto flex h-full max-w-[85%] flex-col justify-start px-6 pt-9'
              }
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                {hero.greeting}
              </p>
              {/* Displayed name comes from content.js -> profile.name (first word, uppercased). */}
              <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] text-[var(--text)] sm:text-5xl md:text-6xl lg:text-7xl">
                {profile.name.split(' ')[0]}
              </h1>
              <p className="mt-4 max-w-xs text-sm text-[var(--text-dim)] sm:text-base">
                {profile.role}
              </p>
              <p className="mt-2 max-w-xs text-sm text-[var(--text-dim)]">{profile.tagline}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={hero.ctaPrimary.href}
                  data-cursor-hover
                  className="glass rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--text)] no-underline shadow-[0_0_24px_var(--accent-soft)] transition-transform hover:scale-105"
                >
                  {hero.ctaPrimary.label}
                </a>
                <a
                  href={hero.ctaSecondary.href}
                  data-cursor-hover
                  className="glass rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--text)] no-underline transition-transform hover:scale-105"
                >
                  {hero.ctaSecondary.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

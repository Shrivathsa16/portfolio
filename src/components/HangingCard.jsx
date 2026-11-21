import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

export default function HangingCard({ src, alt }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const hovering = useRef(false);
  const target = useRef({ rz: 0, rx: 0 });
  const current = useRef({ rz: 0, rx: 0 });
  const [broken, setBroken] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return undefined;

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      hovering.current = true;
      target.current.rz = px * 22;
      target.current.rx = -py * 14;
    };
    const onLeave = () => {
      hovering.current = false;
    };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = (now - start) / 1000;
      const idle = reducedMotion ? 0 : (hovering.current ? 0.3 : 1) * Math.sin(t * 0.8) * 3;
      const desiredRz = target.current.rz + idle;
      const desiredRx = target.current.rx;
      current.current.rz += (desiredRz - current.current.rz) * 0.07;
      current.current.rx += (desiredRx - current.current.rx) * 0.07;
      card.style.transform = `rotateX(${current.current.rx}deg) rotateZ(${current.current.rz}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-[380px] w-full max-w-sm select-none"
      style={{ perspective: '1000px' }}
    >
      <div
        className="absolute left-1/2 top-0 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--accent)] to-transparent opacity-70"
        aria-hidden="true"
      />
      <div
        ref={cardRef}
        className="glass absolute left-1/2 top-16 w-64 -translate-x-1/2 overflow-hidden rounded-2xl p-3"
        style={{ transformOrigin: 'top center' }}
      >
        {broken ? (
          <div className="flex h-72 w-full items-center justify-center rounded-xl bg-[var(--bg-soft)] text-5xl text-[var(--accent)]">
            ?
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            className="h-72 w-full rounded-xl object-cover"
            onError={() => setBroken(true)}
          />
        )}
      </div>
    </div>
  );
}

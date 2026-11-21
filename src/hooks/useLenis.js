import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

export function useLenis(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on('scroll', () => {
      window.dispatchEvent(new CustomEvent('lenis-scroll'));
    });

    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [enabled]);
}

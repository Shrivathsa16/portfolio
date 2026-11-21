import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { nav, profile } from '../data/content.js';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`glass flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-3 transition-shadow ${
          scrolled ? 'shadow-[0_8px_30px_-10px_var(--accent-soft)]' : ''
        }`}
      >
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-[var(--text)] no-underline"
          data-cursor-hover
        >
          {profile.name.split(' ')[0]}
          <span className="text-[var(--accent)]">.</span>
        </a>

        <ul className="hidden items-center gap-7 sm:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm font-medium uppercase tracking-wide text-[var(--text-dim)] no-underline transition-colors hover:text-[var(--accent)]"
                data-cursor-hover
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark and light mode"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            data-cursor-hover
            className="flex h-8 w-14 items-center rounded-full border border-[var(--glass-border)] bg-[var(--bg-soft)] p-1 transition-colors"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs shadow-[0_0_10px_var(--accent-soft)] transition-transform ${
                theme === 'light' ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              {theme === 'dark' ? '🌙' : '☀'}
            </span>
          </button>
          <a
            href="#contact"
            data-cursor-hover
            className="hidden rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white no-underline shadow-[0_0_20px_var(--accent-soft)] transition-transform hover:scale-105 sm:inline-block"
          >
            Let&apos;s Talk
          </a>
        </div>
      </nav>
    </header>
  );
}

import { nav, footer, profile } from '../data/content.js';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--glass-border)] px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <span className="font-display text-sm font-semibold text-[var(--text-dim)]">
          {profile.name}
        </span>
        <ul className="flex flex-wrap items-center justify-center gap-5">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                data-cursor-hover
                className="text-xs font-medium uppercase tracking-wide text-[var(--text-dim)] no-underline transition-colors hover:text-[var(--accent)]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="text-xs text-[var(--text-dim)]">{footer.note}</span>
      </div>
    </footer>
  );
}

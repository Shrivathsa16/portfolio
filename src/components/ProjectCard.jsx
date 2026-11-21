import { useRef } from 'react';

export default function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const frame = useRef(null);

  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rotateY = (px - 0.5) * 14;
      const rotateX = (0.5 - py) * 14;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    });
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor-hover
      className="project-card glass group relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 ease-out will-change-transform"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), var(--accent-soft), transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div className="relative">
        <span className="font-display text-sm font-semibold text-[var(--accent)]">
          {project.number}
        </span>
        <h3 className="font-display mt-2 text-xl font-bold">{project.title}</h3>
        <p className="mt-2 text-sm text-[var(--text-dim)]">{project.description}</p>
        {project.tags?.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-[var(--glass-border)] px-2.5 py-1 text-xs text-[var(--text-dim)]"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-[var(--accent)] no-underline"
          >
            View project →
          </a>
        ) : null}
      </div>
    </article>
  );
}

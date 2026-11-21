import { profile, skills, projects, learningPaths } from '../content';
import type { SectionId } from './sections';
import './ui.css';

interface Props {
  section: SectionId | null;
  onClose: () => void;
}

export default function SectionPanel({ section, onClose }: Props) {
  return (
    <aside className={`section-panel ${section ? 'open' : ''}`}>
      <button className="section-panel-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      {section === 'about' && (
        <>
          <h2>About</h2>
          {profile.photo ? (
            <img className="panel-photo" src={profile.photo} alt={profile.name} />
          ) : (
            <div className="panel-photo-placeholder">?</div>
          )}
          <p>{profile.bio}</p>
        </>
      )}
      {section === 'skills' && (
        <>
          <h2>Skills</h2>
          <div className="skill-chip-row">
            {skills.map((s) => (
              <span className="skill-chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </>
      )}
      {section === 'projects' && (
        <>
          <h2>Projects</h2>
          <div className="card-list">
            {projects.map((p) => (
              <div className="card" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer">
                    View project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {section === 'learning' && (
        <>
          <h2>Learning Paths</h2>
          <div className="card-list">
            {learningPaths.map((l) => (
              <div className="card" key={l.title}>
                <h3>{l.title}</h3>
                <p>{l.description}</p>
                {l.link && (
                  <a href={l.link} target="_blank" rel="noreferrer">
                    Learn more →
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {section === 'contact' && (
        <>
          <h2>Contact</h2>
          <p>Reach out through any of the links below.</p>
          <div className="link-row">
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.links.email}>Email</a>
          </div>
        </>
      )}
    </aside>
  );
}

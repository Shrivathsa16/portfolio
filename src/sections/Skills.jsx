import SectionTitle from '../components/SectionTitle.jsx';
import Reveal from '../components/Reveal.jsx';
import { skills } from '../data/content.js';

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle>Skills</SectionTitle>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {skills.map((skill, i) => (
            <Reveal
              key={skill}
              style={{ transitionDelay: `${i * 40}ms` }}
              data-cursor-hover
              className="glass group rounded-xl px-4 py-6 text-center font-medium transition-all duration-300 ease-out hover:-translate-y-2 hover:text-[var(--accent)] hover:shadow-[0_12px_30px_-10px_var(--accent-soft)]"
            >
              {skill}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

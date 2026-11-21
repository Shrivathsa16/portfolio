import SectionTitle from '../components/SectionTitle.jsx';
import HangingCard from '../components/HangingCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { about, profile } from '../data/content.js';

const photoSrc = `${import.meta.env.BASE_URL}${about.photo}`;

export default function About() {
  return (
    <section id="about" className="relative px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">
        <div>
          <SectionTitle>About</SectionTitle>
          <Reveal className="glass mt-8 rounded-2xl p-7">
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                className="mt-3 text-base leading-relaxed text-[var(--text-dim)] first:mt-0"
              >
                {p}
              </p>
            ))}
          </Reveal>
        </div>
        <Reveal>
          <HangingCard src={photoSrc} alt={profile.name} />
        </Reveal>
      </div>
    </section>
  );
}

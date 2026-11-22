import { useState } from 'react';
import GlitchHeading from '../components/GlitchHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import { contact } from '../data/content.js';

const socialLinks = [
  { label: 'Instagram', href: contact.links.instagram },
  { label: 'Email', href: `mailto:${contact.email}` },
  { label: 'LinkedIn', href: contact.links.linkedin },
  { label: 'GitHub', href: contact.links.github },
];

export default function Contact() {
  const [status, setStatus] = useState('idle');
  const hasFormspree = Boolean(contact.formspreeEndpoint);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');

    if (hasFormspree) {
      setStatus('sending');
      try {
        const res = await fetch(contact.formspreeEndpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        });
        setStatus(res.ok ? 'sent' : 'error');
        if (res.ok) form.reset();
      } catch {
        setStatus('error');
      }
      return;
    }

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="relative px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <GlitchHeading>{contact.heading}</GlitchHeading>
        <p className="mt-5 text-[var(--text-dim)]">{contact.subheading}</p>

        <Reveal className="glass mt-10 rounded-2xl p-7 text-left">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="sr-only" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              placeholder="Name"
              required
              className="rounded-lg border border-[var(--glass-border)] bg-transparent px-4 py-3 outline-none transition-colors focus:border-[var(--accent)]"
            />
            <label className="sr-only" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="Email"
              required
              className="rounded-lg border border-[var(--glass-border)] bg-transparent px-4 py-3 outline-none transition-colors focus:border-[var(--accent)]"
            />
            <label className="sr-only" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Message"
              rows={4}
              required
              className="rounded-lg border border-[var(--glass-border)] bg-transparent px-4 py-3 outline-none transition-colors focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              data-cursor-hover
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            {status === 'sent' && (
              <p className="text-sm text-[var(--accent)]">Thanks — I&apos;ll get back to you soon.</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-[var(--accent)]">
                Something went wrong — email me directly at {contact.email}.
              </p>
            )}
          </form>
        </Reveal>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                data-cursor-hover
                className="glass inline-block rounded-full px-5 py-2 text-sm font-medium no-underline transition-transform hover:scale-105"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

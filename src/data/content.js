// Everything on the site is driven from this file.
// Edit freely — no component code needs to change.

export const profile = {
  name: 'Shrivathsa Shettigar',
  role: 'AI & Data Science student · Developer',
  tagline: 'Building intelligent software that solves real problems.',
  // Transparent PNG cut-out, place the real file at public/images/me.png
  photo: 'images/me.png',
};

export const nav = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export const hero = {
  greeting: "Hi, I'm",
  ctaPrimary: { label: 'Explore my work', href: '#projects' },
  ctaSecondary: { label: 'Get in touch', href: '#contact' },
};

export const projects = [
  {
    number: '01',
    title: 'Fashion Prediction System',
    description:
      'ML pipeline that predicts fashion trends and recommends outfits from visual and tabular data.',
    tags: ['Python', 'ML', 'Scikit-learn'],
    link: '',
  },
  {
    number: '02',
    title: 'Lost and Found Detection System',
    description:
      'Computer-vision system that detects, logs and matches lost items from camera feeds to speed up recovery.',
    tags: ['Python', 'OpenCV', 'CV'],
    link: '',
  },
  {
    number: '03',
    title: 'Project Three',
    description: 'A short description of this project goes here — replace with real details.',
    tags: ['Tag'],
    link: '',
  },
  {
    number: '04',
    title: 'Project Four',
    description: 'A short description of this project goes here — replace with real details.',
    tags: ['Tag'],
    link: '',
  },
  {
    number: '05',
    title: 'Project Five',
    description: 'A short description of this project goes here — replace with real details.',
    tags: ['Tag'],
    link: '',
  },
  {
    number: '06',
    title: 'Project Six',
    description: 'A short description of this project goes here — replace with real details.',
    tags: ['Tag'],
    link: '',
  },
  {
    number: '07',
    title: 'Project Seven',
    description: 'A short description of this project goes here — replace with real details.',
    tags: ['Tag'],
    link: '',
  },
  {
    number: '08',
    title: 'Project Eight',
    description: 'A short description of this project goes here — replace with real details.',
    tags: ['Tag'],
    link: '',
  },
  {
    number: '09',
    title: 'Project Nine',
    description: 'A short description of this project goes here — replace with real details.',
    tags: ['Tag'],
    link: '',
  },
];

export const about = {
  paragraphs: [
    "I'm an AI & Data Science student who likes turning messy real-world problems into software that actually works.",
    'I spend most of my time around machine learning, computer vision and full-stack web development — building things end to end, from data to a usable interface.',
    "When I'm not building, I'm usually reading about new models, breaking my own code, or planning the next project.",
  ],
  photo: 'images/me.png',
};

export const skills = [
  'React',
  'JavaScript',
  'Python',
  'SQL',
  'Three.js',
  'GSAP',
  'TensorFlow',
  'OpenCV',
  'Node.js',
  'Git',
];

export const contact = {
  heading: 'CONTACT.',
  subheading: "Have a project in mind, or just want to talk tech? My inbox is open.",
  // Create a form at https://formspree.io and drop the endpoint below.
  formspreeEndpoint: '',
  email: 'shrivathsashettigar16@gmail.com',
  links: {
    instagram: 'https://www.instagram.com/shrivathsa_16?knvt=ZDZxMmJ0c2c2eGVt',
    github: 'https://github.com/Shrivathsa16',
    linkedin: 'https://www.linkedin.com/in/shrivathsa-shettigar-6b59b232a/',
  },
};

export const footer = {
  note: `© ${new Date().getFullYear()} ${profile.name}. Built with React, Three.js & GSAP.`,
};

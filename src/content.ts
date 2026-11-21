// Placeholder content — replace with your real details any time.
export const profile = {
  name: 'Shrivathsa Shettigar',
  title: 'Software Engineer', // TODO: replace with your actual title
  bio:
    'Replace this with a short paragraph about who you are, what you build, ' +
    'and what you care about. Two to four sentences is plenty.',
  photo: null as string | null, // TODO: put a path like "/photo.jpg" (file in public/) once you have one
  links: {
    github: 'https://github.com/Shrivathsa16',
    linkedin: 'https://www.linkedin.com/in/shrivathsa-shettigar-6b59b232a/',
    email: 'mailto:you@example.com', // TODO: replace with your real email
  },
};

export const skills: string[] = [
  'Skill 1',
  'Skill 2',
  'Skill 3',
  'Skill 4',
  'Skill 5',
  'Skill 6',
]; // TODO: replace with your real skills

export interface Project {
  title: string;
  description: string;
  link?: string;
  tags?: string[];
}

export const projects: Project[] = [
  {
    title: 'Project One',
    description: 'One or two lines describing what this project does and why it matters.',
    link: '',
    tags: ['Tag'],
  },
  {
    title: 'Project Two',
    description: 'One or two lines describing what this project does and why it matters.',
    link: '',
    tags: ['Tag'],
  },
  {
    title: 'Project Three',
    description: 'One or two lines describing what this project does and why it matters.',
    link: '',
    tags: ['Tag'],
  },
]; // TODO: replace with your real projects

export interface LearningPath {
  title: string;
  description: string;
  link?: string;
}

export const learningPaths: LearningPath[] = [
  {
    title: 'Learning Path One',
    description: 'What you are currently learning, a course name, or a roadmap link.',
    link: '',
  },
  {
    title: 'Learning Path Two',
    description: 'What you are currently learning, a course name, or a roadmap link.',
    link: '',
  },
]; // TODO: replace with your real learning paths

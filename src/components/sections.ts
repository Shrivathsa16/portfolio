export type SectionId = 'about' | 'projects' | 'skills' | 'learning' | 'contact';

export interface SectionDef {
  id: SectionId;
  label: string;
  angle: number; // position around the circle, radians
  geometry: 'icosahedron' | 'torusKnot' | 'octahedron' | 'dodecahedron' | 'tetrahedron';
}

const RADIUS = 7;

export const SECTIONS: SectionDef[] = [
  { id: 'about', label: 'About', angle: 0, geometry: 'icosahedron' },
  { id: 'projects', label: 'Projects', angle: (2 * Math.PI) / 5, geometry: 'torusKnot' },
  { id: 'skills', label: 'Skills', angle: (4 * Math.PI) / 5, geometry: 'octahedron' },
  { id: 'learning', label: 'Learning Paths', angle: (6 * Math.PI) / 5, geometry: 'dodecahedron' },
  { id: 'contact', label: 'Contact', angle: (8 * Math.PI) / 5, geometry: 'tetrahedron' },
];

export function sectionPosition(angle: number): [number, number, number] {
  return [Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS];
}

export const GALLERY_RADIUS = RADIUS;

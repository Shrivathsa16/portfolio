import { Suspense, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import type { Mesh } from 'three';
import type { SectionDef } from './sections';
import { sectionPosition } from './sections';
import { useTheme } from '../theme';

interface Props {
  section: SectionDef;
  active: boolean;
  onSelect: (id: SectionDef['id']) => void;
}

function Geometry({ type }: { type: SectionDef['geometry'] }) {
  switch (type) {
    case 'icosahedron':
      return <icosahedronGeometry args={[0.9, 0]} />;
    case 'torusKnot':
      return <torusKnotGeometry args={[0.6, 0.22, 128, 16]} />;
    case 'octahedron':
      return <octahedronGeometry args={[0.95, 0]} />;
    case 'dodecahedron':
      return <dodecahedronGeometry args={[0.85, 0]} />;
    case 'tetrahedron':
      return <tetrahedronGeometry args={[1, 0]} />;
  }
}

export default function Pedestal({ section, active, onSelect }: Props) {
  const { colors } = useTheme();
  const [x, , z] = sectionPosition(section.angle);
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group position={[x, 0, z]}>
      {/* pedestal base */}
      <mesh position={[0, -0.95, 0]} receiveShadow>
        <cylinderGeometry args={[0.65, 0.8, 0.5, 24]} />
        <meshStandardMaterial
          color={colors.floor}
          emissive={colors.accent}
          emissiveIntensity={hovered || active ? 0.35 : 0.08}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>

      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh
          ref={meshRef}
          position={[0, 0.6, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(section.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
          scale={active ? 1.15 : 1}
        >
          <Geometry type={section.geometry} />
          <meshStandardMaterial
            color={colors.accent}
            emissive={colors.accent}
            emissiveIntensity={hovered || active ? 1.1 : 0.55}
            metalness={0.2}
            roughness={0.3}
            wireframe={false}
          />
        </mesh>
      </Float>

      <Suspense fallback={null}>
        <Text
          position={[0, -1.6, 0]}
          fontSize={0.26}
          color={colors.text}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
          fillOpacity={hovered || active ? 1 : 0.75}
        >
          {section.label.toUpperCase()}
        </Text>
      </Suspense>
    </group>
  );
}

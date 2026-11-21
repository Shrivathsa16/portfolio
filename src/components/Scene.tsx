import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import Pedestal from './Pedestal';
import { SECTIONS, sectionPosition } from './sections';
import type { SectionId } from './sections';
import { useTheme } from '../theme';

interface Props {
  selected: SectionId | null;
  onSelect: (id: SectionId | null) => void;
}

const OVERVIEW_CAM = new THREE.Vector3(0, 5.5, 11.5);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0);

function CameraRig({ selected }: { selected: SectionId | null }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const desiredCam = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());

  useFrame(({ camera }, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (selected) {
      const section = SECTIONS.find((s) => s.id === selected);
      if (section) {
        const [x, , z] = sectionPosition(section.angle);
        const dir = new THREE.Vector3(x, 0, z).normalize();
        desiredCam.current.set(x - dir.x * 3.4, 1.8, z - dir.z * 3.4);
        desiredTarget.current.set(x, 0.3, z);
      }
    } else {
      desiredCam.current.copy(OVERVIEW_CAM);
      desiredTarget.current.copy(OVERVIEW_TARGET);
    }

    const lerpSpeed = 1 - Math.pow(0.001, delta);
    camera.position.lerp(desiredCam.current, lerpSpeed);
    controls.target.lerp(desiredTarget.current, lerpSpeed);
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={3}
      maxDistance={20}
      maxPolarAngle={Math.PI / 2 - 0.05}
      makeDefault
    />
  );
}

export default function Scene({ selected, onSelect }: Props) {
  const { colors, theme } = useTheme();

  return (
    <Canvas
      shadows
      camera={{ position: [0, 5.5, 11.5], fov: 50 }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={[colors.bg]} />
      <fog attach="fog" args={[colors.fog, 9, 26]} />

      <ambientLight intensity={theme === 'dark' ? 0.25 : 0.55} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={theme === 'dark' ? 0.6 : 0.9}
        color={colors.accent}
        castShadow
      />
      <pointLight position={[0, 4, 0]} intensity={theme === 'dark' ? 0.8 : 0.4} color={colors.accent} />

      <Grid
        position={[0, -1.2, 0]}
        args={[40, 40]}
        cellColor={colors.floor}
        sectionColor={colors.accent}
        cellSize={1}
        sectionSize={5}
        fadeDistance={28}
        fadeStrength={1.5}
        infiniteGrid
      />

      <Suspense fallback={null}>
        {SECTIONS.map((section) => (
          <Pedestal
            key={section.id}
            section={section}
            active={selected === section.id}
            onSelect={onSelect}
          />
        ))}
      </Suspense>

      <CameraRig selected={selected} />
    </Canvas>
  );
}

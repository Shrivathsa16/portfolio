import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

const VERTEX = /* glsl */ `
  attribute vec3 aSeed;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uActive;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    pos.x += sin(uTime * 0.08 + aSeed.x * 6.2831) * 0.9;
    pos.y += cos(uTime * 0.07 + aSeed.y * 6.2831) * 0.7;

    vec2 toParticle = pos.xy - uMouse;
    float dist = length(toParticle);
    float force = smoothstep(3.2, 0.0, dist) * uActive;
    pos.xy += normalize(toParticle + 0.0001) * force * 1.1;

    vAlpha = 0.35 + 0.5 * (0.5 + 0.5 * sin(uTime * 0.6 + aSeed.z * 6.2831));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (3.0 + aSeed.x * 3.0) * (260.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord.xy - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, alpha * vAlpha * 0.85);
  }
`;

function Field({ count, color }) {
  const pointsRef = useRef(null);
  const materialRef = useRef(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4;
      seeds[i * 3] = Math.random();
      seeds[i * 3 + 1] = Math.random();
      seeds[i * 3 + 2] = Math.random();
    }
    return { positions, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uActive: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color]
  );

  useEffect(() => {
    if (materialRef.current) materialRef.current.uniforms.uColor.value = new THREE.Color(color);
  }, [color]);

  useFrame(({ clock, pointer, viewport }, delta) => {
    const u = materialRef.current?.uniforms;
    if (!u) return;
    u.uTime.value = clock.elapsedTime;
    const targetX = pointer.x * viewport.width * 0.5;
    const targetY = pointer.y * viewport.height * 0.5;
    mouse.current.x += (targetX - mouse.current.x) * 0.06;
    mouse.current.y += (targetY - mouse.current.y) * 0.06;
    u.uMouse.value.copy(mouse.current);
    u.uActive.value += (1 - u.uActive.value) * Math.min(delta * 2, 1);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField() {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 640 : false
  );

  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  if (reducedMotion) return null;

  const count = isMobile ? 120 : 300;
  const color = theme === 'dark' ? '#ff3b47' : '#d7192a';

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 10], fov: 50 }}
        eventSource={document.documentElement}
        eventPrefix="client"
      >
        <Field count={count} color={color} />
      </Canvas>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

const SMOKE_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SMOKE_FRAGMENT = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.55;
    for (int i = 0; i < 4; i++) {
      v += noise(p) * amp;
      p *= 2.05;
      amp *= 0.55;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    vec2 p = vUv * 2.6 + vec2(uTime * 0.03, -uTime * 0.05);
    float n = fbm(p + fbm(p * 1.4));
    float vignette = smoothstep(1.15, 0.1, length(uv));
    float alpha = n * vignette * 0.55;
    vec3 color = mix(uColorA, uColorB, n);
    gl_FragColor = vec4(color, alpha);
  }
`;

function Smoke({ width, height }) {
  const matRef = useRef(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#5a0b12') },
      uColorB: { value: new THREE.Color('#ff3b6a') },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh position={[0, 0, -0.6]}>
      <planeGeometry args={[width * 1.6, height * 1.6]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={SMOKE_VERTEX}
        fragmentShader={SMOKE_FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

const PHOTO_VERTEX = /* glsl */ `
  attribute vec3 aCenter;
  attribute vec3 aRandom;
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uActive;
  uniform float uPulse;
  uniform float uStrength;
  varying vec2 vUv;
  varying float vInfluence;

  vec3 rotateAxis(vec3 v, vec3 axis, float angle) {
    return v * cos(angle) + cross(axis, v) * sin(angle) + axis * dot(axis, v) * (1.0 - cos(angle));
  }

  void main() {
    vUv = uv;

    float dist = distance(aCenter.xy, uMouse);
    float distInfluence = smoothstep(uRadius, 0.0, dist) * uActive;
    float influence = max(distInfluence, uPulse);
    vInfluence = influence;

    vec3 axis = normalize(vec3(aRandom.x, aRandom.y, 1.0));
    float angle = aRandom.z * influence * 1.4;
    vec3 local = position - aCenter;
    local = rotateAxis(local, axis, angle);

    vec3 translated = aCenter + local + aRandom * influence * uStrength;

    vec4 mvPosition = modelViewMatrix * vec4(translated, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PHOTO_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform sampler2D uTexture;
  varying vec2 vUv;
  varying float vInfluence;

  void main() {
    float split = vInfluence * 0.035;
    float r = texture2D(uTexture, vUv + vec2(split, 0.0)).r;
    float g = texture2D(uTexture, vUv).g;
    float b = texture2D(uTexture, vUv - vec2(split, 0.0)).b;
    float a = texture2D(uTexture, vUv).a;
    float fade = 1.0 - smoothstep(0.5, 1.0, vInfluence) * 0.7;
    if (a < 0.02) discard;
    gl_FragColor = vec4(r, g, b, a * fade);
  }
`;

function buildFallbackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(255,59,71,0.9)');
  gradient.addColorStop(1, 'rgba(120,12,30,0.9)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(256, 210, 110, 130, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(130, 640);
  ctx.quadraticCurveTo(256, 360, 382, 640);
  ctx.closePath();
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildShatterGeometry(width, height, segments) {
  const geometry = new THREE.PlaneGeometry(width, height, segments, segments).toNonIndexed();
  const posAttr = geometry.getAttribute('position');
  const triCount = posAttr.count / 3;
  const centers = new Float32Array(posAttr.count * 3);
  const randoms = new Float32Array(posAttr.count * 3);

  for (let t = 0; t < triCount; t++) {
    const i0 = t * 3;
    const cx = (posAttr.getX(i0) + posAttr.getX(i0 + 1) + posAttr.getX(i0 + 2)) / 3;
    const cy = (posAttr.getY(i0) + posAttr.getY(i0 + 1) + posAttr.getY(i0 + 2)) / 3;
    const cz = (posAttr.getZ(i0) + posAttr.getZ(i0 + 1) + posAttr.getZ(i0 + 2)) / 3;
    const rx = (Math.random() - 0.5) * 2;
    const ry = (Math.random() - 0.5) * 2;
    const rz = (Math.random() - 0.5) * 2;
    for (let v = 0; v < 3; v++) {
      const idx = (i0 + v) * 3;
      centers[idx] = cx;
      centers[idx + 1] = cy;
      centers[idx + 2] = cz;
      randoms[idx] = rx;
      randoms[idx + 1] = ry;
      randoms[idx + 2] = rz;
    }
  }

  geometry.setAttribute('aCenter', new THREE.BufferAttribute(centers, 3));
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
  return geometry;
}

function PhotoPlane({ src, width, height, isTouch }) {
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const { invalidate } = useThree();
  const activeTarget = useRef(0);
  const localMouse = useRef(new THREE.Vector2(0, 0));
  const pulse = useRef(0);

  const segments = typeof window !== 'undefined' && window.innerWidth <= 640 ? 24 : 42;
  const geometry = useMemo(() => buildShatterGeometry(width, height, segments), [width, height, segments]);
  const fallbackTexture = useMemo(() => buildFallbackTexture(), []);
  const [texture, setTexture] = useState(fallbackTexture);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      src,
      (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace;
        setTexture(loaded);
      },
      undefined,
      () => {
        // keep fallback silhouette — file missing, build never breaks
      }
    );
  }, [src]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(9999, 9999) },
      uRadius: { value: width * 0.32 },
      uActive: { value: 0 },
      uPulse: { value: 0 },
      uStrength: { value: width * 0.5 },
    }),
    [width]
  );

  useEffect(() => {
    if (materialRef.current) materialRef.current.uniforms.uTexture.value = texture;
  }, [texture]);

  useEffect(() => {
    if (!isTouch) return undefined;
    const runPulse = () => {
      pulse.current = 0;
      gsap.to(pulse, {
        current: 1,
        duration: 0.55,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
    };
    const initial = setTimeout(runPulse, 500);
    const onTap = () => runPulse();
    window.addEventListener('touchstart', onTap, { passive: true });
    return () => {
      clearTimeout(initial);
      window.removeEventListener('touchstart', onTap);
    };
  }, [isTouch]);

  const handlePointerMove = (e) => {
    if (isTouch) return;
    e.stopPropagation();
    const local = meshRef.current.worldToLocal(e.point.clone());
    localMouse.current.set(local.x, local.y);
    activeTarget.current = 1;
  };

  const handlePointerOut = () => {
    if (isTouch) return;
    activeTarget.current = 0;
  };

  useFrame((_, delta) => {
    const u = materialRef.current?.uniforms;
    if (!u) return;

    if (!isTouch) {
      u.uMouse.value.copy(localMouse.current);
      u.uActive.value += (activeTarget.current - u.uActive.value) * Math.min(delta * 4, 1);
    }

    u.uPulse.value = pulse.current;
    invalidate();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={PHOTO_VERTEX}
        fragmentShader={PHOTO_FRAGMENT}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function PhotoBreak({ src }) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const isTouch =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (reducedMotion) {
    return (
      <img
        src={src}
        alt="Shrivathsa Shettigar"
        className="mx-auto h-full max-h-[480px] object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  const width = 4.2;
  const height = 5.2;

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={visible ? 'always' : 'never'}
      camera={{ position: [0, 0, 6], fov: 40 }}
    >
      <Smoke width={width} height={height} />
      <PhotoPlane src={src} width={width} height={height} isTouch={isTouch} />
    </Canvas>
  );
}

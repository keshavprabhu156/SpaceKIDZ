"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * Space backdrop: a slowly rotating Earth with a drifting cloud layer and a
 * thin atmospheric rim, over a deep starfield.
 *
 * Performance notes (this ships worldwide, so it must behave on mid-range
 * hardware):
 *  - the globe is deliberately small on screen, so the 2048px texture is
 *    super-sampled rather than stretched — that is what makes it look sharp;
 *  - the render loop stops completely when the canvas leaves the viewport;
 *  - nothing on the page transforms this canvas while scrolling.
 */

/* Fresnel atmosphere — a thin bright line at the limb, invisible face-on. */
const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPosition = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const atmosphereFragment = /* glsl */ `
  uniform vec3 glowColor;
  uniform float intensity;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float rim = 1.0 - abs(dot(viewDir, vNormal));
    // High exponent keeps the glow tight to the edge like real atmosphere
    rim = pow(rim, 5.0);
    gl_FragColor = vec4(glowColor, rim * intensity);
  }
`;

function Earth() {
  const surface = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const { gl, size } = useThree();

  const [dayMap, cloudMap] = useTexture(["/earth_atmos.jpg", "/earth_clouds.png"]);

  // Maximum anisotropic filtering keeps the surface crisp at the grazing
  // angles near the limb, where a plain mipmap turns to mush.
  useMemo(() => {
    const max = gl.capabilities.getMaxAnisotropy();
    [dayMap, cloudMap].forEach((t) => {
      t.anisotropy = max;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = true;
      t.needsUpdate = true;
    });
  }, [dayMap, cloudMap, gl]);

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color("#7fb2ff") },
          intensity: { value: 2.2 },
        },
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (surface.current) surface.current.rotation.y = t * 0.02;
    if (clouds.current) clouds.current.rotation.y = t * 0.027;
  });

  // Responsive framing: right of the copy on wide screens; up behind the
  // headline on narrow/portrait screens, where that position is off-frame.
  const narrow = size.width / size.height < 1.15;
  const position: [number, number, number] = narrow ? [0.9, 2.6, -1] : [3.25, -0.15, 0];
  const scale = narrow ? 0.8 : 1;

  const R = 1.55;

  return (
    <group position={position} scale={scale} rotation={[0.3, 0, -0.16]}>
      <mesh ref={surface}>
        <sphereGeometry args={[R, 128, 128]} />
        <meshStandardMaterial map={dayMap} roughness={0.68} metalness={0.05} />
      </mesh>

      <mesh ref={clouds}>
        <sphereGeometry args={[R * 1.012, 96, 96]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* Thin atmosphere — ~3.5% beyond the surface, not a fat halo */}
      <mesh material={atmosphereMaterial} scale={1.035}>
        <sphereGeometry args={[R, 64, 64]} />
      </mesh>
    </group>
  );
}

function SceneContents() {
  return (
    <>
      {/* Sun from the left — gives a soft day/night terminator across the disc */}
      <directionalLight position={[-5, 1.8, 3]} intensity={3.4} color="#fff6ea" />
      <ambientLight intensity={0.05} />
      {/* Cool rim from behind-right separates the night limb from space */}
      <pointLight position={[6.5, 0.5, -2]} intensity={18} color="#4f7df9" distance={22} />

      <Stars radius={100} depth={60} count={2400} factor={3.6} saturation={0} fade speed={0.2} />

      <Suspense fallback={null}>
        <Earth />
      </Suspense>
    </>
  );
}

export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Stop rendering entirely once the hero leaves the viewport.
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reduced motion: draw the Earth once and never animate it.
  const frameloop = reduced ? "demand" : visible ? "always" : "never";

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.25]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMappingExposure: 1.2,
        }}
        style={{ background: "transparent" }}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}

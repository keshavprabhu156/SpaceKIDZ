"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import Astronaut from "./Astronaut";
import {
  Satellite,
  MiniRocket,
  SmallPlanet,
  OrbitRings,
  Asteroids,
  Particles,
  Constellation,
  HoloPanel,
  HoloGlobe,
} from "./SceneExtras";

/** Generates an environment map procedurally — realistic helmet reflections
 *  with zero network/HDR assets. */
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new RoomEnvironment();
    const env = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.35;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function SceneContents() {
  return (
    <>
      <StudioEnvironment />

      {/* ------- Lighting: key, cyan rim, nebula fill ------- */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 4]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-4, 2, 3]} intensity={12} color="#4cc9f0" distance={12} />
      <pointLight position={[3, -2, -3]} intensity={10} color="#7b2ff7" distance={12} />
      <pointLight position={[0, 3, -4]} intensity={6} color="#3b6af0" distance={10} />

      {/* ------- Backdrop ------- */}
      <Stars radius={60} depth={40} count={2600} factor={3} saturation={0} fade speed={0.4} />
      <Constellation />

      {/* ------- Hero ------- */}
      <Astronaut position={[0, 0.15, 0]} />
      <OrbitRings />

      {/* ------- Orbiting hardware: scaled down and pushed out to look distant and detailed ------- */}
      <Satellite radius={3.8} speed={0.08} phase={0.5} tilt={0.25} scale={0.22} />
      <Satellite radius={4.6} speed={-0.05} phase={2.8} tilt={-0.15} scale={0.16} />
      <MiniRocket position={[2.5, -1.5, -1.2]} />

      {/* ------- Worlds ------- */}
      <SmallPlanet position={[-3.1, 1.9, -2.5]} color="#b08968" size={0.42} ring />
      <SmallPlanet position={[3.4, 1.6, -3]} color="#5e60ce" size={0.3} />
      <SmallPlanet position={[-2.6, -2, -2]} color="#9aa5b8" size={0.2} />

      {/* ------- Holograms the astronaut inspects ------- */}
      <HoloPanel
        position={[-1.7, 1.35, 0.4]}
        rotation={[0, 0.5, 0]}
        lines={["Δv = vₑ · ln(m₀/m₁)", "F = G·m₁m₂ / r²", "ORBIT: NOMINAL ▮▮▮▮▯"]}
        scale={0.9}
      />
      <HoloPanel
        position={[1.85, 0.15, 0.6]}
        rotation={[0, -0.55, 0]}
        lines={["E = mc²", "v = √(GM/r)", "SIGNAL: LOCKED ◉"]}
        scale={0.75}
        accent="#a78bfa"
      />
      <HoloGlobe position={[1.5, -1.5, 0.2]} />

      {/* ------- Ambience ------- */}
      <Asteroids count={12} />
      <Particles count={320} />

      {/* Post-processing disabled for React 19 / Next.js Turbopack compatibility */}
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.35, 5.4], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}

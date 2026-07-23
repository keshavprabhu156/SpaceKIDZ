"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import Astronaut from "./Astronaut";

/** Generates an environment map procedurally — realistic helmet/visor
 *  reflections with zero network/HDR assets. */
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new RoomEnvironment();
    const env = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.45;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/**
 * Astronaut-only scene rendered on a TRANSPARENT canvas.
 * The Earth / lunar surface / Milky Way backdrop is a photographic image
 * (/space.jpg) layered behind this canvas in the page markup — the astronaut
 * is the only real-time element, standing on the image's moon surface.
 */
function SceneContents() {
  return (
    <>
      <StudioEnvironment />

      {/* Base fill */}
      <ambientLight intensity={0.15} />
      <hemisphereLight args={["#8fa8ff", "#6b675f", 0.4]} />

      {/* Sun key light — high front-right, matching the backdrop's lighting */}
      <directionalLight position={[5, 6, 4]} intensity={3.0} color="#ffffff" />

      {/* Earthshine — cool blue rim from the left, where Earth sits in the image */}
      <pointLight position={[-5, 2, 1]} intensity={20} color="#6f8dfb" distance={20} />

      {/* Astronaut standing lower-right, feet at the image's near surface */}
      <Astronaut position={[2.35, -0.55, -0.8]} standing />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.55, 6.6], fov: 44 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}

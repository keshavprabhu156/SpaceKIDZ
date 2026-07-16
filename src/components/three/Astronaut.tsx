"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Astronaut({ position = [0, 0, 0] as [number, number, number] }) {
  const root = useRef<THREE.Group>(null);

  // Load the beautiful 3D astronaut model
  const { scene } = useGLTF("/astronaut.glb");

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // ---- Floating in microgravity ----
    if (root.current) {
      // Floating translation on Y
      root.current.position.y = position[1] + Math.sin(t * 0.55) * 0.12;
      // Gentle roll rotation
      root.current.rotation.z = Math.sin(t * 0.32) * 0.03;

      // ---- Mouse / Telemetry Glance Target ----
      // Slowly rotate the entire astronaut body to look at the mouse pointer
      const targetX = state.pointer.x;
      const targetY = state.pointer.y;

      const d = (a: number, b: number, lambda: number) =>
        THREE.MathUtils.damp(a, b, lambda, delta);

      root.current.rotation.y = d(root.current.rotation.y, targetX * 0.38, 2.5);
      root.current.rotation.x = d(root.current.rotation.x, -targetY * 0.16, 2.5);
    }
  });

  return (
    <group ref={root} position={position}>
      {/* 
        We scale the model to 0.9 so it fits in the viewport, and keep
        its default forward-facing orientation.
      */}
      <primitive
        object={scene}
        scale={0.9}
        position={[0, -0.9, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

// Preload the asset to avoid loading latency during scene initialization
useGLTF.preload("/astronaut.glb");

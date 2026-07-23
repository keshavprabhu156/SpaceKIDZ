"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export default function Astronaut({
  position = [0, 0, 0] as [number, number, number],
  standing = false,
}) {
  const root = useRef<THREE.Group>(null);

  // Track mouse position across the entire window
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalize to [-1, 1] range
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Load the high-quality Sketchfab astronaut (converted standard metallic-roughness PBR)
  const { scene, animations } = useGLTF("/astronaut_space.glb");
  const { actions } = useAnimations(animations, root);

  // Play the floating loop animation on mount
  useEffect(() => {
    const animName = Object.keys(actions)[0]; // "Animation"
    if (animName && actions[animName]) {
      actions[animName]!.reset().fadeIn(0.4).play();
    }
    return () => {
      if (animName && actions[animName]) {
        actions[animName]!.fadeOut(0.4);
      }
    };
  }, [actions]);

  // Smooth pointer tracking + weightless drift
  useFrame((state, delta) => {
    if (!root.current) return;

    const t = state.clock.getElapsedTime();
    const targetX = mouse.current.x;
    const targetY = mouse.current.y;

    const d = (a: number, b: number, lambda: number) =>
      THREE.MathUtils.damp(a, b, lambda, delta);

    // Damped rotational tracking — a planted figure only turns subtly
    root.current.rotation.y = d(root.current.rotation.y, targetX * (standing ? 0.3 : 1.4), 2.5);
    root.current.rotation.x = d(root.current.rotation.x, -targetY * (standing ? 0.05 : 0.5), 2.5);

    if (standing) {
      // Planted on the surface — only a faint breathing sway
      root.current.position.y = position[1] + Math.sin(t * 0.8) * 0.012;
      root.current.rotation.z = 0;
    } else {
      // Zero-gravity bob + slow tumble
      root.current.position.y = position[1] + Math.sin(t * 0.5) * 0.09;
      root.current.rotation.z = Math.sin(t * 0.35) * 0.05;
    }
  });

  return (
    <group ref={root} position={position}>
      <primitive
        object={scene}
        scale={0.95}
        position={[0, -1.8, 0]}
        rotation={[0, -0.3, 0]} // rotated slightly to face forward-left toward Earth
      />
    </group>
  );
}

// Preload the asset
useGLTF.preload("/astronaut_space.glb");

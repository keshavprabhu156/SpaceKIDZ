"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural astronaut rig.
 *
 * The body is built from primitives so the experience ships with zero heavy
 * assets; when a production GLTF astronaut arrives, swap the <Body> contents
 * for the loaded scene and keep this rig — all animation (breathing, float,
 * mouse-follow, wave, hologram glances) drives the same group hierarchy.
 */

const suitMat = new THREE.MeshStandardMaterial({ color: "#dfe5f0", roughness: 0.45, metalness: 0.08 });
const jointMat = new THREE.MeshStandardMaterial({ color: "#8b93a8", roughness: 0.5, metalness: 0.35 });
const navyMat = new THREE.MeshStandardMaterial({ color: "#12203f", roughness: 0.4, metalness: 0.3 });
const visorMat = new THREE.MeshPhysicalMaterial({
  color: "#050a14",
  metalness: 1,
  roughness: 0.06,
  envMapIntensity: 2.2,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
});
const glowCyan = new THREE.MeshStandardMaterial({
  color: "#22d3ee",
  emissive: "#22d3ee",
  emissiveIntensity: 2.4,
  toneMapped: false,
});
const glowGold = new THREE.MeshStandardMaterial({
  color: "#f5c542",
  emissive: "#f5c542",
  emissiveIntensity: 1.6,
  toneMapped: false,
});

function Arm({
  side,
  groupRef,
  forearmRef,
}: {
  side: 1 | -1;
  groupRef: React.RefObject<THREE.Group | null>;
  forearmRef: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group ref={groupRef} position={[side * 0.38, 0.42, 0]} rotation={[0, 0, side * -0.3]}>
      {/* shoulder */}
      <mesh material={jointMat}>
        <sphereGeometry args={[0.11, 16, 16]} />
      </mesh>
      {/* upper arm */}
      <mesh position={[0, -0.18, 0]} material={suitMat}>
        <capsuleGeometry args={[0.085, 0.22, 8, 16]} />
      </mesh>
      {/* forearm pivot */}
      <group ref={forearmRef} position={[0, -0.36, 0]} rotation={[0.35, 0, 0]}>
        <mesh material={jointMat}>
          <sphereGeometry args={[0.09, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.16, 0]} material={suitMat}>
          <capsuleGeometry args={[0.075, 0.2, 8, 16]} />
        </mesh>
        {/* glove */}
        <mesh position={[0, -0.32, 0]} material={navyMat}>
          <sphereGeometry args={[0.1, 16, 16]} />
        </mesh>
        {/* wrist ring */}
        <mesh position={[0, -0.26, 0]} rotation={[Math.PI / 2, 0, 0]} material={glowCyan}>
          <torusGeometry args={[0.085, 0.012, 8, 24]} />
        </mesh>
      </group>
    </group>
  );
}

function Leg({ side }: { side: 1 | -1 }) {
  return (
    <group position={[side * 0.16, -0.42, 0]}>
      <mesh material={jointMat}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>
      <mesh position={[0, -0.22, 0]} material={suitMat}>
        <capsuleGeometry args={[0.105, 0.26, 8, 16]} />
      </mesh>
      <mesh position={[0, -0.46, 0]} material={jointMat}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      <mesh position={[0, -0.66, 0]} material={suitMat}>
        <capsuleGeometry args={[0.09, 0.22, 8, 16]} />
      </mesh>
      {/* boot */}
      <mesh position={[0, -0.86, 0.05]} material={navyMat}>
        <boxGeometry args={[0.2, 0.16, 0.32]} />
      </mesh>
    </group>
  );
}

export default function Astronaut({ position = [0, 0, 0] as [number, number, number] }) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const rightForearm = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const leftForearm = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);

  // Hologram glance targets (matches hologram positions in SceneExtras)
  const glanceTargets = useMemo(
    () => [new THREE.Vector3(-1.6, 1.4, 0.6), new THREE.Vector3(1.7, 0.2, 0.8)],
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;
    const since = t - start.current;

    // ---- Floating in microgravity ----
    if (root.current) {
      root.current.position.y = position[1] + Math.sin(t * 0.55) * 0.12;
      root.current.rotation.z = Math.sin(t * 0.32) * 0.03;
    }

    // ---- Breathing ----
    if (torso.current) {
      const breathe = 1 + Math.sin(t * 1.35) * 0.012;
      torso.current.scale.set(breathe, 1 + Math.sin(t * 1.35) * 0.02, breathe);
    }

    // ---- Mouse follow vs. hologram glances ----
    // Every ~18s the astronaut spends ~4s inspecting a floating hologram.
    const cycle = t % 18;
    const glancing = cycle > 13 && cycle < 17;
    let targetX: number;
    let targetY: number;
    if (glancing) {
      const g = glanceTargets[Math.floor(t / 18) % glanceTargets.length];
      targetX = THREE.MathUtils.clamp(g.x * 0.4, -1, 1);
      targetY = THREE.MathUtils.clamp(g.y * 0.4, -0.8, 0.8);
    } else {
      targetX = state.pointer.x;
      targetY = state.pointer.y;
    }

    const d = (a: number, b: number, lambda: number) => THREE.MathUtils.damp(a, b, lambda, delta);
    if (torso.current) {
      torso.current.rotation.y = d(torso.current.rotation.y, targetX * 0.22, 3);
      torso.current.rotation.x = d(torso.current.rotation.x, -targetY * 0.08, 3);
    }
    if (head.current) {
      head.current.rotation.y = d(head.current.rotation.y, targetX * 0.45, 4);
      head.current.rotation.x = d(head.current.rotation.x, -targetY * 0.3, 4);
    }

    // ---- Wave once after page load (1.2s in, ~2.6s of waving, ease out) ----
    const wave = THREE.MathUtils.smoothstep(since, 1.2, 2.0) * (1 - THREE.MathUtils.smoothstep(since, 4.2, 5.0));
    if (rightArm.current && rightForearm.current) {
      const restZ = -0.3;
      const upZ = -2.35; // arm raised
      rightArm.current.rotation.z = THREE.MathUtils.lerp(restZ, upZ, wave);
      rightArm.current.rotation.x = THREE.MathUtils.lerp(0, -0.15, wave);
      const swing = Math.sin(since * 7) * 0.45 * wave;
      rightForearm.current.rotation.z = swing;
      rightForearm.current.rotation.x = THREE.MathUtils.lerp(0.35, 0.1, wave);
    }
    // Gentle idle sway on the left arm
    if (leftArm.current && leftForearm.current) {
      leftArm.current.rotation.z = 0.3 + Math.sin(t * 0.8) * 0.04;
      leftForearm.current.rotation.x = 0.35 + Math.sin(t * 0.6 + 1) * 0.06;
    }
  });

  return (
    <group ref={root} position={position}>
      <group ref={torso}>
        {/* torso */}
        <mesh material={suitMat}>
          <capsuleGeometry args={[0.32, 0.5, 8, 24]} />
        </mesh>
        {/* chest control panel */}
        <mesh position={[0, 0.12, 0.3]} material={navyMat}>
          <boxGeometry args={[0.26, 0.18, 0.08]} />
        </mesh>
        <mesh position={[-0.06, 0.14, 0.345]} material={glowCyan}>
          <boxGeometry args={[0.035, 0.02, 0.01]} />
        </mesh>
        <mesh position={[0.02, 0.14, 0.345]} material={glowGold}>
          <boxGeometry args={[0.035, 0.02, 0.01]} />
        </mesh>
        <mesh position={[-0.02, 0.08, 0.345]} material={glowCyan}>
          <boxGeometry args={[0.1, 0.015, 0.01]} />
        </mesh>
        {/* utility belt */}
        <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]} material={navyMat}>
          <torusGeometry args={[0.31, 0.045, 8, 32]} />
        </mesh>
        {/* backpack (life support) */}
        <mesh position={[0, 0.12, -0.36]} material={jointMat}>
          <boxGeometry args={[0.46, 0.56, 0.22]} />
        </mesh>
        <mesh position={[0, 0.42, -0.36]} material={navyMat}>
          <boxGeometry args={[0.4, 0.08, 0.18]} />
        </mesh>
        <mesh position={[0.16, -0.1, -0.49]} material={glowCyan}>
          <boxGeometry args={[0.02, 0.14, 0.01]} />
        </mesh>

        {/* head + helmet */}
        <group ref={head} position={[0, 0.62, 0]}>
          <mesh position={[0, 0.14, 0]} material={suitMat}>
            <sphereGeometry args={[0.29, 32, 32]} />
          </mesh>
          {/* visor */}
          <mesh position={[0, 0.15, 0.09]} scale={[0.92, 0.78, 0.82]} material={visorMat}>
            <sphereGeometry args={[0.26, 32, 32]} />
          </mesh>
          {/* helmet rim light */}
          <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={glowCyan}>
            <torusGeometry args={[0.2, 0.014, 8, 32]} />
          </mesh>
          {/* helmet lamps */}
          <mesh position={[-0.22, 0.22, 0.12]} material={glowCyan}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>
          <mesh position={[0.22, 0.22, 0.12]} material={glowCyan}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>
        </group>

        <Arm side={1} groupRef={leftArm} forearmRef={leftForearm} />
        <Arm side={-1} groupRef={rightArm} forearmRef={rightForearm} />
        <Leg side={1} />
        <Leg side={-1} />
      </group>
    </group>
  );
}

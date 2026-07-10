"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Shared materials                                                    */
/* ------------------------------------------------------------------ */

const metalMat = new THREE.MeshStandardMaterial({ color: "#c8d0e0", roughness: 0.35, metalness: 0.8 });
const darkMetalMat = new THREE.MeshStandardMaterial({ color: "#2a3350", roughness: 0.4, metalness: 0.7 });
const panelMat = new THREE.MeshStandardMaterial({
  color: "#1a3a8f",
  roughness: 0.25,
  metalness: 0.6,
  emissive: "#0a1f5c",
  emissiveIntensity: 0.4,
});
const holoMat = new THREE.MeshBasicMaterial({
  color: "#22d3ee",
  transparent: true,
  opacity: 0.35,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  toneMapped: false,
});
const glowCyanMat = new THREE.MeshStandardMaterial({
  color: "#22d3ee",
  emissive: "#22d3ee",
  emissiveIntensity: 2,
  toneMapped: false,
});

/* ------------------------------------------------------------------ */
/* Satellite — bus + solar wings + dish, orbiting slowly              */
/* ------------------------------------------------------------------ */

export function Satellite({
  radius = 3,
  speed = 0.12,
  phase = 0,
  tilt = 0.3,
  scale = 1,
}: {
  radius?: number;
  speed?: number;
  phase?: number;
  tilt?: number;
  scale?: number;
}) {
  const orbit = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const a = clock.elapsedTime * speed + phase;
    if (orbit.current) {
      orbit.current.position.set(Math.cos(a) * radius, Math.sin(a * 0.7) * radius * 0.25, Math.sin(a) * radius * 0.6);
    }
    if (body.current) {
      body.current.rotation.y = a * 2;
      body.current.rotation.x = Math.sin(a) * 0.2;
    }
  });

  return (
    <group rotation={[tilt, 0, tilt * 0.5]}>
      <group ref={orbit}>
        <group ref={body} scale={scale}>
          <mesh material={metalMat}>
            <boxGeometry args={[0.22, 0.22, 0.34]} />
          </mesh>
          {/* solar wings */}
          {[1, -1].map((s) => (
            <group key={s} position={[s * 0.42, 0, 0]}>
              <mesh material={panelMat}>
                <boxGeometry args={[0.5, 0.015, 0.24]} />
              </mesh>
              <mesh position={[s * -0.28, 0, 0]} material={darkMetalMat}>
                <boxGeometry args={[0.08, 0.02, 0.03]} />
              </mesh>
            </group>
          ))}
          {/* dish */}
          <mesh position={[0, 0.16, 0.1]} rotation={[-0.7, 0, 0]} material={metalMat}>
            <coneGeometry args={[0.1, 0.06, 16, 1, true]} />
          </mesh>
          {/* beacon */}
          <mesh position={[0, -0.14, 0]} material={glowCyanMat}>
            <sphereGeometry args={[0.02, 8, 8]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Mini rocket drifting diagonally                                     */
/* ------------------------------------------------------------------ */

export function MiniRocket({ position = [2.4, -1.4, -1] as [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 0.4) * 0.25;
      ref.current.position.x = position[0] + Math.cos(t * 0.3) * 0.15;
      ref.current.rotation.z = -0.5 + Math.sin(t * 0.35) * 0.06;
    }
  });
  return (
    <group ref={ref} position={position} rotation={[0, 0, -0.5]} scale={0.55}>
      <mesh material={metalMat}>
        <cylinderGeometry args={[0.12, 0.14, 0.7, 16]} />
      </mesh>
      <mesh position={[0, 0.48, 0]} material={darkMetalMat}>
        <coneGeometry args={[0.12, 0.28, 16]} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i * Math.PI) / 2) * 0.15, -0.32, Math.sin((i * Math.PI) / 2) * 0.15]}
          rotation={[0, (-i * Math.PI) / 2, 0]}
          material={darkMetalMat}
        >
          <boxGeometry args={[0.02, 0.18, 0.12]} />
        </mesh>
      ))}
      {/* engine glow */}
      <mesh position={[0, -0.44, 0]} material={glowCyanMat}>
        <coneGeometry args={[0.08, 0.18, 12]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Small planets                                                       */
/* ------------------------------------------------------------------ */

export function SmallPlanet({
  position,
  color,
  size = 0.4,
  ring = false,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
  ring?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05 }),
    [color]
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.15;
      ref.current.position.y = position[1] + Math.sin(t * 0.25 + position[0]) * 0.15;
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh material={mat}>
        <sphereGeometry args={[size, 24, 24]} />
      </mesh>
      {ring && (
        <mesh rotation={[1.2, 0, 0.3]} material={holoMat}>
          <torusGeometry args={[size * 1.6, size * 0.06, 8, 48]} />
        </mesh>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Orbit rings around the composition                                  */
/* ------------------------------------------------------------------ */

export function OrbitRings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (a.current) a.current.rotation.z = t * 0.04;
    if (b.current) b.current.rotation.z = -t * 0.03;
  });
  return (
    <group>
      <mesh ref={a} rotation={[1.35, 0.2, 0]}>
        <torusGeometry args={[2.6, 0.006, 8, 128]} />
        <meshBasicMaterial color="#4cc9f0" transparent opacity={0.25} toneMapped={false} />
      </mesh>
      <mesh ref={b} rotation={[1.15, -0.3, 0.4]}>
        <torusGeometry args={[3.3, 0.005, 8, 128]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.18} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Asteroids — instanced, slow drift                                   */
/* ------------------------------------------------------------------ */

export function Asteroids({ count = 14 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        r: 3.4 + (i % 5) * 0.35,
        speed: 0.02 + (i % 3) * 0.012,
        phase: (i / count) * Math.PI * 2,
        y: ((i % 7) - 3) * 0.5,
        s: 0.03 + (i % 4) * 0.02,
      })),
    [count]
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!mesh.current) return;
    seeds.forEach((seed, i) => {
      const a = t * seed.speed + seed.phase;
      dummy.position.set(Math.cos(a) * seed.r, seed.y + Math.sin(a * 2) * 0.2, Math.sin(a) * seed.r * 0.5 - 1);
      dummy.rotation.set(a * 3, a * 2, a);
      dummy.scale.setScalar(seed.s);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} material={darkMetalMat}>
      <dodecahedronGeometry args={[1, 0]} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Ambient particles                                                   */
/* ------------------------------------------------------------------ */

export function Particles({ count = 350 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#8fd8f0"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Constellation lines                                                 */
/* ------------------------------------------------------------------ */

export function Constellation() {
  const geometry = useMemo(() => {
    // A stylised constellation in the upper-left backdrop
    const pts = [
      [-4.2, 2.6, -3], [-3.5, 2.2, -3], [-3.0, 2.7, -3], [-2.4, 2.3, -3], [-2.0, 2.9, -3],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);
  const starGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array([-4.2, 2.6, -3, -3.5, 2.2, -3, -3.0, 2.7, -3, -2.4, 2.3, -3, -2.0, 2.9, -3]);
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const line = useMemo(
    () =>
      new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color: "#4cc9f0", transparent: true, opacity: 0.25, toneMapped: false })
      ),
    [geometry]
  );
  return (
    <group>
      <primitive object={line} />
      <points geometry={starGeom}>
        <pointsMaterial size={0.06} color="#e8f0ff" transparent opacity={0.9} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Holographic panels — equations & diagrams on canvas textures        */
/* ------------------------------------------------------------------ */

function makeHoloTexture(lines: string[], accent = "#22d3ee") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 320);

  // frame
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, 496, 304);
  ctx.globalAlpha = 0.35;
  ctx.strokeRect(16, 16, 480, 288);

  // header bar
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = accent;
  ctx.fillRect(16, 16, 480, 30);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#030014";
  ctx.font = "bold 20px monospace";
  ctx.fillText("◈ TELEMETRY // LIVE", 28, 38);

  // content
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 12;
  ctx.font = "28px monospace";
  lines.forEach((line, i) => {
    ctx.fillText(line, 32, 96 + i * 48);
  });
  return new THREE.CanvasTexture(canvas);
}

export function HoloPanel({
  position,
  rotation = [0, 0, 0] as [number, number, number],
  lines,
  scale = 1,
  accent = "#22d3ee",
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  lines: string[];
  scale?: number;
  accent?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => makeHoloTexture(lines, accent), [lines, accent]);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [texture]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 0.6 + position[0] * 2) * 0.08;
      // holographic flicker
      material.opacity = 0.75 + Math.sin(t * 9 + position[0]) * 0.04 + Math.sin(t * 23) * 0.03;
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1.1, 0.69]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* Wireframe hologram globe */
export function HoloGlobe({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.2;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.32, 16, 12]} />
        <meshBasicMaterial color="#4cc9f0" wireframe transparent opacity={0.3} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.004, 8, 48]} />
        <meshBasicMaterial color="#4cc9f0" transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

"use client";

import { useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * Simplified two-body orbit simulator.
 * Gravity: a = -μ · r̂ / |r|².  Students tune initial altitude + tangential
 * velocity and discover circular/elliptical orbits, re-entry and escape.
 */

const MU = 12; // gravitational parameter (scene units)
const EARTH_R = 1;

type Status = "orbiting" | "crashed" | "escaped";

interface SimState {
  pos: THREE.Vector2;
  vel: THREE.Vector2;
  trail: THREE.Vector3[];
  status: Status;
}

function SatelliteSim({
  simRef,
  onStatus,
}: {
  simRef: React.MutableRefObject<SimState>;
  onStatus: (s: Status, alt: number, speed: number) => void;
}) {
  const sat = useRef<THREE.Group>(null);
  const trailGeom = useRef<THREE.BufferGeometry>(null);

  useFrame((_, delta) => {
    const sim = simRef.current;
    if (sim.status !== "orbiting") return;
    const dt = Math.min(delta, 0.033);

    // Symplectic Euler, substepped for stability near periapsis
    for (let i = 0; i < 4; i++) {
      const r = sim.pos.length();
      const a = sim.pos.clone().multiplyScalar(-MU / (r * r * r));
      sim.vel.addScaledVector(a, dt / 4);
      sim.pos.addScaledVector(sim.vel, dt / 4);
    }

    const r = sim.pos.length();
    if (r < EARTH_R + 0.05) sim.status = "crashed";
    if (r > 14) sim.status = "escaped";

    if (sat.current) {
      sat.current.position.set(sim.pos.x, 0, sim.pos.y);
      sat.current.rotation.y += dt * 2;
    }

    sim.trail.push(new THREE.Vector3(sim.pos.x, 0, sim.pos.y));
    if (sim.trail.length > 400) sim.trail.shift();
    if (trailGeom.current) trailGeom.current.setFromPoints(sim.trail);

    onStatus(sim.status, r - EARTH_R, sim.vel.length());
  });

  return (
    <>
      <group ref={sat}>
        <mesh>
          <boxGeometry args={[0.08, 0.08, 0.12]} />
          <meshStandardMaterial color="#c8d0e0" metalness={0.8} roughness={0.3} />
        </mesh>
        {[1, -1].map((s) => (
          <mesh key={s} position={[s * 0.14, 0, 0]}>
            <boxGeometry args={[0.16, 0.005, 0.08]} />
            <meshStandardMaterial color="#1a3a8f" emissive="#0a1f5c" emissiveIntensity={0.5} />
          </mesh>
        ))}
        <pointLight intensity={0.6} color="#22d3ee" distance={1.5} />
      </group>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <line>
        <bufferGeometry ref={trailGeom} />
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.6} toneMapped={false} />
      </line>
    </>
  );
}

function Earth() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[EARTH_R, 48, 48]} />
        <meshStandardMaterial color="#1d4e89" roughness={0.7} metalness={0.1} emissive="#0a2547" emissiveIntensity={0.3} />
      </mesh>
      {/* atmosphere */}
      <mesh scale={1.06}>
        <sphereGeometry args={[EARTH_R, 32, 32]} />
        <meshBasicMaterial color="#4cc9f0" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export default function OrbitSimulator() {
  const [altitude, setAltitude] = useState(1.5);
  const [velocity, setVelocity] = useState(2.2);
  const [telemetry, setTelemetry] = useState({ status: "orbiting" as Status, alt: 1.5, speed: 2.2 });
  const [run, setRun] = useState(0);

  const simRef = useRef<SimState>({
    pos: new THREE.Vector2(EARTH_R + 1.5, 0),
    vel: new THREE.Vector2(0, 2.2),
    trail: [],
    status: "orbiting",
  });

  const launch = useCallback(() => {
    simRef.current = {
      pos: new THREE.Vector2(EARTH_R + altitude, 0),
      vel: new THREE.Vector2(0, velocity),
      trail: [],
      status: "orbiting",
    };
    setTelemetry({ status: "orbiting", alt: altitude, speed: velocity });
    setRun((r) => r + 1);
  }, [altitude, velocity]);

  const onStatus = useCallback((status: Status, alt: number, speed: number) => {
    setTelemetry((t) =>
      t.status !== status || Math.abs(t.alt - alt) > 0.02 || Math.abs(t.speed - speed) > 0.02
        ? { status, alt, speed }
        : t
    );
  }, []);

  const circular = Math.sqrt(MU / (EARTH_R + altitude)).toFixed(2);

  const statusUI = {
    orbiting: { label: "ORBIT NOMINAL", cls: "text-electric" },
    crashed: { label: "RE-ENTRY — TRY MORE VELOCITY", cls: "text-red-400" },
    escaped: { label: "ESCAPE TRAJECTORY — TOO FAST", cls: "text-gold" },
  }[telemetry.status];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="holo-panel relative h-[420px] overflow-hidden sm:h-[520px]">
        <Canvas key={run} camera={{ position: [0, 6.5, 6.5], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 3]} intensity={2} />
          <Stars radius={40} depth={20} count={1500} factor={2.5} fade speed={0.3} />
          <Earth />
          <SatelliteSim simRef={simRef} onStatus={onStatus} />
        </Canvas>
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-white/10 bg-space-black/70 p-3 font-mono text-[11px] uppercase tracking-widest backdrop-blur">
          <p className={statusUI.cls}>◉ {statusUI.label}</p>
          <p className="mt-1 text-star/50">ALT {telemetry.alt.toFixed(2)} · VEL {telemetry.speed.toFixed(2)}</p>
        </div>
      </div>

      <div className="holo-panel flex flex-col gap-6 p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-electric/70">
          Flight Controls
        </p>

        <div>
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-star/50">
            <span>Initial Altitude</span>
            <span className="text-electric">{altitude.toFixed(1)}</span>
          </div>
          <input
            type="range" min={0.6} max={4} step={0.1} value={altitude}
            onChange={(e) => setAltitude(Number(e.target.value))}
            className="mt-2 w-full accent-cyan-glow"
          />
        </div>

        <div>
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-star/50">
            <span>Launch Velocity</span>
            <span className="text-electric">{velocity.toFixed(1)}</span>
          </div>
          <input
            type="range" min={0.5} max={4.5} step={0.1} value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="mt-2 w-full accent-cyan-glow"
          />
        </div>

        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 font-mono text-[11px] leading-relaxed text-star/45">
          MISSION HINT — circular orbit at this altitude needs velocity ≈{" "}
          <span className="text-electric">{circular}</span>. Slower falls back; much faster
          escapes Earth&apos;s pull.
        </div>

        <button onClick={launch} className="btn-primary w-full">
          🚀 Launch Satellite
        </button>
      </div>
    </div>
  );
}

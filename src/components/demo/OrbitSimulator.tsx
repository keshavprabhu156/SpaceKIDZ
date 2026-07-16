"use client";

import { useRef, useState, useCallback, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * Simplified two-body orbit simulator.
 * Gravity: a = -μ · r̂ / |r|². Students tune initial altitude + tangential
 * velocity and discover circular/elliptical orbits, re-entry and escape.
 */

const MU = 12; // gravitational parameter (scene units)
const EARTH_R = 1.0;

type Status = "standby" | "orbiting" | "crashed" | "escaped";

interface SimState {
  pos: THREE.Vector2;
  vel: THREE.Vector2;
  trail: THREE.Vector3[];
  status: Status;
}

function DetailedSatelliteModel() {
  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#f5d061", // shiny gold MLI foil
    metalness: 0.95,
    roughness: 0.18,
  }), []);
  
  const solarPanelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0f2042", // deep blue silicon
    emissive: "#143272",
    emissiveIntensity: 0.8,
    metalness: 0.8,
    roughness: 0.15,
  }), []);

  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#dfe4ec", // silver metal
    metalness: 0.95,
    roughness: 0.1,
  }), []);

  const thrusterMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#38bdf8",
    emissive: "#0ea5e9",
    emissiveIntensity: 5.0,
    toneMapped: false,
  }), []);

  return (
    <group scale={1.2}>
      {/* Main satellite body - Hexagonal Prism */}
      <mesh material={goldMaterial}>
        <cylinderGeometry args={[0.07, 0.07, 0.16, 6]} />
      </mesh>
      
      {/* Sensor arrays/instrument deck on top */}
      <mesh position={[0, 0.09, 0]} material={chromeMaterial}>
        <boxGeometry args={[0.08, 0.02, 0.08]} />
      </mesh>

      {/* High-gain dish antenna facing forward */}
      <group position={[0, 0.04, 0.095]} rotation={[Math.PI / 2.5, 0, 0]}>
        {/* Dish stalk */}
        <mesh material={chromeMaterial} position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.04, 8]} />
        </mesh>
        {/* Parabolic reflector */}
        <mesh material={chromeMaterial}>
          <coneGeometry args={[0.05, 0.025, 12, 1, true]} />
        </mesh>
      </group>

      {/* Dual Solar Panels */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.18, 0, 0]}>
          {/* Connector strut */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMaterial}>
            <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
          </mesh>
          {/* Main solar wing */}
          <mesh position={[side * 0.1, 0, 0]} material={solarPanelMaterial}>
            <boxGeometry args={[0.18, 0.008, 0.11]} />
          </mesh>
          {/* Grid lining details */}
          <mesh position={[side * 0.1, 0.005, 0]} material={chromeMaterial}>
            <boxGeometry args={[0.002, 0.001, 0.11]} />
          </mesh>
        </group>
      ))}

      {/* Ion Thruster nozzle and glowing exhaust effect */}
      <group position={[0, 0, -0.095]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={chromeMaterial}>
          <cylinderGeometry args={[0.018, 0.024, 0.03, 8]} />
        </mesh>
        {/* Thruster exhaust flame */}
        <mesh position={[0, -0.03, 0]} material={thrusterMaterial}>
          <coneGeometry args={[0.012, 0.05, 8, 1, false]} />
        </mesh>
      </group>

      {/* Status LED indicators */}
      <mesh position={[0.02, 0.08, 0.04]} material={thrusterMaterial}>
        <sphereGeometry args={[0.006, 8, 8]} />
      </mesh>
    </group>
  );
}

function SatelliteSim({
  simRef,
  onStatus,
  gameState,
  altitude,
  trackerRef,
  trackerTextRef,
  trackerArrowRef,
}: {
  simRef: React.MutableRefObject<SimState>;
  onStatus: (s: Status, alt: number, speed: number) => void;
  gameState: "menu" | "playing";
  altitude: number;
  trackerRef: React.RefObject<HTMLDivElement | null>;
  trackerTextRef: React.RefObject<HTMLDivElement | null>;
  trackerArrowRef: React.RefObject<HTMLDivElement | null>;
}) {
  const sat = useRef<THREE.Group>(null);
  const trailGeom = useRef<THREE.BufferGeometry>(null);
  const tempV = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const sim = simRef.current;
    
    // Manage dynamic off-screen HUD tracker
    if (gameState !== "playing" || sim.status !== "orbiting") {
      if (trackerRef.current) trackerRef.current.style.display = "none";
    } else {
      tempV.set(sim.pos.x, 0, sim.pos.y);
      const distanceVal = tempV.length();
      
      // Project 3D vector to Normalized Device Coordinates (NDC) [-1, 1]
      tempV.project(state.camera);
      
      const isOffscreen = Math.abs(tempV.x) > 1.05 || Math.abs(tempV.y) > 1.05;
      if (isOffscreen && trackerRef.current) {
        trackerRef.current.style.display = "flex";
        
        // Calculate intersection boundary with the screen NDC frame
        const scale = Math.min(1.0 / Math.abs(tempV.x), 1.0 / Math.abs(tempV.y));
        const edgeX = tempV.x * scale;
        const edgeY = tempV.y * scale;
        
        // Convert to percentage layout (X: [-1,1]->[0,100]%, Y: [-1,1]->[100,0]%)
        const leftPct = (edgeX + 1) * 50;
        const topPct = (1 - edgeY) * 50;
        
        const inset = 36; // safety margin offset in px
        trackerRef.current.style.left = `calc(${leftPct}% + ${edgeX * -inset}px)`;
        trackerRef.current.style.top = `calc(${topPct}% + ${edgeY * inset}px)`;
        
        // Calculate pointer rotation heading
        const angle = Math.atan2(tempV.y, tempV.x);
        const deg = (angle * 180) / Math.PI - 90; // offset since arrow points up natively
        if (trackerArrowRef.current) {
          trackerArrowRef.current.style.transform = `rotate(${deg}deg)`;
        }
        
        // Compute telemetry states (radial velocity for ascend/descend checks)
        const radialVel = sim.pos.x * sim.vel.x + sim.pos.y * sim.vel.y;
        const stateStr = radialVel > 0 ? "▲ ASCENDING" : "▼ DESCENDING";
        const distKm = (distanceVal * 6371).toFixed(0);
        
        if (trackerTextRef.current) {
          trackerTextRef.current.innerHTML = `
            <div class="font-bold text-electric text-[9px]">${distKm} km</div>
            <div class="text-[7px] text-star/50 tracking-wider">${stateStr}</div>
          `;
        }
      } else {
        if (trackerRef.current) trackerRef.current.style.display = "none";
      }
    }
    
    // In standby mode, lock the satellite position on the pad
    if (sim.status === "standby") {
      if (sat.current) {
        sat.current.position.set(EARTH_R + altitude, 0, 0);
        sat.current.rotation.y = Math.PI / 2; // Point tangentially
      }
      return;
    }

    if (gameState !== "playing" || sim.status !== "orbiting") return;
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
      // Orient the satellite tangentially to its flight path velocity vector
      const heading = Math.atan2(-sim.vel.y, sim.vel.x);
      sat.current.rotation.y = heading;
    }

    sim.trail.push(new THREE.Vector3(sim.pos.x, 0, sim.pos.y));
    if (sim.trail.length > 400) sim.trail.shift();
    if (trailGeom.current) trailGeom.current.setFromPoints(sim.trail);

    onStatus(sim.status, r - EARTH_R, sim.vel.length());
  });

  return (
    <>
      <group ref={sat} visible={simRef.current.status === "orbiting"}>
        <DetailedSatelliteModel />
        <pointLight intensity={1.2} color="#22d3ee" distance={1.8} />
      </group>
      <line>
        <bufferGeometry ref={trailGeom} />
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.65} toneMapped={false} />
      </line>
    </>
  );
}

function Earth() {
  // Load beautiful Earth map and cloud layers
  const [colorMap, cloudsMap] = useTexture([
    "/earth_atmos.jpg",
    "/earth_clouds.png"
  ]);

  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.025;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.032; // clouds drift faster
  });

  return (
    <group>
      {/* Textured Earth Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[EARTH_R, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          roughness={0.45}
          metalness={0.1}
        />
      </mesh>
      
      {/* Semi-transparent cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[EARTH_R + 0.015, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmospheric glowing envelope */}
      <mesh scale={1.12}>
        <sphereGeometry args={[EARTH_R, 32, 32]} />
        <meshBasicMaterial color="#4cc9f0" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function ReferenceOrbit({ radius }: { radius: number }) {
  const geomRef = useRef<THREE.BufferGeometry>(null);

  useFrame(() => {
    if (geomRef.current) {
      const pts = [];
      for (let i = 0; i <= 100; i++) {
        const theta = (i / 100) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      geomRef.current.setFromPoints(pts);
    }
  });

  return (
    <line>
      <bufferGeometry ref={geomRef} />
      <lineBasicMaterial color="#7b2ff7" transparent opacity={0.35} />
    </line>
  );
}

function ExplosionEffect({ position }: { position: THREE.Vector3 }) {
  const particlesRef = useRef<THREE.Points>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const time = useRef(0);

  // Initialize particle positions and velocities
  const [particleData] = useState(() => {
    const count = 80;
    const pos = new Float32Array(count * 3);
    const vel = [];
    
    for (let i = 0; i < count; i++) {
      // Position starts at the crash center
      pos[i * 3] = position.x;
      pos[i * 3 + 1] = position.y;
      pos[i * 3 + 2] = position.z;

      // Random expanding velocity (spherical distribution)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 0.6 + Math.random() * 2.2;
      
      vel.push(
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        )
      );
    }
    
    return { pos, vel, count };
  });

  useFrame((_, delta) => {
    time.current += delta;
    const t = time.current;

    // 1. Update shockwave scale and opacity
    if (shockwaveRef.current) {
      const scaleVal = 0.1 + t * 3.2;
      shockwaveRef.current.scale.set(scaleVal, scaleVal, scaleVal);
      
      const mat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 0.8 - t * 1.6);
      }
    }

    // 2. Update particles position and gravity pull
    if (particlesRef.current) {
      const geom = particlesRef.current.geometry;
      const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
      
      if (posAttr) {
        const arr = posAttr.array as Float32Array;
        for (let i = 0; i < particleData.count; i++) {
          const v = particleData.vel[i];
          
          // Apply a bit of gravity pull towards center of Earth [0,0,0]
          const curPos = new THREE.Vector3(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]);
          const toCenter = curPos.clone().normalize().multiplyScalar(-1.5 * delta);
          v.add(toCenter);

          // Move particle
          arr[i * 3] += v.x * delta;
          arr[i * 3 + 1] += v.y * delta;
          arr[i * 3 + 2] += v.z * delta;
        }
        posAttr.needsUpdate = true;
      }

      const mat = particlesRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 1.0 - t * 1.2);
        mat.size = Math.max(0, 0.08 * (1.0 - t * 0.9));
      }
    }
  });

  return (
    <group>
      {/* Expanding Shockwave Sphere */}
      <mesh ref={shockwaveRef} position={position}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Bursting Ember Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.pos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffaa00"
          size={0.08}
          transparent
          opacity={1.0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Bright Flash point light */}
      {time.current < 0.6 && (
        <pointLight
          position={position}
          intensity={Math.max(0, 10 * (1.0 - time.current * 1.6))}
          color="#ff7700"
          distance={4}
        />
      )}
    </group>
  );
}

export default function OrbitSimulator() {
  const [altitude, setAltitude] = useState(0.0);
  const [velocity, setVelocity] = useState(0.0);
  const [telemetry, setTelemetry] = useState({ status: "standby" as Status, alt: 0.0, speed: 0.0 });
  const [run, setRun] = useState(0);
  const [gameState, setGameState] = useState<"menu" | "playing">("menu");
  const [showPopup, setShowPopup] = useState(false);

  const trackerRef = useRef<HTMLDivElement>(null);
  const trackerTextRef = useRef<HTMLDivElement>(null);
  const trackerArrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (telemetry.status === "crashed") {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1600); // 1.6s delay lets the crash particles fly and shockwave expand/fade
      return () => clearTimeout(timer);
    } else if (telemetry.status === "escaped") {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1200); // 1.2s delay lets them see the satellite float away
      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, [telemetry.status]);

  const simRef = useRef<SimState>({
    pos: new THREE.Vector2(EARTH_R + 0.0, 0),
    vel: new THREE.Vector2(0, 0.0),
    trail: [],
    status: "standby",
  });

  const launch = useCallback(() => {
    simRef.current = {
      pos: new THREE.Vector2(EARTH_R + altitude, 0),
      vel: new THREE.Vector2(0, velocity),
      trail: [],
      status: "orbiting",
    };
    setTelemetry({ status: "orbiting", alt: altitude, speed: velocity });
  }, [altitude, velocity]);

  const resetToStandby = useCallback(() => {
    setAltitude(0.0);
    setVelocity(0.0);
    simRef.current = {
      pos: new THREE.Vector2(EARTH_R + 0.0, 0),
      vel: new THREE.Vector2(0, 0.0),
      trail: [],
      status: "standby",
    };
    setTelemetry({ status: "standby", alt: 0.0, speed: 0.0 });
    setRun((r) => r + 1);
  }, []);

  const onStatus = useCallback((status: Status, alt: number, speed: number) => {
    setTelemetry((t) =>
      t.status !== status || Math.abs(t.alt - alt) > 0.02 || Math.abs(t.speed - speed) > 0.02
        ? { status, alt, speed }
        : t
    );
  }, []);

  const circular = Math.sqrt(MU / (EARTH_R + altitude)).toFixed(2);

  const statusUI = {
    standby: { label: "LAUNCH STANDBY", cls: "text-electric animate-pulse" },
    orbiting: { label: "ORBIT NOMINAL", cls: "text-emerald-400 animate-pulse" },
    crashed: { label: "RE-ENTRY — COLLISION", cls: "text-red-400" },
    escaped: { label: "SIGNAL LOST — ESCAPE", cls: "text-gold" },
  }[telemetry.status];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="holo-panel relative h-[420px] overflow-hidden sm:h-[520px]">
        <Canvas key={run} camera={{ position: [0, 6.5, 6.5], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.5} />
          {/* Key lights to highlight metallic surfaces */}
          <directionalLight position={[6, 8, 4]} intensity={2.5} />
          <directionalLight position={[-6, -4, -4]} intensity={0.8} color="#7b2ff7" />
          <pointLight position={[3, 2, 2]} intensity={2} color="#4cc9f0" />
          <Stars radius={40} depth={20} count={1800} factor={2.8} fade speed={0.3} />
          
          <Suspense fallback={null}>
            <Earth />
            <SatelliteSim
              simRef={simRef}
              onStatus={onStatus}
              gameState={gameState}
              altitude={altitude}
              trackerRef={trackerRef}
              trackerTextRef={trackerTextRef}
              trackerArrowRef={trackerArrowRef}
            />
          </Suspense>

          {/* Reference Orbit Target Guide */}
          <ReferenceOrbit radius={EARTH_R + altitude} />

          {/* Cinematic crash explosion effect */}
          {telemetry.status === "crashed" && (
            <ExplosionEffect position={new THREE.Vector3(simRef.current.pos.x, 0, simRef.current.pos.y)} />
          )}
        </Canvas>

        {/* Telemetry panel (hidden when in menu) */}
        {gameState === "playing" && (
          <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-white/10 bg-space-black/85 p-3 font-mono text-[11px] uppercase tracking-widest backdrop-blur-md z-10">
            <p className={statusUI.cls}>◉ {statusUI.label}</p>
            <p className="mt-1 text-star/50">ALT {telemetry.alt.toFixed(2)} · VEL {telemetry.speed.toFixed(2)}</p>
          </div>
        )}

        {/* 1. MAIN MENU OVERLAY */}
        {gameState === "menu" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center animate-backdropFade">
            <div className="pointer-events-none absolute inset-0 bg-holo-grid bg-[size:30px_30px] opacity-10" />
            
            {/* High-tech console layout decoration */}
            <div className="absolute left-4 top-4 font-mono text-[9px] text-electric/40">// UPLINK_STANDBY</div>
            <div className="absolute right-4 top-4 font-mono text-[9px] text-electric/40">SYS.VER: 16.2 +</div>
            
            <div className="relative max-w-md animate-scaleUpFade">
              <span className="rounded-full border border-electric/30 bg-electric/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-electric">
                Mission Briefing // 01
              </span>
              <h3 className="mt-6 font-display text-2xl font-black uppercase tracking-widest text-star sm:text-3xl">
                ORBIT SIMULATOR
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-star/60 uppercase font-mono tracking-wider">
                Launch and insert a satellite into a stable orbit around Earth by tuning altitude and tangential speed.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => {
                    setGameState("playing");
                    resetToStandby();
                  }}
                  className="btn-primary"
                >
                  🚀 Start Simulator
                </button>
                <button
                  onClick={() => document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-lg border border-white/10 bg-white/5 text-star/80 px-6 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold transition-all hover:bg-white/10 hover:text-white"
                >
                  📝 Go to Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. CRASHED (COLLISION) POPUP OVERLAY */}
        {gameState === "playing" && telemetry.status === "crashed" && showPopup && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 animate-backdropFade">
            <div className="holo-panel border-red-500/30 max-w-sm w-full bg-space-black/95 p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.25)] relative overflow-hidden animate-scaleUpFade">
              {/* Red neon top strip */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              
              <span className="text-4xl text-red-500 animate-pulse inline-block">⚠️</span>
              <h4 className="mt-4 font-display text-lg font-bold uppercase tracking-wider text-red-400">
                Collision Detected
              </h4>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-star/40">
                Re-entry // Critical Failure
              </p>
              
              <div className="my-5 rounded border border-white/5 bg-white/[0.02] py-3 font-mono text-[11px] text-star/60">
                <p>Impact Velocity: <span className="text-red-400 font-bold">{telemetry.speed.toFixed(2)} km/s</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={resetToStandby}
                  className="rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold transition-all hover:bg-red-500/25 hover:border-red-500 hover:text-white"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setGameState("menu");
                    resetToStandby();
                  }}
                  className="rounded-lg bg-white/5 border border-white/10 text-star/60 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold transition-all hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={() => document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-3 w-full rounded-lg border border-electric/30 bg-electric/5 text-electric px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold transition-all hover:bg-electric/15 hover:text-white"
              >
                📝 Go to Quiz
              </button>
            </div>
          </div>
        )}

        {/* 3. ESCAPED (SIGNAL LOST) POPUP OVERLAY */}
        {gameState === "playing" && telemetry.status === "escaped" && showPopup && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 animate-backdropFade">
            <div className="holo-panel border-gold/30 max-w-sm w-full bg-space-black/95 p-8 text-center shadow-[0_0_50px_rgba(245,197,66,0.25)] relative overflow-hidden animate-scaleUpFade">
              {/* Gold neon top strip */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
              
              <span className="text-4xl text-gold animate-pulse inline-block">📡</span>
              <h4 className="mt-4 font-display text-lg font-bold uppercase tracking-wider text-gold">
                Escape Trajectory
              </h4>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-star/40">
                Signal Lost // Hyperbolic Orbit
              </p>
              
              <div className="my-5 rounded border border-white/5 bg-white/[0.02] py-3 font-mono text-[11px] text-star/60">
                <p>Escape Speed: <span className="text-gold font-bold">{telemetry.speed.toFixed(2)} km/s</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={resetToStandby}
                  className="rounded-lg bg-gold/15 border border-gold/40 text-gold px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold transition-all hover:bg-gold/25 hover:border-gold hover:text-white"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setGameState("menu");
                    resetToStandby();
                  }}
                  className="rounded-lg bg-white/5 border border-white/10 text-star/60 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold transition-all hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={() => document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-3 w-full rounded-lg border border-electric/30 bg-electric/5 text-electric px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold transition-all hover:bg-electric/15 hover:text-white"
              >
                📝 Go to Quiz
              </button>
            </div>
          </div>
        )}

        {/* Dynamic HUD Offscreen Satellite Tracker */}
        <div
          ref={trackerRef}
          className="absolute z-15 hidden flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
        >
          {/* Glowing Pointer Arrow */}
          <div
            ref={trackerArrowRef}
            className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-electric drop-shadow-[0_0_8px_rgba(76,201,240,0.8)]"
          />
          {/* Readout bubble */}
          <div
            ref={trackerTextRef}
            className="mt-1 bg-space-black/90 border border-electric/40 px-2.5 py-1.5 rounded-md text-center font-mono leading-tight shadow-[0_0_15px_rgba(76,201,240,0.15)] min-w-[75px]"
          />
        </div>
      </div>

      <div className={`holo-panel flex flex-col gap-6 p-6 transition-all duration-300 ${gameState === "menu" ? "opacity-35 pointer-events-none filter blur-[1px]" : ""}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-electric/70">
          Flight Controls
        </p>

        <div>
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-star/50">
            <span>Initial Altitude</span>
            <span className="text-electric">{altitude.toFixed(1)}</span>
          </div>
          <input
            type="range" min={0} max={4} step={0.1} value={altitude}
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
            type="range" min={0} max={4.5} step={0.1} value={velocity}
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

"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * Satellite Anatomy Explorer — the interactive 3D model used by `3d-model`
 * lessons. Click a subsystem in the scene (or the list, which also works
 * when WebGL animation is paused) to inspect it. When production GLTF
 * models arrive, swap the primitive meshes and keep the part registry.
 */

type PartKey = "bus" | "solar" | "dish" | "battery" | "tracker" | "thruster";

const PARTS: Record<PartKey, { name: string; role: string; fact: string; icon: string }> = {
  bus: {
    name: "Satellite Bus",
    role: "The structural body that holds every subsystem together and shields them from radiation and temperature swings.",
    fact: "Most buses are built from aluminium honeycomb — strong like a bridge, light like a bicycle.",
    icon: "🧱",
  },
  solar: {
    name: "Solar Arrays",
    role: "Convert sunlight into electricity — the satellite's only power plant for its whole life in orbit.",
    fact: "The ISS arrays would cover most of a football field and still only power about 40 homes.",
    icon: "🔆",
  },
  dish: {
    name: "High-Gain Antenna",
    role: "Beams data down to ground stations and receives commands from mission control.",
    fact: "Deep-space antennas whisper with less power than a refrigerator light bulb — across millions of km.",
    icon: "📡",
  },
  battery: {
    name: "Battery Pack",
    role: "Stores solar energy so the satellite survives eclipse — the part of every orbit spent in Earth's shadow.",
    fact: "A LEO satellite goes through ~16 sunrise/sunset cycles every single day.",
    icon: "🔋",
  },
  tracker: {
    name: "Star Tracker",
    role: "A camera that photographs star patterns to work out exactly which way the satellite is pointing.",
    fact: "It navigates the same way ancient sailors did — by reading the stars.",
    icon: "🌟",
  },
  thruster: {
    name: "Thruster",
    role: "Small rocket engine used to correct the orbit, dodge debris, and de-orbit at end of life.",
    fact: "Ion thrusters push with the force of a sheet of paper resting on your hand — but for years.",
    icon: "🔥",
  },
};

const PART_KEYS = Object.keys(PARTS) as PartKey[];

function SatelliteModel({
  selected,
  onSelect,
}: {
  selected: PartKey;
  onSelect: (k: PartKey) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<PartKey | null>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.25;
  });

  const emissive = (k: PartKey, base: string) =>
    selected === k ? "#22d3ee" : hovered === k ? "#4cc9f0" : base;
  const intensity = (k: PartKey, base = 0.15) =>
    selected === k ? 0.9 : hovered === k ? 0.5 : base;

  const handlers = (k: PartKey) => ({
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onSelect(k);
    },
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(k);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      setHovered(null);
      document.body.style.cursor = "auto";
    },
  });

  return (
    <group ref={group} rotation={[0.25, 0, 0]}>
      {/* Bus */}
      <mesh {...handlers("bus")}>
        <boxGeometry args={[0.9, 0.9, 1.2]} />
        <meshStandardMaterial
          color="#c8d0e0" metalness={0.7} roughness={0.35}
          emissive={emissive("bus", "#000000")} emissiveIntensity={intensity("bus", 0)}
        />
      </mesh>

      {/* Solar arrays */}
      {[1, -1].map((s) => (
        <group key={s} position={[s * 1.55, 0, 0]}>
          <mesh {...handlers("solar")}>
            <boxGeometry args={[1.9, 0.05, 0.95]} />
            <meshStandardMaterial
              color="#1a3a8f" metalness={0.6} roughness={0.25}
              emissive={emissive("solar", "#0a1f5c")} emissiveIntensity={intensity("solar", 0.35)}
            />
          </mesh>
          <mesh position={[s * -1.05, 0, 0]} {...handlers("solar")}>
            <boxGeometry args={[0.25, 0.07, 0.1]} />
            <meshStandardMaterial color="#2a3350" metalness={0.7} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Dish antenna */}
      <group position={[0, 0.75, 0.25]} rotation={[-0.6, 0, 0]}>
        <mesh {...handlers("dish")}>
          <coneGeometry args={[0.42, 0.25, 24, 1, true]} />
          <meshStandardMaterial
            color="#dfe5f0" metalness={0.5} roughness={0.35} side={THREE.DoubleSide}
            emissive={emissive("dish", "#000000")} emissiveIntensity={intensity("dish", 0)}
          />
        </mesh>
        <mesh position={[0, -0.22, 0]} {...handlers("dish")}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
          <meshStandardMaterial color="#8b93a8" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>

      {/* Battery pack */}
      <mesh position={[0, -0.35, 0.68]} {...handlers("battery")}>
        <boxGeometry args={[0.5, 0.28, 0.18]} />
        <meshStandardMaterial
          color="#f5c542" metalness={0.4} roughness={0.5}
          emissive={emissive("battery", "#5c4408")} emissiveIntensity={intensity("battery", 0.25)}
        />
      </mesh>

      {/* Star tracker */}
      <mesh position={[0.35, 0.55, -0.35]} rotation={[0.5, 0, -0.4]} {...handlers("tracker")}>
        <cylinderGeometry args={[0.09, 0.12, 0.3, 12]} />
        <meshStandardMaterial
          color="#12203f" metalness={0.6} roughness={0.3}
          emissive={emissive("tracker", "#0a1430")} emissiveIntensity={intensity("tracker", 0.3)}
        />
      </mesh>

      {/* Thruster */}
      <mesh position={[0, 0, -0.75]} rotation={[Math.PI / 2, 0, 0]} {...handlers("thruster")}>
        <coneGeometry args={[0.18, 0.3, 16, 1, true]} />
        <meshStandardMaterial
          color="#8b93a8" metalness={0.8} roughness={0.3} side={THREE.DoubleSide}
          emissive={emissive("thruster", "#000000")} emissiveIntensity={intensity("thruster", 0)}
        />
      </mesh>
    </group>
  );
}

export default function SatelliteExplorer() {
  const [selected, setSelected] = useState<PartKey>("bus");
  const part = PARTS[selected];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="holo-panel relative h-[380px] overflow-hidden sm:h-[440px]">
        <Canvas camera={{ position: [0, 1.2, 4.4], fov: 42 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[4, 5, 3]} intensity={2} />
          <pointLight position={[-4, -2, 2]} intensity={6} color="#4cc9f0" distance={12} />
          <Stars radius={40} depth={20} count={1200} factor={2.5} fade speed={0.3} />
          <SatelliteModel selected={selected} onSelect={setSelected} />
        </Canvas>
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-star/40">
          Click a component to inspect it
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="holo-panel holo-border flex-1 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
            Subsystem Readout
          </p>
          <h3 className="mt-2 font-display text-base font-bold uppercase tracking-wider text-star">
            {part.icon} {part.name}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-star/65">{part.role}</p>
          <p className="mt-4 rounded-lg border border-gold/20 bg-gold/5 p-3 text-xs leading-relaxed text-star/55">
            💡 {part.fact}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Satellite subsystems">
          {PART_KEYS.map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={selected === k}
              onClick={() => setSelected(k)}
              className={`rounded-lg border px-2 py-2 text-center transition-all ${
                selected === k
                  ? "border-electric bg-electric/15 shadow-holo"
                  : "border-white/10 bg-white/[0.02] hover:border-electric/40"
              }`}
            >
              <span className="text-base">{PARTS[k].icon}</span>
              <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-wider text-star/60">
                {PARTS[k].name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";

/** Lightweight multi-layer CSS star field with parallax drift.
 *  Deterministic PRNG keeps SSR/client markup identical. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function layerShadow(count: number, seed: number, color: string) {
  const rand = mulberry32(seed);
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    shadows.push(`${(rand() * 100).toFixed(2)}vw ${(rand() * 200).toFixed(2)}vh 0 ${color}`);
  }
  return shadows.join(",");
}

export default function StarBackground({ className = "" }: { className?: string }) {
  const layers = useMemo(
    () => [
      { size: 1, shadow: layerShadow(120, 7, "rgba(236,231,223,0.55)"), speed: "0.1" },
      { size: 1.5, shadow: layerShadow(55, 42, "rgba(236,231,223,0.35)"), speed: "0.18" },
      { size: 2, shadow: layerShadow(20, 99, "rgba(224,168,96,0.45)"), speed: "0.28" },
    ],
    []
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {layers.map((l, i) => (
        <div key={i} data-parallax={l.speed} className="absolute inset-0">
          <div
            style={{
              width: l.size,
              height: l.size,
              borderRadius: "50%",
              boxShadow: l.shadow,
            }}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-nebula-radial" />
    </div>
  );
}

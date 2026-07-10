"use client";

import { useMemo, useState } from "react";

/**
 * Find the Constellation — connect the stars in the correct sequence to draw
 * a real constellation. Clicking stars in order traces the figure; a wrong
 * pick resets the current trace.
 */

interface Puzzle {
  name: string;
  hint: string;
  // normalized 0..1 coordinates; order defines the correct connection path
  stars: { x: number; y: number }[];
}

const PUZZLES: Puzzle[] = [
  {
    name: "Ursa Major — The Plough",
    hint: "Seven bright stars forming a saucepan",
    stars: [
      { x: 0.12, y: 0.62 }, { x: 0.28, y: 0.55 }, { x: 0.44, y: 0.6 },
      { x: 0.58, y: 0.52 }, { x: 0.66, y: 0.34 }, { x: 0.82, y: 0.3 }, { x: 0.78, y: 0.5 },
    ],
  },
  {
    name: "Orion — The Hunter",
    hint: "Belt of three, shoulders and feet",
    stars: [
      { x: 0.3, y: 0.2 }, { x: 0.62, y: 0.24 }, { x: 0.44, y: 0.46 },
      { x: 0.4, y: 0.5 }, { x: 0.5, y: 0.52 }, { x: 0.28, y: 0.8 }, { x: 0.66, y: 0.78 },
    ],
  },
  {
    name: "Cassiopeia — The Queen",
    hint: "A distinctive W across the sky",
    stars: [
      { x: 0.14, y: 0.4 }, { x: 0.32, y: 0.62 }, { x: 0.5, y: 0.38 },
      { x: 0.68, y: 0.64 }, { x: 0.86, y: 0.42 },
    ],
  },
];

const W = 460;
const H = 360;

export default function ConstellationGame({ onExit }: { onExit: () => void }) {
  const [level, setLevel] = useState(0);
  const [progress, setProgress] = useState(1); // stars correctly connected (first is free start)
  const [flash, setFlash] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);

  const puzzle = PUZZLES[level];
  const pts = useMemo(
    () => puzzle.stars.map((s) => ({ x: s.x * W, y: s.y * H })),
    [puzzle]
  );

  function clickStar(i: number) {
    if (complete) return;
    if (i === progress) {
      const np = progress + 1;
      setProgress(np);
      setFlash(null);
      if (np === puzzle.stars.length) {
        if (level + 1 >= PUZZLES.length) setComplete(true);
        else setTimeout(() => { setLevel(level + 1); setProgress(1); }, 900);
      }
    } else if (i !== progress - 1) {
      setFlash(i);
      setProgress(1); // reset trace
      setTimeout(() => setFlash(null), 500);
    }
  }

  if (complete) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl">✨</p>
        <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-wide text-gold text-glow-gold">
          Sky Charted — Navigator Badge
        </h3>
        <p className="mt-2 text-sm text-star/50">
          You traced all {PUZZLES.length} constellations. Sailors navigated oceans with exactly
          this skill.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => { setLevel(0); setProgress(1); setComplete(false); }} className="btn-secondary">
            Play Again
          </button>
          <button onClick={onExit} className="btn-ghost">Game Deck</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wider text-star">{puzzle.name}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-star/40">{puzzle.hint}</p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-electric">
          {level + 1} / {PUZZLES.length}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#05060f]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Connect the stars of ${puzzle.name}`}>
          {/* faint scatter stars */}
          {Array.from({ length: 40 }).map((_, i) => (
            <circle key={i} cx={(i * 71) % W} cy={(i * 47) % H} r={(i % 3) * 0.4 + 0.4} fill="rgba(232,240,255,0.25)" />
          ))}
          {/* connection lines already traced */}
          {pts.slice(0, progress).map((p, i) => {
            if (i === 0) return null;
            const prev = pts[i - 1];
            return (
              <line key={i} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} stroke="#4cc9f0" strokeWidth={2} opacity={0.8} />
            );
          })}
          {/* stars */}
          {pts.map((p, i) => {
            const connected = i < progress;
            const isNext = i === progress;
            return (
              <g key={i} onClick={() => clickStar(i)} style={{ cursor: "pointer" }}>
                {isNext && <circle cx={p.x} cy={p.y} r={12} fill="none" stroke="#4cc9f0" strokeWidth={1} opacity={0.5}>
                  <animate attributeName="r" values="8;14;8" dur="1.4s" repeatCount="indefinite" />
                </circle>}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={connected ? 6 : 5}
                  fill={flash === i ? "#f87171" : connected ? "#4cc9f0" : isNext ? "#e8f0ff" : "#8fa8c8"}
                  style={{ filter: connected || isNext ? "drop-shadow(0 0 6px #4cc9f0)" : "none" }}
                />
                <text x={p.x} y={p.y - 12} textAnchor="middle" fill="#4cc9f0" fontSize={10} fontFamily="monospace">
                  {i === 0 ? "start" : connected ? "" : i === progress ? i + 1 : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-star/40">
        Tap the glowing star to continue the line
      </p>
    </div>
  );
}

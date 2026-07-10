"use client";

import { useMemo, useState } from "react";

/**
 * Assemble a Rocket — place components bottom-to-top in the correct order.
 * Teaches real launch-vehicle stacking: engines → boosters → stages →
 * payload → fairing. Click a part in the bay to add it to the next slot.
 */

interface Part {
  id: string;
  label: string;
  icon: string;
  hint: string;
}

// Correct assembly order, bottom (index 0) to top
const ORDER: Part[] = [
  { id: "engine", label: "Main Engines", icon: "🔥", hint: "Thrust starts at the base" },
  { id: "stage1", label: "First Stage", icon: "🛢", hint: "The big fuel tank" },
  { id: "interstage", label: "Interstage", icon: "⚙", hint: "Connects the stages" },
  { id: "stage2", label: "Second Stage", icon: "🛰", hint: "Upper-stage engine + fuel" },
  { id: "payload", label: "Payload", icon: "📦", hint: "The satellite or capsule" },
  { id: "fairing", label: "Nose Fairing", icon: "🔺", hint: "Aerodynamic tip on top" },
];

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export default function RocketAssembly({ onExit }: { onExit: () => void }) {
  const [stack, setStack] = useState<Part[]>([]); // index 0 = bottom
  const [wrong, setWrong] = useState<string | null>(null);
  const bay = useMemo(() => shuffle(ORDER), []);
  const placedIds = new Set(stack.map((p) => p.id));
  const done = stack.length === ORDER.length;

  function place(part: Part) {
    if (placedIds.has(part.id) || done) return;
    const nextExpected = ORDER[stack.length];
    if (part.id === nextExpected.id) {
      setStack((s) => [...s, part]);
      setWrong(null);
    } else {
      setWrong(part.id);
      setTimeout(() => setWrong(null), 600);
    }
  }

  function reset() {
    setStack([]);
    setWrong(null);
  }

  return (
    <div className="p-6 sm:p-8">
      {done ? (
        <div className="text-center">
          <p className="text-4xl">🚀</p>
          <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-wide text-emerald-300">
            Vehicle Stacked — Cleared for Launch
          </h3>
          <p className="mt-2 text-sm text-star/50">
            Perfect stacking order. That&apos;s exactly how real rockets are integrated in the
            vehicle assembly building.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={reset} className="btn-secondary">Build Again</button>
            <button onClick={onExit} className="btn-ghost">Game Deck</button>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Assembly tower */}
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
              Assembly Tower · bottom → top
            </p>
            <div className="flex min-h-[280px] flex-col-reverse items-center justify-start gap-1 rounded-xl border border-white/10 bg-space-panel/40 p-4">
              {ORDER.map((slot, i) => {
                const placed = stack[i];
                return (
                  <div
                    key={i}
                    className={`flex w-full max-w-[200px] items-center justify-center rounded-lg border py-2.5 text-sm transition-all ${
                      placed
                        ? "border-electric/50 bg-electric/10 text-star shadow-holo"
                        : i === stack.length
                        ? "border-dashed border-electric/40 text-electric/60"
                        : "border-white/5 text-star/20"
                    }`}
                    style={{ width: `${60 + i * 6}%` }}
                  >
                    {placed ? (
                      <span>{placed.icon} {placed.label}</span>
                    ) : i === stack.length ? (
                      <span className="font-mono text-[10px] uppercase tracking-widest">▲ next slot</span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-widest">slot {i + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parts bay */}
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
              Parts Bay · tap to install next
            </p>
            <div className="grid gap-2.5">
              {bay.map((part) => {
                const used = placedIds.has(part.id);
                return (
                  <button
                    key={part.id}
                    onClick={() => place(part)}
                    disabled={used}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      used
                        ? "border-white/5 text-star/25 line-through"
                        : wrong === part.id
                        ? "border-red-400/60 bg-red-400/10 text-red-300"
                        : "border-white/10 bg-white/[0.02] text-star/80 hover:border-electric/50 hover:bg-electric/5"
                    }`}
                  >
                    <span className="text-lg">{part.icon}</span>
                    <span className="flex-1">
                      {part.label}
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-star/35">
                        {part.hint}
                      </span>
                    </span>
                    {used && <span className="text-emerald-400">✓</span>}
                  </button>
                );
              })}
            </div>
            {wrong && (
              <p className="mt-3 text-xs text-red-300">
                ⚠ Not yet — build from the bottom up. Next: {ORDER[stack.length].label}.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

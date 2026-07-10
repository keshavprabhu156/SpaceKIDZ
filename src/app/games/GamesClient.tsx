"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { games, type Game } from "@/data/games";
import QuizGame from "@/components/games/QuizGame";
import MemoryGame from "@/components/games/MemoryGame";
import MoonLander from "@/components/games/MoonLander";
import RocketAssembly from "@/components/games/RocketAssembly";
import ConstellationGame from "@/components/games/ConstellationGame";

const OrbitSimulator = dynamic(() => import("@/components/demo/OrbitSimulator"), { ssr: false });

const categories = [
  { id: "all", label: "All Missions" },
  { id: "build", label: "Build" },
  { id: "pilot", label: "Pilot" },
  { id: "explore", label: "Explore" },
  { id: "puzzle", label: "Puzzle" },
] as const;

export default function GamesClient() {
  const [cat, setCat] = useState<(typeof categories)[number]["id"]>("all");
  const [active, setActive] = useState<Game | null>(null);

  const filtered = cat === "all" ? games : games.filter((g) => g.category === cat);

  return (
    <>
      {/* Filters */}
      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-all ${
              cat === c.id
                ? "border-electric bg-electric/15 text-electric shadow-holo"
                : "border-white/10 text-star/50 hover:border-electric/40 hover:text-star"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((g) => (
          <div
            key={g.id}
            className={`holo-panel group relative flex flex-col p-6 transition-all duration-500 ${
              g.playable ? "hover:-translate-y-1.5 hover:shadow-holo-strong" : "opacity-80"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{g.icon}</span>
              <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-gold">
                +{g.xp} XP
              </span>
            </div>
            <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-wider text-star">{g.title}</h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-star/50">{g.description}</p>
            <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-star/40">
              <span>Grade {g.minGrade}+</span>
              <span className="text-electric" title={`Difficulty ${g.difficulty}/3`}>{"▸".repeat(g.difficulty)}</span>
            </div>
            {g.playable ? (
              <button onClick={() => setActive(g)} className="btn-primary mt-5 w-full !py-2.5">
                Launch
              </button>
            ) : (
              <div className="mt-5 w-full rounded-xl border border-white/10 py-2.5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-star/35">
                🔒 Unlocks in Student Portal
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Game modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-space-black/85 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="holo-panel holo-border max-h-[90vh] w-full max-w-3xl overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-star">
                  {active.icon} {active.title}
                </p>
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close game"
                  className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-star/50 hover:border-red-400/40 hover:text-red-300"
                >
                  ✕ Abort
                </button>
              </div>
              {active.id === "space-quiz" && <QuizGame onExit={() => setActive(null)} />}
              {active.id === "space-memory" && <MemoryGame onExit={() => setActive(null)} />}
              {active.id === "moon-landing" && <MoonLander onExit={() => setActive(null)} />}
              {active.id === "assemble-rocket" && <RocketAssembly onExit={() => setActive(null)} />}
              {active.id === "find-constellation" && <ConstellationGame onExit={() => setActive(null)} />}
              {active.id === "orbit-simulator" && (
                <div className="p-6">
                  <OrbitSimulator />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

const ICONS = ["🚀", "🛰", "🪐", "🌙", "☄", "👨‍🚀", "🔭", "⭐"];

interface Card {
  id: number;
  icon: string;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryGame({ onExit }: { onExit: () => void }) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  const reset = useMemo(
    () => () => {
      setDeck(shuffle([...ICONS, ...ICONS].map((icon, id) => ({ id, icon, matched: false }))));
      setFlipped([]);
      setMoves(0);
      setLock(false);
    },
    []
  );

  useEffect(() => reset(), [reset]);

  const won = deck.length > 0 && deck.every((c) => c.matched);

  function flip(idx: number) {
    if (lock || flipped.includes(idx) || deck[idx].matched) return;
    const nf = [...flipped, idx];
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = nf;
      if (deck[a].icon === deck[b].icon) {
        setTimeout(() => {
          setDeck((d) => d.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
          setFlipped([]);
          setLock(false);
        }, 450);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 850);
      }
    }
  }

  if (won) {
    const stars = moves <= 12 ? 3 : moves <= 18 ? 2 : 1;
    return (
      <div className="p-8 text-center">
        <p className="text-4xl tracking-widest text-gold">{"★".repeat(stars)}{"☆".repeat(3 - stars)}</p>
        <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-wide text-star">
          Cargo Bay Sorted!
        </h3>
        <p className="mt-2 text-sm text-star/50">Completed in {moves} moves.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={reset} className="btn-secondary">Play Again</button>
          <button onClick={onExit} className="btn-ghost">Game Deck</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-star/40">
        <span>Match all pairs</span>
        <span className="text-electric">Moves: {moves}</span>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2.5">
        {deck.map((card, idx) => {
          const show = flipped.includes(idx) || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => flip(idx)}
              aria-label={show ? card.icon : "Hidden card"}
              className={`flex aspect-square items-center justify-center rounded-xl border text-2xl transition-all duration-300 sm:text-3xl ${
                card.matched
                  ? "border-emerald-400/40 bg-emerald-400/10"
                  : show
                  ? "border-electric bg-electric/10 shadow-holo"
                  : "border-white/10 bg-space-panel hover:border-electric/40"
              }`}
            >
              <span className={show ? "" : "opacity-0"}>{card.icon}</span>
              {!show && <span className="absolute text-electric/30">◈</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

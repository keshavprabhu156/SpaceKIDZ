"use client";

import { useEffect, useState } from "react";

const QUESTIONS = [
  { q: "Which planet has the largest volcano in the solar system?", o: ["Earth", "Mars", "Venus", "Jupiter"], a: 1 },
  { q: "What force keeps satellites in orbit?", o: ["Magnetism", "Gravity", "Air pressure", "Solar wind"], a: 1 },
  { q: "The first human in space was…", o: ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "Kalpana Chawla"], a: 1 },
  { q: "A CubeSat unit (1U) measures…", o: ["1 m³", "10×10×10 cm", "50×50×50 cm", "1×1×1 inch"], a: 1 },
  { q: "Which layer protects Earth from meteoroids and UV?", o: ["Atmosphere", "Magnetosphere", "Both", "Neither"], a: 2 },
  { q: "The ISS orbits Earth roughly every…", o: ["90 minutes", "24 hours", "7 days", "1 hour"], a: 0 },
  { q: "Rockets work because of…", o: ["Pushing on air", "Newton's third law", "Helium lift", "Magnetic repulsion"], a: 1 },
  { q: "Which planet spins on its side?", o: ["Neptune", "Saturn", "Uranus", "Mercury"], a: 2 },
];

const TIME = 15;

export default function QuizGame({ onExit }: { onExit: () => void }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(TIME);
  const [picked, setPicked] = useState<number | null>(null);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (over || picked !== null) return;
    if (time <= 0) {
      setPicked(-1);
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, picked, over]);

  function pick(oi: number) {
    if (picked !== null) return;
    setPicked(oi);
    if (oi === QUESTIONS[i].a) setScore((s) => s + 100 + time * 10);
  }

  function next() {
    if (i + 1 >= QUESTIONS.length) {
      setOver(true);
      return;
    }
    setI(i + 1);
    setPicked(null);
    setTime(TIME);
  }

  if (over) {
    return (
      <div className="p-8 text-center">
        <p className="text-5xl">🏆</p>
        <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-wide text-star">Mission Complete</h3>
        <p className="mt-2 font-display text-4xl font-black text-gold text-glow-gold">{score}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-star/40">
          Points · +{Math.round(score / 10)} XP awarded in the full portal
        </p>
        <button onClick={onExit} className="btn-secondary mt-8">Return to Game Deck</button>
      </div>
    );
  }

  const q = QUESTIONS[i];
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-star/40">
        <span>Q {i + 1}/{QUESTIONS.length}</span>
        <span className="text-gold">◆ {score}</span>
        <span className={time <= 5 ? "animate-pulse text-red-400" : "text-electric"}>⏱ {time}s</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-electric transition-all duration-1000" style={{ width: `${(time / TIME) * 100}%` }} />
      </div>
      <h3 className="mt-6 text-lg font-medium text-star">{q.q}</h3>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {q.o.map((o, oi) => (
          <button
            key={o}
            onClick={() => pick(oi)}
            className={`rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${
              picked === null
                ? "border-white/10 bg-white/[0.02] text-star/80 hover:border-electric/50"
                : oi === q.a
                ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-300"
                : picked === oi
                ? "border-red-400/60 bg-red-400/10 text-red-300"
                : "border-white/5 text-star/30"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="mt-6 text-right">
          <button onClick={next} className="btn-primary">
            {i + 1 >= QUESTIONS.length ? "Finish →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}

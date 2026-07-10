"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Moon Landing Challenge — manage fuel and descent rate to touch down softly.
 * Controls: hold Space / ↑ (or the on-screen THRUST button) to burn.
 */

const W = 640;
const H = 420;
const GRAVITY = 22; // px/s²
const THRUST = 52;
const SAFE_SPEED = 42; // px/s
const START_FUEL = 100;

type Phase = "ready" | "flying" | "landed" | "crashed";

interface Ship {
  y: number;
  vy: number;
  fuel: number;
}

export default function MoonLander({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ship = useRef<Ship>({ y: 40, vy: 0, fuel: START_FUEL });
  const burning = useRef(false);
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhase] = useState<Phase>("ready");
  const [touchdownSpeed, setTouchdownSpeed] = useState(0);

  function reset() {
    ship.current = { y: 40, vy: 0, fuel: START_FUEL };
    phaseRef.current = "flying";
    setPhase("flying");
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();

    // deterministic star backdrop
    const stars = Array.from({ length: 70 }, (_, i) => ({
      x: (i * 97) % W,
      y: (i * 53) % (H - 90),
      r: (i % 3) * 0.5 + 0.5,
    }));

    const groundY = H - 46;

    function setPhaseBoth(p: Phase) {
      phaseRef.current = p;
      setPhase(p);
    }

    function step(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = ship.current;

      if (phaseRef.current === "flying") {
        const thrusting = burning.current && s.fuel > 0;
        if (thrusting) s.fuel = Math.max(0, s.fuel - 22 * dt);
        s.vy += (GRAVITY - (thrusting ? THRUST : 0)) * dt;
        s.y += s.vy * dt;
        if (s.y <= 10) {
          s.y = 10;
          s.vy = Math.max(0, s.vy);
        }
        if (s.y >= groundY - 26) {
          s.y = groundY - 26;
          setTouchdownSpeed(Math.abs(s.vy));
          setPhaseBoth(Math.abs(s.vy) <= SAFE_SPEED ? "landed" : "crashed");
        }
      }

      // ---------- draw ----------
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#05060f";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(232,240,255,0.8)";
      stars.forEach((st) => {
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // moon surface
      ctx.fillStyle = "#2a3350";
      ctx.beginPath();
      ctx.moveTo(0, groundY + 8);
      for (let x = 0; x <= W; x += 40) {
        ctx.lineTo(x, groundY + 8 + Math.sin(x * 0.05) * 4);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.fill();
      // landing pad
      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(W / 2 - 46, groundY + 4, 92, 4);

      const s2 = ship.current;
      const x = W / 2;
      const crashed = phaseRef.current === "crashed";

      // flame
      if (burning.current && s2.fuel > 0 && phaseRef.current === "flying") {
        ctx.fillStyle = "#4cc9f0";
        ctx.beginPath();
        ctx.moveTo(x - 7, s2.y + 24);
        ctx.lineTo(x + 7, s2.y + 24);
        ctx.lineTo(x, s2.y + 24 + 14 + Math.random() * 8);
        ctx.fill();
      }

      // lander
      ctx.save();
      ctx.translate(x, s2.y);
      if (crashed) ctx.rotate(0.35);
      ctx.fillStyle = "#dfe5f0";
      ctx.beginPath(); // capsule
      ctx.moveTo(0, -18);
      ctx.lineTo(12, 2);
      ctx.lineTo(-12, 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#12203f"; // body
      ctx.fillRect(-13, 2, 26, 12);
      ctx.strokeStyle = "#8b93a8"; // legs
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-10, 14); ctx.lineTo(-17, 24);
      ctx.moveTo(10, 14); ctx.lineTo(17, 24);
      ctx.stroke();
      ctx.fillStyle = "#22d3ee"; // window
      ctx.beginPath();
      ctx.arc(0, -4, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // HUD
      ctx.font = "12px monospace";
      ctx.fillStyle = "#4cc9f0";
      ctx.fillText(`ALT  ${Math.max(0, Math.round(groundY - 26 - s2.y))} m`, 16, 24);
      const fast = Math.abs(s2.vy) > SAFE_SPEED;
      ctx.fillStyle = fast ? "#f87171" : "#34d399";
      ctx.fillText(`VEL  ${Math.round(s2.vy)} m/s  (safe ≤ ${SAFE_SPEED})`, 16, 42);
      ctx.fillStyle = s2.fuel < 25 ? "#f5c542" : "#4cc9f0";
      ctx.fillText(`FUEL ${Math.round(s2.fuel)}%`, 16, 60);
      ctx.fillStyle = "rgba(76,201,240,0.35)";
      ctx.fillRect(16, 68, 100, 5);
      ctx.fillStyle = "#4cc9f0";
      ctx.fillRect(16, 68, s2.fuel, 5);

      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        burning.current = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") burning.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return (
    <div className="p-6 sm:p-8">
      <div className="relative overflow-hidden rounded-xl border border-white/10">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />

        {phase !== "flying" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-space-black/70 backdrop-blur-sm">
            {phase === "ready" && (
              <>
                <p className="font-display text-lg font-bold uppercase tracking-wider text-star">
                  Moon Landing Challenge
                </p>
                <p className="mt-2 max-w-sm text-center text-xs text-star/60">
                  Gravity pulls you down. Hold <span className="text-electric">SPACE</span> /{" "}
                  <span className="text-electric">↑</span> (or the THRUST button) to burn fuel and
                  slow your descent. Touch down below {SAFE_SPEED} m/s.
                </p>
                <button onClick={reset} className="btn-primary mt-6">🌙 Begin Descent</button>
              </>
            )}
            {phase === "landed" && (
              <>
                <p className="text-4xl">🏅</p>
                <p className="mt-3 font-display text-lg font-bold uppercase tracking-wider text-emerald-300">
                  The Eagle Has Landed
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-star/50">
                  Touchdown at {Math.round(touchdownSpeed)} m/s · fuel remaining {Math.round(ship.current.fuel)}%
                </p>
                <div className="mt-6 flex gap-3">
                  <button onClick={reset} className="btn-secondary">Fly Again</button>
                  <button onClick={onExit} className="btn-ghost">Game Deck</button>
                </div>
              </>
            )}
            {phase === "crashed" && (
              <>
                <p className="text-4xl">💥</p>
                <p className="mt-3 font-display text-lg font-bold uppercase tracking-wider text-red-400">
                  Hard Impact — {Math.round(touchdownSpeed)} m/s
                </p>
                <p className="mt-1 max-w-xs text-center text-xs text-star/50">
                  Burn earlier and in short pulses. Watch the velocity readout turn green before
                  touchdown.
                </p>
                <div className="mt-6 flex gap-3">
                  <button onClick={reset} className="btn-secondary">Retry Descent</button>
                  <button onClick={onExit} className="btn-ghost">Game Deck</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* touch control */}
      <div className="mt-4 flex justify-center">
        <button
          onPointerDown={() => (burning.current = true)}
          onPointerUp={() => (burning.current = false)}
          onPointerLeave={() => (burning.current = false)}
          className="btn-primary select-none !px-12"
          disabled={phase !== "flying"}
        >
          🔥 THRUST
        </button>
      </div>
    </div>
  );
}

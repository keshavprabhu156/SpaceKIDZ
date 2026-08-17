"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ---------------- Visual mocks for each step ---------------- */

/** Reading mock — a page of book material, the primary lesson format. */
function ReadMock() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-star/10 bg-space-navy/80">
      <div className="border-b border-star/10 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric/70">
          Space Science · Grade 6
        </p>
        <p className="mt-1 font-display text-base font-semibold text-star">
          Chapter 4 — Types of Orbits
        </p>
      </div>

      <div className="space-y-3 px-6 py-5">
        <p className="max-w-prose text-[13px] leading-[1.75] text-star/75">
          A satellite does not hover above the Earth. It is falling — continuously —
          but moving sideways so fast that the ground curves away beneath it just as
          quickly as it drops.
        </p>
        {/* Simulated remaining copy */}
        {["100%", "96%", "88%", "72%"].map((w, i) => (
          <div key={i} className="h-2 rounded bg-star/[0.09]" style={{ width: w }} />
        ))}

        <div className="!mt-5 rounded-lg border-l-2 border-electric/60 bg-electric/[0.06] px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-electric">
            Key idea
          </p>
          <p className="mt-1 text-xs leading-relaxed text-star/70">
            Orbit is free fall with enough sideways speed.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-star/10 px-6 py-3.5">
        <span className="font-mono text-[10px] text-star/40">Page 3 of 8</span>
        <span className="text-xs text-electric">Next section →</span>
      </div>
    </div>
  );
}

function ModelMock() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-star/10 bg-space-navy/80 p-6">
      <svg viewBox="0 0 320 200" className="w-full" aria-hidden>
        {/* satellite body */}
        <rect x="132" y="72" width="56" height="56" rx="6" fill="#1b2440" stroke="#4f7df9" strokeWidth="1.5" />
        {/* solar arrays */}
        <rect x="40" y="84" width="80" height="32" rx="3" fill="#101a33" stroke="#6f8dfb" strokeWidth="1.2" />
        <rect x="200" y="84" width="80" height="32" rx="3" fill="#101a33" stroke="#6f8dfb" strokeWidth="1.2" />
        {[52, 68, 84, 100].map((x) => (
          <line key={x} x1={x} y1="84" x2={x} y2="116" stroke="#4f7df9" strokeWidth="0.6" opacity="0.5" />
        ))}
        {[212, 228, 244, 260].map((x) => (
          <line key={x} x1={x} y1="84" x2={x} y2="116" stroke="#4f7df9" strokeWidth="0.6" opacity="0.5" />
        ))}
        {/* dish */}
        <ellipse cx="160" cy="58" rx="18" ry="7" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
        <line x1="160" y1="65" x2="160" y2="72" stroke="#8b5cf6" strokeWidth="1.5" />
        {/* hotspots */}
        {[
          { x: 80, y: 100, label: "Solar array" },
          { x: 160, y: 58, label: "Antenna" },
          { x: 160, y: 100, label: "Bus" },
        ].map((h) => (
          <g key={h.label}>
            <circle cx={h.x} cy={h.y} r="9" fill="#4f7df9" opacity="0.18" />
            <circle cx={h.x} cy={h.y} r="3.5" fill="#4f7df9" />
          </g>
        ))}
      </svg>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Solar array", "Antenna", "Bus", "Thrusters", "Star tracker", "Battery"].map((l, i) => (
          <span
            key={l}
            className={`rounded-full px-3 py-1 text-xs ${
              i === 0
                ? "border border-electric/40 bg-electric/15 text-electric"
                : "border border-star/12 text-star/50"
            }`}
          >
            {l}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs text-star/45">
        Tap any part to read what it does and why engineers built it that way.
      </p>
    </div>
  );
}

function SimulateMock() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-star/10 bg-space-navy/80 p-6">
      <div className="relative flex h-52 items-center justify-center">
        <div className="absolute h-40 w-40 rounded-full border border-dashed border-star/15" />
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-galaxy-light to-galaxy shadow-[0_0_30px_rgba(79,125,249,0.35)]" />
        <div className="absolute h-2.5 w-2.5 animate-orbit-dot rounded-full bg-electric shadow-glow" />
      </div>
      <div className="mt-4 space-y-3">
        {[
          { label: "Altitude", value: "412 km", pct: 62 },
          { label: "Velocity", value: "7.66 km/s", pct: 78 },
        ].map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-xs">
              <span className="text-star/50">{s.label}</span>
              <span className="font-mono text-star/80">{s.value}</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-brand-grad" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300">
        ✓ Stable orbit achieved — nice flying.
      </p>
    </div>
  );
}

function TestMock() {
  const options = [
    { t: "Floating with no gravity", ok: false },
    { t: "Falling around the Earth", ok: true },
    { t: "Pushed up by its engines", ok: false },
  ];
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-star/10 bg-space-navy/80 p-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-star/15 px-2.5 py-1 font-mono text-[10px] text-star/50">
          Question 2 of 8
        </span>
        <span className="font-mono text-[10px] text-star/50">Weekly test</span>
      </div>
      <p className="mt-4 font-display text-lg font-semibold leading-snug text-star">
        A satellite in orbit is constantly…
      </p>
      <div className="mt-4 space-y-2.5">
        {options.map((o) => (
          <div
            key={o.t}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              o.ok
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                : "border-star/12 text-star/60"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                o.ok ? "border-emerald-400 bg-emerald-400 text-space-black" : "border-star/25"
              }`}
            >
              {o.ok ? "✓" : ""}
            </span>
            {o.t}
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-white/[0.04] px-3 py-2.5 text-xs leading-relaxed text-star/60">
        <span className="font-semibold text-electric">Why:</span> orbit is free fall with
        enough sideways speed that the ground keeps curving away beneath you.
      </p>
    </div>
  );
}

/* ---------------- Steps ---------------- */

const steps = [
  {
    n: "01",
    title: "Read the chapter",
    body: "Each chapter of the Space Science book is laid out for the screen — clear language, key ideas pulled out, and no wall of jargon.",
    Visual: ReadMock,
  },
  {
    n: "02",
    title: "Take it apart in 3D",
    body: "Rotate a satellite, open its subsystems, and see how each part keeps it alive in orbit. Curiosity beats memorising.",
    Visual: ModelMock,
  },
  {
    n: "03",
    title: "Fly the real physics",
    body: "Then take the controls. Our simulations run genuine orbital mechanics, so getting it right actually means something.",
    Visual: SimulateMock,
  },
  {
    n: "04",
    title: "Check what stuck",
    body: "A short weekly test marks itself instantly and explains every answer — so students learn from mistakes on the spot.",
    Visual: TestMock,
  },
];

export default function LearningShowcase() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!wrap.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        setActive((prev) => (prev === i ? prev : i));
      },
    });
    return () => st.kill();
  }, []);

  const Current = steps[active].Visual;

  return (
    <section id="how" className="relative bg-space-black">
      {/* Intro */}
      <div className="mx-auto max-w-6xl px-5 pb-4 pt-28 sm:px-8">
        <div data-reveal className="max-w-2xl">
          <span className="section-tag">How it works</span>
          <h2 className="h-section">
            One lesson,
            <br />
            <span className="text-grad">four ways to understand it.</span>
          </h2>
          <p className="lede mt-5">
            Every chapter moves a student from seeing, to handling, to doing, to proving
            they&apos;ve got it. That loop is the whole method.
          </p>
        </div>
      </div>

      {/* Sticky scroll sequence */}
      <div ref={wrap} className="relative h-[420vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
            {/* Left: stepped copy */}
            <div>
              <div className="flex gap-2.5">
                {steps.map((s, i) => (
                  <span
                    key={s.n}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      i <= active ? "bg-brand-grad" : "bg-white/12"
                    }`}
                  />
                ))}
              </div>

              <div className="relative mt-8 min-h-[220px]">
                {steps.map((s, i) => (
                  <div
                    key={s.n}
                    className={`transition-all duration-500 ${
                      i === active
                        ? "relative opacity-100 blur-0"
                        : "pointer-events-none absolute inset-0 translate-y-3 opacity-0 blur-[2px]"
                    }`}
                  >
                    <span className="font-mono text-sm text-electric">{s.n}</span>
                    <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-star sm:text-4xl">
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-star/60">
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual that swaps */}
            <div className="relative">
              <div
                key={active}
                className="animate-scaleUpFade"
                style={{ animationDuration: "0.5s" }}
              >
                <Current />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

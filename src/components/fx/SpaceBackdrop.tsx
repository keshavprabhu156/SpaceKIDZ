"use client";

import { useEffect, useRef } from "react";

/**
 * Premium deep-space backdrop — pure 2D canvas + CSS.
 *
 * Deliberately abstract rather than photoreal: it renders at the device's own
 * pixel density, so it is perfectly crisp on any display from 1080p to 5K, and
 * it costs essentially nothing to run. The starfield is painted ONCE (and on
 * resize) — there is no per-frame JavaScript at all, so scrolling stays at full
 * frame rate on low-end hardware anywhere in the world.
 */

/** Deterministic PRNG so the sky is identical on every render/reload. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAR_TINTS = [
  "255,255,255",
  "214,229,255", // pale blue
  "255,240,222", // warm white
  "198,214,255",
];

function paint(canvas: HTMLCanvasElement, resolutionScale = 1) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;

  // `resolutionScale` gives headroom for callers that scale the canvas up on
  // scroll — without it, a zoomed raster goes soft.
  const dpr = Math.min((window.devicePixelRatio || 1) * resolutionScale, 2.5);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const rand = mulberry32(20260731);
  const count = Math.min(900, Math.round((w * h) / 2200));

  /* ---- Distant dust: tiny, dim, dense ---- */
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 0.3 + rand() * 0.7;
    const a = 0.15 + rand() * 0.45;
    const tint = STAR_TINTS[Math.floor(rand() * STAR_TINTS.length)];
    ctx.fillStyle = `rgba(${tint},${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---- Mid-field stars: soft halo ---- */
  const midCount = Math.round(count / 9);
  for (let i = 0; i < midCount; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 0.9 + rand() * 1.1;
    const tint = STAR_TINTS[Math.floor(rand() * STAR_TINTS.length)];

    const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
    halo.addColorStop(0, `rgba(${tint},0.5)`);
    halo.addColorStop(1, `rgba(${tint},0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(${tint},0.95)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---- Hero stars: bright, with fine diffraction spikes ---- */
  const brightCount = Math.max(5, Math.round(count / 90));
  for (let i = 0; i < brightCount; i++) {
    const x = rand() * w;
    const y = rand() * h * 0.85;
    const r = 1.4 + rand() * 1.0;
    const spike = 9 + rand() * 16;
    const tint = STAR_TINTS[Math.floor(rand() * 2)];

    const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 11);
    halo.addColorStop(0, `rgba(${tint},0.55)`);
    halo.addColorStop(1, `rgba(${tint},0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * 11, 0, Math.PI * 2);
    ctx.fill();

    // Four-point flare — the detail that reads as "captured", not "drawn"
    const flare = ctx.createLinearGradient(x - spike, y, x + spike, y);
    flare.addColorStop(0, `rgba(${tint},0)`);
    flare.addColorStop(0.5, `rgba(${tint},0.5)`);
    flare.addColorStop(1, `rgba(${tint},0)`);
    ctx.fillStyle = flare;
    ctx.fillRect(x - spike, y - 0.4, spike * 2, 0.8);

    const flareV = ctx.createLinearGradient(x, y - spike, x, y + spike);
    flareV.addColorStop(0, `rgba(${tint},0)`);
    flareV.addColorStop(0.5, `rgba(${tint},0.5)`);
    flareV.addColorStop(1, `rgba(${tint},0)`);
    ctx.fillStyle = flareV;
    ctx.fillRect(x - 0.4, y - spike, 0.8, spike * 2);

    ctx.fillStyle = `rgba(255,255,255,1)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Fixed twinkle accents — CSS-animated, so they cost nothing per frame. */
const twinkles = [
  { left: "12%", top: "22%", delay: "0s", size: 2 },
  { left: "27%", top: "68%", delay: "1.2s", size: 1.5 },
  { left: "44%", top: "16%", delay: "2.4s", size: 2 },
  { left: "58%", top: "76%", delay: "0.6s", size: 1.5 },
  { left: "71%", top: "31%", delay: "3s", size: 2.5 },
  { left: "83%", top: "58%", delay: "1.8s", size: 2 },
  { left: "91%", top: "18%", delay: "2.1s", size: 1.5 },
  { left: "36%", top: "44%", delay: "3.6s", size: 1.5 },
];

export default function SpaceBackdrop({
  className = "",
  resolutionScale = 1,
}: {
  className?: string;
  /** Extra pixel density — use >1 when the backdrop gets scaled up on scroll. */
  resolutionScale?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // Paint synchronously — NOT inside requestAnimationFrame, which is paused
    // in background tabs and would leave the sky blank until the tab is focused.
    paint(canvas, resolutionScale);

    if (typeof ResizeObserver === "undefined") return;

    // Repaint only on meaningful width changes, so mobile URL-bar height
    // jitter doesn't trigger constant repaints.
    let lastW = canvas.clientWidth;
    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      if (Math.abs(w - lastW) < 40) return;
      lastW = w;
      paint(canvas, resolutionScale);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [resolutionScale]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* Deep-space base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 90% at 78% 8%, #101a38 0%, #070c1c 38%, #04060d 72%, #03040a 100%)",
        }}
      />

      {/* Colour depth — brand blue crown, violet floor */}
      <div className="aurora -top-40 right-[-10%] h-[560px] w-[720px] bg-galaxy/25" />
      <div className="aurora bottom-[-25%] left-[-15%] h-[520px] w-[680px] bg-nebula/20" />

      {/* Starfield — painted at native pixel density */}
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />

      {/* Twinkle accents */}
      {twinkles.map((t, i) => (
        <span
          key={i}
          className="absolute animate-pulse-glow rounded-full bg-white"
          style={{
            left: t.left,
            top: t.top,
            width: t.size,
            height: t.size,
            animationDelay: t.delay,
            boxShadow: "0 0 6px 1px rgba(255,255,255,0.55)",
          }}
        />
      ))}

      {/* Fine orbital arcs — quiet structure, on-theme without being literal */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="arc-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f7df9" stopOpacity="0" />
            <stop offset="45%" stopColor="#6f8dfb" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="arc-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#4f7df9" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4f7df9" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse
          cx="960"
          cy="330"
          rx="430"
          ry="150"
          fill="none"
          stroke="url(#arc-a)"
          strokeWidth="1"
          transform="rotate(-18 960 330)"
        />
        <ellipse
          cx="960"
          cy="330"
          rx="620"
          ry="235"
          fill="none"
          stroke="url(#arc-b)"
          strokeWidth="1"
          transform="rotate(-18 960 330)"
        />
        <circle cx="1258" cy="243" r="2.5" fill="#8b5cf6" opacity="0.85" />
        <circle cx="620" cy="452" r="2" fill="#4f7df9" opacity="0.7" />
      </svg>

      {/* Vignette keeps the edges calm and text legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 40%, rgba(3,4,10,0.55) 100%)",
        }}
      />
    </div>
  );
}

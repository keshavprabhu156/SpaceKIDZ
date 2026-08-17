"use client";

import Link from "next/link";
import SplitText from "@/components/common/SplitText";
import SpaceBackdrop from "@/components/fx/SpaceBackdrop";

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[660px] w-full overflow-hidden bg-space-black">
      {/* Deep-space backdrop — canvas starfield, painted once at native pixel
          density. Safe to scale on scroll: it's a static raster, so the
          compositor treats it as an image (no per-frame re-upload). */}
      <div
        data-hero-media
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transformOrigin: "62% 45%" }}
      >
        <SpaceBackdrop resolutionScale={1.4} />
      </div>

      {/* Legibility washes */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-space-black/85 via-space-black/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-space-black to-transparent" />

      {/* Copy */}
      <div
        data-hero-copy
        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-8"
      >
        <div className="max-w-2xl">
          <p className="animate-[fadeIn_1s_ease-out_forwards] opacity-0 [animation-delay:.2s] mb-6 inline-flex items-center gap-2 rounded-full border border-electric/25 bg-electric/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-electric">
            <span className="h-1.5 w-1.5 rounded-full bg-electric" />
            Space science for Grades 4–10
          </p>

          <h1 className="font-display text-[2.9rem] font-bold leading-[1.02] tracking-tight text-star sm:text-6xl md:text-7xl">
            <SplitText
              immediate
              segments={[
                { text: "Learn the universe" },
                { text: "by exploring it.", grad: true },
              ]}
            />
          </h1>

          <p className="animate-[fadeIn_1s_ease-out_forwards] opacity-0 [animation-delay:1s] mt-7 max-w-lg text-base leading-relaxed text-star/70 sm:text-lg">
            A complete seven-year space science curriculum — taught through interactive
            3D lessons, real physics simulations and weekly assessments, in classrooms
            across twelve countries.
          </p>

          <div className="animate-[fadeIn_1s_ease-out_forwards] opacity-0 [animation-delay:1.2s] mt-10 flex flex-wrap items-center gap-4">
            <Link href="/register" className="btn-primary">
              Start learning free
            </Link>
            <Link href="/demo" className="btn-secondary">
              Try a sample lesson
            </Link>
          </div>

          <p className="animate-[fadeIn_1s_ease-out_forwards] opacity-0 [animation-delay:1.4s] mt-8 text-xs text-star/45">
            Trusted by 262 schools · Aligned to international science standards
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="animate-[fadeIn_1s_ease-out_forwards] opacity-0 [animation-delay:1.8s] absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-star/40">
          Scroll
        </span>
        <span className="relative flex h-9 w-5 justify-center rounded-full border border-star/25 pt-1.5">
          <span className="h-1.5 w-1 animate-bounce rounded-full bg-electric" />
        </span>
      </div>

      <style>{`
        @keyframes fadeIn { to { opacity: 1; } }
      `}</style>
    </section>
  );
}

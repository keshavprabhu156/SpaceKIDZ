"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-2 border-electric/20 border-t-electric" />
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-electric/60">
          Initializing EVA suit…
        </p>
      </div>
    </div>
  ),
});

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden py-32 bg-space-black">
      {/* 3D Immersive Space Scene Backdrop */}
      <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
        <HeroScene />
      </div>

      {/* Cinematic radial overlays to ensure high contrast and text readability */}
      <div className="pointer-events-none absolute inset-0 bg-space-black/45 z-10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,8,12,0.35)_0%,rgba(8,8,12,0.85)_100%)] z-10" />

      {/* Foreground centered interactive copy stage */}
      <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center pointer-events-none">
        
        <div className="pointer-events-auto flex flex-col items-center">
          {/* Top Grade Tag */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="section-tag">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric" />
              Global Launch · Grades 4–10
            </span>
          </motion.div>

          {/* Center Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-4xl font-black uppercase leading-[1.05] tracking-wide text-star sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            International <br />
            <span className="bg-gradient-to-r from-electric via-galaxy-light to-nebula-light bg-clip-text text-transparent">
              Space Curriculum
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-4 font-display text-base font-semibold uppercase tracking-[0.4em] text-electric text-glow-cyan sm:text-lg"
          >
            Future Begins Here.
          </motion.p>

          {/* Core Narrative */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-star/75 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] font-medium"
          >
            A world-class space education program where students don&apos;t read about space —
            they fly through it. Interactive 3D missions, real satellite science, and a global
            academy of young explorers across 12+ countries.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link href="/login?role=student" className="btn-primary">
              Student Login
            </Link>
            <Link href="/login?role=teacher" className="btn-secondary">
              Teacher Login
            </Link>
            <Link href="/curriculum" className="btn-ghost">
              Explore Curriculum →
            </Link>
          </motion.div>

          {/* Metrics Ticker */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="mt-16 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-star/45 border-t border-white/10 pt-8 w-full max-w-3xl"
          >
            <span><span className="text-electric font-bold">37,700+</span> Cadets</span>
            <span className="h-1 w-1 rounded-full bg-white/20 hidden sm:inline-block" />
            <span><span className="text-electric font-bold">262</span> Schools</span>
            <span className="h-1 w-1 rounded-full bg-white/20 hidden sm:inline-block" />
            <span><span className="text-electric font-bold">12</span> Countries</span>
            <span className="h-1 w-1 rounded-full bg-white/20 hidden sm:inline-block" />
            <span><span className="text-gold font-bold">98%</span> Mission Success</span>
          </motion.div>
        </div>

      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex z-20"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-star/40">Begin Descent</span>
        <div className="h-9 w-5 rounded-full border border-star/20 p-1">
          <div className="mx-auto h-2 w-1 animate-bounce rounded-full bg-electric" />
        </div>
      </motion.div>
    </section>
  );
}

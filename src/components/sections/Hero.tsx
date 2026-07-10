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
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* ambient nebula glow */}
      <div className="pointer-events-none absolute inset-0 bg-nebula-radial" />
      <div className="pointer-events-none absolute inset-0 bg-holo-grid bg-[size:56px_56px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 pt-24 pb-12 lg:grid-cols-2 lg:gap-4 lg:pt-16">
        {/* ---------------- Left: copy ---------------- */}
        <div className="relative z-10 flex flex-col justify-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="section-tag">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric" />
              Global Launch · Grades 4–10
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-4xl font-black uppercase leading-[1.08] tracking-wide text-star sm:text-5xl xl:text-6xl"
          >
            International
            <br />
            <span className="bg-gradient-to-r from-electric via-galaxy-light to-nebula-light bg-clip-text text-transparent">
              Space Curriculum
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-3 font-display text-lg font-medium uppercase tracking-[0.35em] text-electric text-glow-cyan sm:text-xl"
          >
            Future Begins Here.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-6 max-w-xl text-base leading-relaxed text-star/60"
          >
            A world-class space education program where students don&apos;t read about space —
            they fly through it. Interactive 3D missions, real satellite science, and a global
            academy of young explorers across 12+ countries.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-9 flex flex-wrap gap-4"
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

          {/* mission ticker */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.2em] text-star/40"
          >
            <span><span className="text-electric">37,700+</span> Cadets</span>
            <span><span className="text-electric">262</span> Schools</span>
            <span><span className="text-electric">12</span> Countries</span>
            <span><span className="text-gold">98%</span> Mission Success</span>
          </motion.div>
        </div>

        {/* ---------------- Right: 3D astronaut ---------------- */}
        <div className="relative h-[420px] sm:h-[520px] lg:h-[calc(100vh-4rem)] lg:min-h-[560px]">
          <HeroScene />
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-star/40">Begin Descent</span>
        <div className="h-9 w-5 rounded-full border border-star/20 p-1">
          <div className="mx-auto h-2 w-1 animate-bounce rounded-full bg-electric" />
        </div>
      </motion.div>
    </section>
  );
}

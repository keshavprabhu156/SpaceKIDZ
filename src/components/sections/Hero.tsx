"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border border-star/15 border-t-electric/70" />
        <p className="font-mono text-[11px] tracking-wide text-star/40">Preparing the plate…</p>
      </div>
    </div>
  ),
});

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.14, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-space-black">
      {/* Photographic backdrop — Earth, Milky Way, lunar surface */}
      <img
        src="/space.jpg"
        alt=""
        draggable={false}
        className="absolute inset-0 z-0 h-full w-full select-none object-cover"
      />

      {/* Interactive astronaut on a transparent canvas above the photo */}
      <div className="absolute inset-0 z-[1]">
        <HeroScene />
      </div>

      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-space-black via-space-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-space-black/85 via-space-black/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-space-black/70 to-transparent" />

      {/* Copy — anchored low-left */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-electric"
          >
            Space Education Portal · Grades 4–10
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.02] tracking-tight text-star sm:text-7xl"
          >
            Explore. <span className="text-grad">Learn.</span>
            <br />
            <span className="text-grad">Inspire.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-star/70"
          >
            Your journey to the stars begins here. A seven-year curriculum in astronomy,
            orbital mechanics and spacecraft engineering — taught through interactive
            missions in classrooms across twelve countries.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-9 flex flex-wrap items-center gap-6"
          >
            <Link href="/register" className="btn-primary">
              Begin your journey
            </Link>
            <Link
              href="/curriculum"
              className="text-sm text-star/70 underline-offset-4 transition-colors hover:text-electric hover:underline"
            >
              Explore the curriculum →
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-star/35">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-star/40 to-transparent" />
      </motion.div>
    </section>
  );
}

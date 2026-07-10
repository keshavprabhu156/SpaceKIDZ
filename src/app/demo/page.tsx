import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/fx/StarBackground";
import ScrollFX from "@/components/fx/ScrollFX";
import DemoClient from "./DemoClient";

export const metadata: Metadata = { title: "Interactive Demo — Fly a Mission" };

export default function DemoPage() {
  return (
    <main className="relative min-h-screen bg-space-black">
      <ScrollFX />
      <Navbar />
      <StarBackground />
      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-32">
        <div className="max-w-3xl">
          <span className="section-tag">Interactive Demo</span>
          <h1 className="font-display text-4xl font-black uppercase tracking-wide text-star sm:text-5xl">
            Try a <span className="text-electric">Live Mission</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-star/55">
            This is how every lesson in the Academy feels. First, fly the orbit simulator from
            the Grade 5 chapter <em>“What Is an Orbit?”</em>. Then take a shortened weekly
            assessment with instant evaluation — exactly like the real student portal.
          </p>
        </div>

        <section data-reveal className="mt-14">
          <h2 className="mb-5 font-display text-lg font-bold uppercase tracking-[0.2em] text-electric">
            Mission 1 · Satellite Orbit Simulator
          </h2>
          <DemoClient />
        </section>
      </div>
      <Footer />
    </main>
  );
}

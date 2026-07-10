import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/fx/StarBackground";
import ScrollFX from "@/components/fx/ScrollFX";
import GamesClient from "./GamesClient";

export const metadata: Metadata = { title: "Game Deck — Mission Games" };

export default function GamesPage() {
  return (
    <main className="relative min-h-screen bg-space-black">
      <ScrollFX />
      <Navbar />
      <StarBackground />
      <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-32">
        <div className="max-w-3xl">
          <span className="section-tag">Game Deck</span>
          <h1 className="font-display text-4xl font-black uppercase tracking-wide text-star sm:text-5xl">
            Sixteen <span className="text-electric">Mission Games</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-star/55">
            Physics is the gameplay. Six missions are flight-ready in this preview — the full
            deck unlocks inside the student portal, each awarding XP, badges, stars and
            certificates.
          </p>
        </div>
        <GamesClient />
      </div>
      <Footer />
    </main>
  );
}

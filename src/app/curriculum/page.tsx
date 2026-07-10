import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/fx/StarBackground";
import ScrollFX from "@/components/fx/ScrollFX";
import { grades } from "@/data/curriculum";

export const metadata: Metadata = { title: "Curriculum — Grades 4 to 10" };

export default function CurriculumIndex() {
  return (
    <main className="relative min-h-screen bg-space-black">
      <ScrollFX />
      <Navbar />
      <StarBackground />
      <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-32">
        <div className="max-w-3xl">
          <span className="section-tag">Flight Plan</span>
          <h1 className="font-display text-4xl font-black uppercase tracking-wide text-star sm:text-5xl">
            The <span className="text-electric">Curriculum</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-star/55">
            Seven mission tiers, each with terms, chapters, interactive lessons, experiments,
            games and weekly assessments. Progress from Cadet to Astronaut — every grade builds
            toward real mission readiness.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {grades.map((g, i) => {
            const chapters = g.terms.reduce((n, t) => n + t.chapters.length, 0);
            const lessons = g.terms.reduce(
              (n, t) => n + t.chapters.reduce((m, c) => m + c.lessons.length, 0),
              0
            );
            return (
              <Link
                key={g.grade}
                href={`/curriculum/${g.grade}`}
                data-reveal
                className="holo-panel group relative block overflow-hidden p-7 transition-all duration-500 hover:shadow-holo-strong sm:p-9"
              >
                <div
                  className="absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-30"
                  style={{ backgroundColor: g.color }}
                />
                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="flex items-baseline gap-4 sm:w-52 sm:shrink-0">
                    <span className="font-display text-6xl font-black" style={{ color: g.color }}>
                      {g.grade}
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-star/40">
                        Rank {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-star">
                        {g.codename}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-bold uppercase tracking-wider text-star">
                      {g.tagline}
                    </h2>
                    <p className="mt-1.5 text-sm text-star/50">{g.theme}</p>
                  </div>
                  <div className="flex gap-8 font-mono text-[11px] uppercase tracking-widest text-star/40 sm:text-right">
                    <span>{g.terms.length} Terms</span>
                    <span>{chapters} Chapters</span>
                    <span>{lessons} Lessons</span>
                  </div>
                  <span className="text-electric opacity-0 transition-opacity group-hover:opacity-100">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}

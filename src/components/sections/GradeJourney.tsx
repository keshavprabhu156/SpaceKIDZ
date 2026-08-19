import Link from "next/link";
import { grades } from "@/data/curriculum";

/**
 * Horizontal grade carousel — NATIVE scroll (overflow-x-auto + snap), not
 * scroll-jacked. An earlier version drove card position from page-scroll
 * via a GSAP transform while the section stayed pinned with `position:
 * sticky`; that meant the cards could shift under the cursor mid-click
 * (mousedown and mouseup landing on different elements), which is exactly
 * the kind of thing that makes a click "not work" unpredictably. Native
 * horizontal scrolling has none of that failure mode, works with a
 * trackpad/touch/keyboard out of the box, and needs no JS at all.
 */
export default function GradeJourney() {
  return (
    <section id="curriculum" className="relative bg-space-black py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="max-w-2xl">
          <span className="section-tag">The curriculum</span>
          <h2 className="h-section">
            Seven grades. <span className="text-grad">One journey.</span>
          </h2>
          <p className="lede mt-5">
            Students begin by looking up at the night sky in Grade 4 and finish Grade 10
            designing missions of their own. Each year builds on the last.
          </p>
        </div>

        <div
          data-reveal
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:thin]"
        >
          {grades.map((g) => {
            const chapters = g.terms.reduce((n, t) => n + t.chapters.length, 0);
            const lessons = g.terms.reduce(
              (n, t) => n + t.chapters.reduce((m, c) => m + c.lessons.length, 0),
              0
            );
            return (
              <Link
                key={g.grade}
                href={`/curriculum/${g.grade}`}
                className="group relative flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-star/10 bg-space-navy/60 p-7 transition-colors duration-300 hover:border-electric/40 sm:w-[320px]"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: `linear-gradient(90deg, ${g.color}, transparent)` }}
                />
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-star/40">
                    Grade
                  </span>
                  <span className="font-display text-6xl font-bold leading-none text-star/90">
                    {g.grade}
                  </span>
                </div>

                <p
                  className="mt-6 font-mono text-xs uppercase tracking-[0.2em]"
                  style={{ color: g.color }}
                >
                  {g.codename}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold leading-snug text-star">
                  {g.tagline}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-star/55">{g.theme}</p>

                <div className="mt-6 flex items-center gap-4 border-t border-star/10 pt-4 font-mono text-[11px] text-star/45">
                  <span>{chapters} chapters</span>
                  <span>·</span>
                  <span>{lessons} lessons</span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-electric opacity-0 transition-opacity group-hover:opacity-100">
                  Explore grade →
                </span>
              </Link>
            );
          })}
        </div>

        <div data-reveal className="mt-8 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-star/35">
            Scroll sideways to see all seven grades
          </span>
          <span className="h-px flex-1 bg-star/10" />
          <Link href="/curriculum" className="text-sm text-electric hover:underline">
            See full syllabus →
          </Link>
        </div>
      </div>
    </section>
  );
}

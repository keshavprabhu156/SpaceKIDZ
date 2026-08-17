"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { grades } from "@/data/curriculum";

/** Horizontal, scroll-driven journey through the seven grades (Apple-style pin). */
export default function GradeJourney() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrap.current || !track.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const el = track.current;

    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const distance = el.scrollWidth - window.innerWidth + 64;
        gsap.set(el, { x: -distance * self.progress });
      },
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  }, []);

  return (
    <section id="curriculum" className="relative bg-space-black">
      <div className="mx-auto max-w-6xl px-5 pt-28 sm:px-8">
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
      </div>

      <div ref={wrap} className="relative h-[320vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div ref={track} className="flex gap-6 px-5 will-change-transform sm:px-8">
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
                  className="group relative flex w-[290px] shrink-0 flex-col overflow-hidden rounded-3xl border border-star/10 bg-space-navy/60 p-7 transition-colors duration-300 hover:border-electric/40 sm:w-[340px]"
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

          <div className="mx-auto mt-10 flex max-w-6xl items-center gap-3 px-5 sm:px-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-star/35">
              Scroll to travel through the grades
            </span>
            <span className="h-px flex-1 bg-star/10" />
            <Link href="/curriculum" className="text-sm text-electric hover:underline">
              See full syllabus →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

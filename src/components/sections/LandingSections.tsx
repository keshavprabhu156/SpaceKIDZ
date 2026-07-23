"use client";

import { useState } from "react";
import Link from "next/link";
import Flag from "@/components/ui/Flag";
import { grades } from "@/data/curriculum";
import { games } from "@/data/games";
import { countries, achievements } from "@/data/global";

/* ================= LESSON PREVIEW (Plate II) ================= */

type PreviewTab = "lessons" | "labs" | "community";

const previewTabs: { id: PreviewTab; label: string }[] = [
  { id: "lessons", label: "Lessons" },
  { id: "labs", label: "Labs" },
  { id: "community", label: "Community" },
];

function LessonPreview() {
  const [tab, setTab] = useState<PreviewTab>("lessons");

  return (
    <figure data-reveal>
      <div className="plate-frame">
        <div className="m-2 flex min-h-[460px] flex-col overflow-hidden rounded-sm border border-star/10 bg-space-navy/70">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-star/10 px-5 py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-star/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-star/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-star/15" />
            <span className="ml-3 font-mono text-[11px] text-star/40">spacecurriculum.org / learn</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-star/10 px-6">
            {previewTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`-mb-px border-b-2 py-3 text-sm transition-colors ${
                  tab === t.id
                    ? "border-electric text-star"
                    : "border-transparent text-star/45 hover:text-star/70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 p-6">
            {tab === "lessons" && (
              <div>
                <p className="text-xs text-star/40">Grade 6 · Chapter 4 · Week 2</p>
                <h4 className="mt-1 font-display text-xl font-medium text-star">
                  Landing on the Moon
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-star/60">
                  Control your descent velocity, line up the thrusters and set down softly
                  near the lunar south pole. The physics is real — the mistakes are safe.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-star/50">
                    <span>Lesson progress</span>
                    <span className="text-star/70">7 of 10 steps</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-star/10">
                    <div className="h-full w-[70%] rounded-full bg-electric" />
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <span className="rounded-sm border border-star/10 px-2.5 py-1 text-xs text-star/55">Simulation</span>
                  <span className="rounded-sm border border-star/10 px-2.5 py-1 text-xs text-star/55">15 min</span>
                  <span className="rounded-sm border border-star/10 px-2.5 py-1 text-xs text-star/55">Graded</span>
                </div>
              </div>
            )}

            {tab === "labs" && (
              <ul className="space-y-3">
                {[
                  { title: "Orbital mechanics", desc: "Trace how a planet pulls on a passing comet." },
                  { title: "Rocket assembly", desc: "Stack a booster and balance its payload." },
                  { title: "Stellar spectroscopy", desc: "Split starlight to read what a star is made of." },
                ].map((lab, i) => (
                  <li
                    key={lab.title}
                    className="flex items-start gap-4 rounded-sm border border-star/[0.08] bg-white/[0.015] p-3.5"
                  >
                    <span className="font-mono text-xs text-electric">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-sm font-medium text-star">{lab.title}</p>
                      <p className="mt-0.5 text-xs text-star/50">{lab.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {tab === "community" && (
              <ul className="space-y-3">
                {[
                  { name: "Sarah, Grade 7", place: "United Kingdom", note: "finished Orbits I" },
                  { name: "Liam, Grade 9", place: "Canada", note: "topped the moon-landing board" },
                  { name: "Kenzo, Grade 8", place: "Japan", note: "earned the Navigator badge" },
                ].map((c) => (
                  <li
                    key={c.name}
                    className="flex items-center justify-between rounded-sm border border-star/[0.08] bg-white/[0.015] p-3.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-star">{c.name}</p>
                      <p className="mt-0.5 text-xs text-star/45">{c.place}</p>
                    </div>
                    <span className="text-xs text-star/55">{c.note}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <figcaption className="fig-caption mt-4 text-center">
        Plate II — <em>The student learning environment, as issued to every school.</em>
      </figcaption>
    </figure>
  );
}

/* ================= I · THE METHOD ================= */

const method = [
  {
    n: "01",
    title: "Learn by handling the real thing",
    text: "Every concept arrives as a three-dimensional object — a planet to rotate, a satellite to take apart, a rocket to assemble. Reading comes second; handling comes first.",
  },
  {
    n: "02",
    title: "Simulate before you believe",
    text: "Claims are tested in live physics simulations. Students fly the orbit, feel the transfer window, and watch their own predictions succeed or fail.",
  },
  {
    n: "03",
    title: "Assess weekly, gently",
    text: "Short weekly assessments — multiple choice, matching, identification — with instant explanations. Marks measure progress, never punish curiosity.",
  },
  {
    n: "04",
    title: "Progress like a professional",
    text: "Experience points, ranks and certificates map to real skills, from first stargazing in Grade 4 to full mission command in Grade 10.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left: heading + method rows */}
          <div>
            <div data-reveal>
              <span className="section-tag">I · The method</span>
              <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-star sm:text-4xl">
                How we teach
                <br />
                the <span className="text-grad">night sky.</span>
              </h2>
            </div>

            <ol data-reveal-stagger className="mt-12">
              {method.map((m) => (
                <li key={m.n} className="group py-6 first:pt-0">
                  <div className="dotted-rule mb-6 group-first:hidden" />
                  <div className="flex gap-5">
                    <span className="font-display text-lg text-grad/80">{m.n}</span>
                    <div>
                      <h3 className="font-display text-lg font-medium text-star">{m.title}</h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-star/55">{m.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Right: the plate */}
          <div className="lg:pt-8">
            <LessonPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= II · THE SCHOOL ================= */

export function MissionSection() {
  return (
    <section id="mission" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <div data-reveal>
            <span className="section-tag">II · The school</span>
            <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-star sm:text-4xl">
              One curriculum,
              <br />
              taught around the <span className="text-grad">world.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-star/60">
              The coming decades will need millions of engineers, scientists, operators
              and dreamers. Our work is to put a world-class space education in front of
              every student on Earth — in their language, their timezone, their classroom.
            </p>
            <ul className="mt-8 space-y-3.5">
              {[
                "Aligned to international science standards, localised per country",
                "Multi-language ready, with timezone-aware live sessions",
                "Teacher training, manuals and full classroom resources included",
                "Ready for AR lessons, VR classrooms and live telemetry modules",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-star/70">
                  <span className="mt-1 text-electric">—</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <figure data-reveal>
            <div className="plate-frame">
              <div className="m-2 rounded-sm border border-star/10 bg-space-navy/50 p-8 sm:p-10">
                <table className="w-full">
                  <tbody>
                    {[
                      { label: "Students enrolled", value: "37,700" },
                      { label: "Partner schools", value: "262" },
                      { label: "Countries teaching the curriculum", value: "12" },
                      { label: "Missions completed to date", value: "418,000" },
                    ].map((row) => (
                      <tr key={row.label} className="border-b border-star/[0.08] last:border-0">
                        <td className="py-4 pr-4 text-sm text-star/55">{row.label}</td>
                        <td className="py-4 text-right font-display text-2xl font-medium text-star">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-8 font-display text-lg font-medium italic leading-relaxed text-star/70">
                  “The first people to walk on Mars are in a classroom today. Our job is
                  to make sure they’re ready.”
                </p>
              </div>
            </div>
            <figcaption className="fig-caption mt-4 text-center">
              Table 1 — <em>The school in numbers, current academic year.</em>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ================= III · THE SYLLABUS ================= */

export function CurriculumSection() {
  return (
    <section id="curriculum" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="mb-14 max-w-2xl">
          <span className="section-tag">III · The syllabus</span>
          <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-star sm:text-4xl">
            Seven years, from first light to <span className="text-grad">mission command.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-star/60">
            Each grade is a year-long course with its own theme, rank and objectives.
            Select a grade to read its full term-by-term syllabus.
          </p>
        </div>

        {/* Course catalogue — rows, not cards */}
        <div data-reveal-stagger>
          {grades.map((g) => (
            <Link
              key={g.grade}
              href={`/curriculum/${g.grade}`}
              className="group block border-b border-star/10 py-6 transition-colors first:border-t hover:bg-white/[0.02]"
            >
              <div className="grid items-baseline gap-2 px-2 sm:grid-cols-[90px_180px_1fr_auto] sm:gap-6">
                <span className="font-display text-3xl font-medium text-star/90 transition-colors group-hover:text-electric">
                  {String(g.grade).padStart(2, "0")}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-electric/80">
                  {g.codename}
                </span>
                <span className="text-sm leading-relaxed text-star/60">{g.tagline}</span>
                <span className="hidden text-sm text-star/35 transition-all group-hover:translate-x-1 group-hover:text-electric sm:block">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p data-reveal className="fig-caption mt-6 px-2">
          Grades 4–10 · <em>Complete syllabus available to partner schools on request.</em>
        </p>
      </div>
    </section>
  );
}

/* ================= IV · THE OBSERVATORY (demo) ================= */

export function DemoSection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <figure data-reveal className="order-2 lg:order-1">
            <div className="plate-frame">
              <div className="m-2 flex items-center justify-center rounded-sm border border-star/10 bg-space-navy/40 py-14">
                <div className="relative flex h-60 w-60 items-center justify-center sm:h-72 sm:w-72">
                  <div className="absolute inset-0 animate-spin-slow rounded-full border border-star/[0.12]" />
                  <div className="absolute inset-8 rounded-full border border-dashed border-star/10" />
                  <div className="absolute h-2.5 w-2.5 animate-orbit rounded-full bg-electric" />
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-galaxy to-space-panel sm:h-28 sm:w-28" />
                </div>
              </div>
            </div>
            <figcaption className="fig-caption mt-4 text-center">
              Fig. 3 — <em>A stable orbit, achieved by a visitor. You may try it now.</em>
            </figcaption>
          </figure>

          <div data-reveal className="order-1 lg:order-2">
            <span className="section-tag">IV · The observatory</span>
            <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-star sm:text-4xl">
              Sit the first lesson <span className="text-grad">before</span> you apply.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-star/60">
              The orbit simulator below is the same instrument our Grade 6 students use.
              Adjust altitude and velocity, settle into a stable orbit, and mark your own
              work with the weekly assessment engine.
            </p>
            <Link href="/demo" className="btn-primary mt-8">
              Enter the observatory
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= V · PRACTICAL EXERCISES (games) ================= */

export function GamesSection() {
  const featured = games.slice(0, 6);
  return (
    <section id="games" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="mb-12 max-w-2xl">
          <span className="section-tag">V · Practical exercises</span>
          <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-star sm:text-4xl">
            Where the physics is the <span className="text-grad">play.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-star/60">
            Sixteen exercises in which real science is the gameplay — each one graded,
            each one counting toward rank and certificate.
          </p>
        </div>

        <div data-reveal-stagger className="grid gap-x-12 sm:grid-cols-2">
          {featured.map((g, i) => (
            <div key={g.id} className="border-b border-star/10 py-5 first:border-t sm:[&:nth-child(2)]:border-t">
              <div className="flex items-baseline gap-4 px-1">
                <span className="font-mono text-xs text-electric/70">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-base font-medium text-star">{g.title}</h3>
                    <span className="whitespace-nowrap text-xs text-star/40">Grade {g.minGrade}+</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-star/50">{g.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-10">
          <Link href="/games" className="btn-secondary">
            View all sixteen exercises
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================= VI · HONOURS ================= */

export function AchievementsSection() {
  const honours = achievements.slice(0, 8);
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="mb-12 max-w-2xl">
          <span className="section-tag">VI · Honours</span>
          <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-star sm:text-4xl">
            The honours <span className="text-grad">board.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-star/60">
            Every mission finished and every streak held earns its mark — recognised
            across the school’s international network.
          </p>
        </div>

        <div data-reveal-stagger className="grid grid-cols-2 gap-x-8 sm:grid-cols-4">
          {honours.map((a) => (
            <div key={a.id} className="border-t border-star/10 py-6">
              <span className="text-2xl">{a.icon}</span>
              <p className="mt-3 font-display text-sm font-medium text-star">{a.title}</p>
              <p className="mt-1 text-xs leading-snug text-star/45">{a.description}</p>
              <p className="fig-caption mt-3">{a.tier}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= VII · THE INTERNATIONAL REGISTER ================= */

export function CountriesSection() {
  return (
    <section id="countries" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="mb-12 max-w-2xl">
          <span className="section-tag">VII · The register</span>
          <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-star sm:text-4xl">
            Twelve nations, one <span className="text-grad">sky.</span>
          </h2>
        </div>

        {/* Institutional register table */}
        <div data-reveal className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-star/20 text-left">
                <th className="pb-3 pr-4 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-star/40">Country</th>
                <th className="pb-3 pr-4 text-right font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-star/40">Students</th>
                <th className="pb-3 text-right font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-star/40">Schools</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((c) => (
                <tr key={c.code} className="border-b border-star/[0.08] transition-colors hover:bg-white/[0.02]">
                  <td className="py-3.5 pr-4">
                    <span className="flex items-center gap-3">
                      <Flag code={c.code} size={22} />
                      <span className="text-sm text-star/85">{c.name}</span>
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-right font-mono text-sm text-star/70">
                    {c.students.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right font-mono text-sm text-star/70">{c.schools}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p data-reveal className="mt-8 text-sm text-star/45">
          Your country next?{" "}
          <Link href="/#contact" className="text-electric hover:underline">
            Request a partnership briefing →
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ================= VIII · ADMISSIONS ================= */

export function FinalCTA() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <div data-reveal>
          <div className="dotted-rule mx-auto mb-12 max-w-xs" />
          <span className="section-tag justify-center">IX · Admissions</span>
          <h2 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-star sm:text-5xl">
            Admissions are <span className="text-grad">open.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-star/60">
            Enrolment is open to students worldwide. Register, receive your student ID,
            and take your seat in the next class of explorers.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-primary">
              Apply for admission
            </Link>
            <Link href="/curriculum" className="btn-ghost">
              Read the syllabus first
            </Link>
          </div>
          <div className="dotted-rule mx-auto mt-12 max-w-xs" />
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Flag from "@/components/ui/Flag";
import { grades } from "@/data/curriculum";
import { games } from "@/data/games";
import { countries, achievements } from "@/data/global";

/* ================= ABOUT ================= */

const pillars = [
  {
    icon: "◈",
    title: "Learn in 3D",
    text: "Every concept is an experience — rotate planets, dissect satellites, assemble rockets. No PDFs, no passive reading.",
  },
  {
    icon: "◉",
    title: "Real Mission Science",
    text: "Curriculum built on real orbital mechanics, spacecraft engineering and mission operations — simplified, never dumbed down.",
  },
  {
    icon: "✦",
    title: "Global Academy",
    text: "Students across 12+ countries learn together, compete on leaderboards and collaborate on missions across timezones.",
  },
  {
    icon: "⬡",
    title: "Progress Like an Astronaut",
    text: "XP, ranks, badges and certificates map to real skills — from Cadet in Grade 4 to Astronaut in Grade 10.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          tag="01 · About the Curriculum"
          title={<>Not a Course. <span className="text-electric">A Space Academy.</span></>}
          subtitle="Seven grades. One trajectory. A complete space education program that transforms curious students into mission-ready thinkers through interactive science, engineering and exploration."
        />
        <div data-reveal-stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="holo-panel scan-sweep group p-7 transition-all duration-500 hover:shadow-holo-strong hover:-translate-y-1">
              <span className="text-3xl text-electric">{p.icon}</span>
              <h3 className="mt-5 font-display text-base font-bold uppercase tracking-wider text-star">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-star/55">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= GLOBAL MISSION ================= */

export function MissionSection() {
  return (
    <section id="mission" className="relative py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-galaxy/5 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div data-reveal>
            <span className="section-tag">02 · Global Mission</span>
            <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-wide text-star sm:text-4xl">
              One Planet.<br />
              <span className="bg-gradient-to-r from-nebula-light to-electric bg-clip-text text-transparent">
                One Generation of Explorers.
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-star/60">
              The space economy will need millions of engineers, scientists, operators and
              dreamers. Our mission is to make world-class space education accessible to every
              student on Earth — in their language, their timezone, their classroom.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Aligned to international science standards, localised per country",
                "Multi-language ready with timezone-aware live sessions",
                "Teacher training, manuals and full classroom resources included",
                "Designed for AR lessons, VR classrooms and live telemetry modules",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-star/70">
                  <span className="mt-0.5 text-electric">▸</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="relative">
            <div className="holo-panel holo-border relative overflow-hidden p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-electric/70">
                Mission Telemetry · Live
              </p>
              <div className="mt-6 grid grid-cols-2 gap-6">
                {[
                  { label: "Active Cadets", value: "37,700+", accent: "text-electric" },
                  { label: "Partner Schools", value: "262", accent: "text-star" },
                  { label: "Countries", value: "12", accent: "text-nebula-soft" },
                  { label: "Missions Completed", value: "418K", accent: "text-gold" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className={`font-display text-3xl font-bold ${s.accent}`}>{s.value}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-star/40">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
              <p className="mt-6 text-sm italic leading-relaxed text-star/50">
                “The first humans on Mars are in a classroom today. Our job is to make sure
                they&apos;re ready.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= CURRICULUM OVERVIEW ================= */

export function CurriculumSection() {
  return (
    <section id="curriculum" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          tag="03 · Curriculum Overview"
          title={<>Seven Grades. <span className="text-electric">Seven Ranks.</span></>}
          subtitle="Each grade is a mission tier with its own theme, rank and objectives — from first stargazing to full mission command."
        />
        <div data-reveal-stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {grades.map((g) => (
            <Link
              key={g.grade}
              href={`/curriculum/${g.grade}`}
              className="holo-panel group relative overflow-hidden p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-holo-strong"
            >
              <div
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-50"
                style={{ backgroundColor: g.color }}
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-star/40">Grade</p>
              <p className="font-display text-4xl font-black" style={{ color: g.color }}>
                {g.grade}
              </p>
              <p className="mt-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-star">
                {g.codename}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-star/50">{g.tagline}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-electric/60 opacity-0 transition-opacity group-hover:opacity-100">
                Open Mission →
              </p>
            </Link>
          ))}
        </div>
        <div data-reveal className="mt-12 text-center">
          <Link href="/curriculum" className="btn-secondary">
            View Full Curriculum
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================= INTERACTIVE DEMO TEASER ================= */

export function DemoSection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div data-reveal className="holo-panel holo-border relative overflow-hidden p-10 sm:p-14">
          <div className="pointer-events-none absolute inset-0 bg-holo-grid bg-[size:44px_44px] opacity-30" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="section-tag">04 · Interactive Demo</span>
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-star sm:text-4xl">
                Fly It <span className="text-electric">Before You Enroll</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-star/60">
                Take the controls of our live orbit simulator. Adjust altitude and velocity,
                achieve a stable orbit, and experience exactly how every lesson in the Academy
                feels — hands on the stick, not eyes on a page.
              </p>
              <Link href="/demo" className="btn-primary mt-8">
                Launch Demo Mission
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72">
                <div className="absolute inset-0 animate-spin-slow rounded-full border border-electric/20" />
                <div className="absolute inset-6 rounded-full border border-dashed border-nebula-light/20" />
                <div className="absolute h-3 w-3 animate-orbit rounded-full bg-electric shadow-holo-strong" />
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-galaxy to-space-navy shadow-nebula sm:h-32 sm:w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= GAMES ================= */

export function GamesSection() {
  const featured = games.slice(0, 8);
  return (
    <section id="games" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          tag="05 · Mission Games"
          title={<>Play. <span className="text-electric">Master.</span> Launch.</>}
          subtitle="Sixteen mission-grade games where physics is the gameplay. Every game awards XP, badges and certificates."
        />
        <div data-reveal-stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((g) => (
            <div key={g.id} className="holo-panel group p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-holo-strong">
              <div className="flex items-start justify-between">
                <span className="text-3xl">{g.icon}</span>
                <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-gold">
                  +{g.xp} XP
                </span>
              </div>
              <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-wider text-star">{g.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-star/50">{g.description}</p>
              <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-star/40">
                <span>Grade {g.minGrade}+</span>
                <span className="text-electric">{"▸".repeat(g.difficulty)}</span>
              </div>
            </div>
          ))}
        </div>
        <div data-reveal className="mt-12 text-center">
          <Link href="/games" className="btn-secondary">
            Enter Game Deck — 16 Missions
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================= ACHIEVEMENTS ================= */

const tierStyles: Record<string, string> = {
  bronze: "border-orange-400/30 text-orange-300",
  silver: "border-slate-300/30 text-slate-200",
  gold: "border-gold/40 text-gold shadow-gold",
  platinum: "border-electric/40 text-electric shadow-holo",
};

export function AchievementsSection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          tag="06 · Achievements"
          title={<>Earn Your <span className="text-glow-gold text-gold">Wings</span></>}
          subtitle="Every mission completed, streak held, and test aced moves you up the ranks — with certificates recognised across the Academy's global network."
        />
        <div data-reveal-stagger className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`glass-panel flex flex-col items-center border p-6 text-center transition-all duration-500 hover:-translate-y-1 ${tierStyles[a.tier]}`}
            >
              <span className="text-3xl">{a.icon}</span>
              <p className="mt-3 font-display text-[11px] font-bold uppercase tracking-wider">{a.title}</p>
              <p className="mt-1.5 text-[11px] leading-snug text-star/45">{a.description}</p>
              <span className="mt-3 font-mono text-[9px] uppercase tracking-[0.25em] opacity-60">{a.tier}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= COUNTRIES ================= */

export function CountriesSection() {
  return (
    <section id="countries" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          tag="07 · Global Network"
          title={<>One Academy. <span className="text-electric">Twelve Nations.</span></>}
          subtitle="A growing constellation of partner schools across every continent — learning the same missions, together."
        />
        <div data-reveal-stagger className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {countries.map((c) => (
            <div key={c.code} className="glass-panel flex items-center gap-4 p-5 transition-all duration-300 hover:border-electric/40 hover:shadow-holo">
              <Flag code={c.code} size={34} />
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-wider text-star">{c.name}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-star/40">
                  {c.students.toLocaleString()} cadets · {c.schools} schools
                </p>
              </div>
            </div>
          ))}
        </div>
        <p data-reveal className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-star/35">
          Your country next? <Link href="/#contact" className="text-electric hover:underline">Request a partnership briefing →</Link>
        </p>
      </div>
    </section>
  );
}

/* ================= FINAL CTA ================= */

export function FinalCTA() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div data-reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-electric/70">
            T-minus zero
          </p>
          <h2 className="mt-4 font-display text-4xl font-black uppercase tracking-wide text-star sm:text-5xl">
            Your Mission
            <br />
            <span className="bg-gradient-to-r from-electric to-nebula-light bg-clip-text text-transparent">
              Starts Now
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-star/55">
            Join thousands of cadets around the world. Register, get your Student ID, and step
            into Mission Control.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-primary">Begin Registration</Link>
            <Link href="/curriculum" className="btn-ghost">Explore Curriculum</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Flag from "@/components/common/Flag";
import { games } from "@/data/games";
import { countries, achievements } from "@/data/global";

/* ================= TRUST BAR ================= */

const stats = [
  { n: 37700, suffix: "+", label: "students learning" },
  { n: 262, suffix: "", label: "partner schools" },
  { n: 12, suffix: "", label: "countries" },
  { n: 42, suffix: "", label: "interactive lessons" },
];

export function TrustBar() {
  return (
    <section className="relative border-y border-star/[0.07] bg-space-deep/60">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div data-reveal-stagger className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p
                data-count={s.n}
                data-count-suffix={s.suffix}
                className="font-display text-4xl font-bold tracking-tight text-star sm:text-5xl"
              >
                0
              </p>
              <p className="mt-2 text-sm text-star/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= WHY / PILLARS ================= */

const pillars = [
  {
    icon: "🛰",
    title: "Real science, made clear",
    text: "Built on genuine orbital mechanics and spacecraft engineering — simplified for young minds, never dumbed down.",
  },
  {
    icon: "🎮",
    title: "Learning that feels like play",
    text: "Simulations and games carry the physics, so students practise for fun and don't notice the revision.",
  },
  {
    icon: "📈",
    title: "Progress you can measure",
    text: "Weekly assessments, streaks and certificates give students, teachers and parents a clear picture.",
  },
  {
    icon: "🌍",
    title: "One classroom, worldwide",
    text: "Students in twelve countries follow the same missions, in their own language and timezone.",
  },
];

export function WhySection() {
  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="max-w-2xl">
          <span className="section-tag">Why it works</span>
          <h2 className="h-section">
            A space programme that <span className="text-grad">actually teaches.</span>
          </h2>
        </div>

        <div data-reveal-stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="card-edu holo-border">
              <span className="text-3xl">{p.icon}</span>
              <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-star">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-star/55">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= GAMES ================= */

export function GamesSection() {
  const featured = games.slice(0, 6);
  return (
    <section id="games" className="relative overflow-hidden py-28">
      <div className="aurora left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 bg-nebula/15" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="max-w-2xl">
          <span className="section-tag">Practice arcade</span>
          <h2 className="h-section">
            Sixteen games where the <span className="text-grad">physics is the play.</span>
          </h2>
          <p className="lede mt-5">
            Land on the Moon, assemble a rocket, hold a stable orbit. Every game awards XP
            and counts toward a student&apos;s rank.
          </p>
        </div>

        <div data-reveal-stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((g) => (
            <div key={g.id} className="card-edu group">
              <div className="flex items-start justify-between">
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  {g.icon}
                </span>
                <span className="rounded-full border border-electric/25 bg-electric/10 px-2.5 py-1 font-mono text-[10px] text-electric">
                  +{g.xp} XP
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-star">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-star/55">{g.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-star/10 pt-4 text-xs text-star/45">
                <span>Grade {g.minGrade}+</span>
                <span className="flex gap-1">
                  {[1, 2, 3].map((d) => (
                    <span
                      key={d}
                      className={`h-1.5 w-1.5 rounded-full ${
                        d <= g.difficulty ? "bg-electric" : "bg-star/20"
                      }`}
                    />
                  ))}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-12">
          <Link href="/games" className="btn-secondary">
            Browse all sixteen games
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================= ACHIEVEMENTS ================= */

const tierRing: Record<string, string> = {
  bronze: "from-orange-400/30 to-transparent",
  silver: "from-slate-300/30 to-transparent",
  gold: "from-gold/35 to-transparent",
  platinum: "from-electric/35 to-transparent",
};

export function AchievementsSection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal>
            <span className="section-tag">Motivation</span>
            <h2 className="h-section">
              Badges worth <span className="text-grad">earning.</span>
            </h2>
            <p className="lede mt-5">
              Every mission finished, streak held and test aced moves a student up the
              ranks — with certificates recognised across our global network.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Bronze", "Silver", "Gold", "Platinum"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-star/15 px-3.5 py-1.5 text-xs text-star/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div data-reveal-stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {achievements.slice(0, 6).map((a) => (
              <div
                key={a.id}
                className="relative overflow-hidden rounded-2xl border border-star/10 bg-space-navy/60 p-5 text-center"
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${
                    tierRing[a.tier] ?? "from-transparent to-transparent"
                  }`}
                />
                <span className="relative text-3xl">{a.icon}</span>
                <p className="relative mt-3 font-display text-sm font-semibold text-star">
                  {a.title}
                </p>
                <p className="relative mt-1.5 text-xs leading-snug text-star/45">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= GLOBAL NETWORK ================= */

export function NetworkSection() {
  return (
    <section id="network" className="relative overflow-hidden py-28">
      <div className="aurora left-[-5%] top-1/3 h-[400px] w-[400px] bg-galaxy/20" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="max-w-2xl">
          <span className="section-tag">Global network</span>
          <h2 className="h-section">
            Taught in <span className="text-grad">twelve countries.</span>
          </h2>
          <p className="lede mt-5">
            A growing constellation of partner schools across every continent — following
            the same curriculum, together.
          </p>
        </div>

        <div data-reveal-stagger className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {countries.map((c) => (
            <div
              key={c.code}
              className="flex items-center gap-4 rounded-2xl border border-star/10 bg-space-navy/50 p-5 transition-colors duration-300 hover:border-electric/35"
            >
              <Flag code={c.code} size={32} />
              <div>
                <p className="font-display text-sm font-semibold text-star">{c.name}</p>
                <p className="mt-0.5 text-xs text-star/45">
                  {c.students.toLocaleString()} students · {c.schools} schools
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= FAQ ================= */

const faqs = [
  {
    q: "Which grades is this for?",
    a: "Grades 4 to 10 (roughly ages 9–16). Each grade is a full year with two terms, its own theme and its own rank.",
  },
  {
    q: "Do we need special equipment or a lab?",
    a: "No. Everything runs in a normal web browser on a school computer, laptop or tablet — no installs, no headsets, no lab required.",
  },
  {
    q: "How are students assessed?",
    a: "Short weekly tests at the end of each chapter, with multiple choice, true/false, matching and image identification. They mark instantly and explain every answer.",
  },
  {
    q: "Can it run alongside our existing science syllabus?",
    a: "Yes. The curriculum is aligned to international science standards and can be localised per country, so schools use it as an enrichment programme or a full course.",
  },
  {
    q: "What support do teachers get?",
    a: "Teacher training and onboarding, lesson manuals, downloadable classroom resources, and a portal showing exactly where each class needs help.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="relative py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div data-reveal className="text-center">
          <span className="section-tag">Questions</span>
          <h2 className="h-section">Common questions</h2>
        </div>

        <div data-reveal-stagger className="mt-12 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group overflow-hidden rounded-2xl border border-star/10 bg-space-navy/50 transition-colors hover:border-star/20"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-base font-semibold text-star marker:content-none">
                {f.q}
                <span className="shrink-0 text-electric transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed text-star/60">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= FINAL CTA ================= */

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="aurora left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-galaxy/25" />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <div data-reveal>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-star sm:text-6xl">
            Ready to start <span className="text-grad">exploring?</span>
          </h2>
          <p className="lede mx-auto mt-6 max-w-xl">
            Create a free student account in under a minute, or book a briefing for your
            school. The next class of explorers starts now.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-primary">
              Start learning free
            </Link>
            <Link href="/#contact" className="btn-secondary">
              Book a school briefing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

type Aud = "students" | "teachers" | "schools";

const audiences: Record<
  Aud,
  {
    label: string;
    icon: string;
    headline: string;
    grad: string;
    body: string;
    points: { title: string; text: string }[];
    cta: { label: string; href: string };
  }
> = {
  students: {
    label: "For students",
    icon: "🎓",
    headline: "Learn like an",
    grad: "explorer.",
    body: "Missions instead of chapters, simulators instead of diagrams, and a rank that grows with everything you finish.",
    points: [
      { title: "Interactive 3D lessons", text: "Handle satellites, planets and rockets — don't just read about them." },
      { title: "Earn XP, badges and ranks", text: "Rise from Cadet in Grade 4 to Astronaut in Grade 10." },
      { title: "Play 16 science games", text: "Where the physics is genuinely the gameplay." },
      { title: "See where you stand", text: "Track streaks and progress on your own dashboard." },
    ],
    cta: { label: "Create your student account", href: "/register" },
  },
  teachers: {
    label: "For teachers",
    icon: "📋",
    headline: "Everything ready for",
    grad: "Monday morning.",
    body: "Lesson-by-lesson plans, auto-marked weekly tests and class analytics that show exactly who needs help and with what.",
    points: [
      { title: "Class progress at a glance", text: "Per-student and per-chapter scores, updated live." },
      { title: "Assessments mark themselves", text: "Weekly tests grade instantly with explanations." },
      { title: "Teaching recommendations", text: "See which chapters your class is struggling with." },
      { title: "Resource library", text: "Downloadable manuals, slides and activity sheets." },
    ],
    cta: { label: "Open the teacher portal", href: "/login?role=teacher" },
  },
  schools: {
    label: "For schools & parents",
    icon: "🏫",
    headline: "A full space programme,",
    grad: "ready to adopt.",
    body: "Bring a complete, standards-aligned space science curriculum to your school — with teacher training and support included.",
    points: [
      { title: "Aligned to standards", text: "Mapped to international science standards, localised per country." },
      { title: "Teacher training included", text: "Onboarding, manuals and ongoing support for your staff." },
      { title: "Works in any classroom", text: "Runs in the browser — no lab, no installs, no special hardware." },
      { title: "Certificates students keep", text: "Recognised across our twelve-country network." },
    ],
    cta: { label: "Request a school briefing", href: "/#contact" },
  },
};

const order: Aud[] = ["students", "teachers", "schools"];

export default function AudienceSection() {
  const [active, setActive] = useState<Aud>("students");
  const a = audiences[active];

  return (
    <section id="audience" className="relative overflow-hidden py-28">
      <div className="aurora left-[-10%] top-1/4 h-[420px] w-[420px] bg-galaxy/25" />
      <div className="aurora right-[-8%] bottom-0 h-[380px] w-[380px] bg-nebula/20" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="max-w-2xl">
          <span className="section-tag">Who it&apos;s for</span>
          <h2 className="h-section">
            Built for everyone in the <span className="text-grad">classroom.</span>
          </h2>
        </div>

        {/* Tabs */}
        <div
          data-reveal
          className="mt-10 inline-flex flex-wrap gap-1.5 rounded-full border border-star/10 bg-white/[0.03] p-1.5 backdrop-blur-sm"
        >
          {order.map((k) => (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                active === k
                  ? "bg-brand-grad text-white shadow-glow"
                  : "text-star/60 hover:text-star"
              }`}
            >
              <span className="mr-1.5">{audiences[k].icon}</span>
              {audiences[k].label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div key={active} className="animate-scaleUpFade mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-display text-3xl font-bold leading-tight tracking-tight text-star sm:text-4xl">
              {a.headline} <span className="text-grad">{a.grad}</span>
            </h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-star/60">{a.body}</p>
            <Link href={a.cta.href} className="btn-primary mt-8">
              {a.cta.label}
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-star/10 bg-star/10 sm:grid-cols-2">
            {a.points.map((p) => (
              <div key={p.title} className="bg-space-navy/80 p-6">
                <h4 className="font-display text-base font-semibold text-star">{p.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-star/55">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

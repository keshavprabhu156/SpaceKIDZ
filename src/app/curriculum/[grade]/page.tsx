import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/fx/StarBackground";
import ScrollFX from "@/components/fx/ScrollFX";
import { getGrade, lessonTypeMeta } from "@/data/curriculum";
import { getSession } from "@/utils/session";

// Rendered per-request: the lesson rows show "Start" vs "Login" based on the
// viewer's session cookie, so this page must not be statically cached.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ grade: string }>;
}): Promise<Metadata> {
  const { grade } = await params;
  const g = getGrade(Number(grade));
  return { title: g ? `Grade ${g.grade} — ${g.codename}` : "Curriculum" };
}

export default async function GradePage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade } = await params;
  const g = getGrade(Number(grade));
  if (!g) notFound();

  // Students (and admins previewing) can open lessons directly; teachers use
  // their own portal, visitors see the lock.
  const session = await getSession();
  const canLearn = session?.role === "student" || session?.role === "admin";

  return (
    <main className="relative min-h-screen bg-space-black">
      <ScrollFX />
      <Navbar />
      <StarBackground />
      <div className="relative mx-auto max-w-5xl px-6 pb-28 pt-32">
        <Link href="/curriculum" className="font-mono text-[11px] uppercase tracking-[0.25em] text-star/40 hover:text-electric">
          ← All Grades
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: g.color }}>
              Rank · {g.codename}
            </p>
            <h1 className="mt-2 font-display text-4xl font-black uppercase tracking-wide text-star sm:text-5xl">
              Grade <span style={{ color: g.color }}>{g.grade}</span>
            </h1>
            <p className="mt-3 max-w-xl text-base text-star/55">{g.theme}</p>
          </div>
          <Link href="/register" className="btn-primary">Enroll for Grade {g.grade}</Link>
        </div>

        <div className="mt-14 space-y-12">
          {g.terms.map((term) => (
            <div key={term.id} data-reveal>
              <h2 className="font-display text-lg font-bold uppercase tracking-[0.2em] text-electric">
                {term.title}
              </h2>
              <div className="mt-5 space-y-5">
                {term.chapters.map((ch, ci) => (
                  <div key={ch.id} className="holo-panel overflow-hidden">
                    <div className="border-b border-white/5 p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-display text-base font-bold uppercase tracking-wider text-star">
                          <span className="mr-3 font-mono text-star/30">{String(ci + 1).padStart(2, "0")}</span>
                          {ch.title}
                        </h3>
                        {ch.hasWeeklyTest && (
                          <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gold">
                            Weekly Test
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-star/50">{ch.description}</p>
                    </div>
                    <ul className="divide-y divide-white/5">
                      {ch.lessons.map((l) => {
                        const meta = lessonTypeMeta[l.type];
                        return (
                          <li key={l.id} className="group flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-electric/5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-electric/20 bg-electric/5 text-sm text-electric">
                              {meta.icon}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-star/80 group-hover:text-star">{l.title}</p>
                              <p className="font-mono text-[10px] uppercase tracking-widest text-star/35">
                                {meta.label} · {l.duration} min
                              </p>
                            </div>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-gold/70">
                              +{l.xp} XP
                            </span>
                            {canLearn ? (
                              <Link
                                href={`/student/learn/${l.id}`}
                                className="rounded-lg border border-electric/30 bg-electric/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-electric transition-all hover:bg-electric/15 hover:shadow-holo"
                              >
                                ▶ Start
                              </Link>
                            ) : (
                              <Link
                                href={`/login?role=student&next=/student/learn/${l.id}`}
                                className="font-mono text-[10px] uppercase tracking-widest text-star/30 transition-colors group-hover:text-electric"
                              >
                                🔒 Login
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}

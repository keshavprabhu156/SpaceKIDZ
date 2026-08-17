import type { Metadata } from "next";
import PortalLayout from "@/layouts/PortalLayout";
import { studentSidebar } from "@/configs/portalSidebarConfig";
import SampleTest from "@/components/demo/SampleTest";
import { getSession } from "@/utils/session";

export const metadata: Metadata = { title: "Weekly Tests — Mission Assessments" };

const history = [
  { id: 1, title: "Weekly Test 3 — Anatomy of a Satellite", score: 85, date: "Last Friday" },
  { id: 2, title: "Weekly Test 2 — The Moon", score: 92, date: "2 weeks ago" },
  { id: 3, title: "Weekly Test 1 — Our Home Planet Earth", score: 78, date: "3 weeks ago" },
];

export default async function WeeklyTestsPage() {
  const session = await getSession();
  return (
    <PortalLayout
      title="Mission Control"
      role={`Student · Grade ${session?.grade ?? 6}`}
      userName={session?.name ?? "Cadet"}
      userId={session?.sub ?? "ISC-S-XXXX-XXXXXX"}
      nav={studentSidebar}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-electric/70">
        ▣ Assessment Bay
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-star sm:text-3xl">
        Weekly <span className="text-electric">Tests</span>
      </h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-star/40">
            This week · Types of Orbits · due Friday
          </p>
          <SampleTest />
        </div>

        <div className="space-y-5">
          <div className="holo-panel p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
              Past Results
            </p>
            <ul className="mt-4 space-y-3.5">
              {history.map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-star/80">{h.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-star/35">{h.date}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                      h.score >= 85 ? "border-gold/40 text-gold" : "border-electric/40 text-electric"
                    }`}
                  >
                    {h.score}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="holo-panel p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
              How Scoring Works
            </p>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-star/50">
              <li>▸ Instant evaluation with explanations for every question</li>
              <li>▸ 75%+ passes the chapter and awards its badge</li>
              <li>▸ XP counts toward your global leaderboard rank</li>
              <li>▸ Below 75%? You get targeted lesson recommendations and one retake</li>
            </ul>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

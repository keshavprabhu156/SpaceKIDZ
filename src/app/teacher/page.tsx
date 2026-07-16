import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import { getSession } from "@/utils/session";
import { teacherClasses, teacherResources, classPerformance } from "@/data/dashboard";

export const metadata: Metadata = { title: "Teacher Portal — Instructor Deck" };

const nav = [
  { label: "Instructor Deck", icon: "▣", href: "/teacher", active: true },
  { label: "Lesson Plans", icon: "◈", href: "/teacher#resources" },
  { label: "Question Banks", icon: "?", href: "/teacher#resources" },
  { label: "Class Analytics", icon: "◉", href: "/teacher#analytics" },
  { label: "Announcements", icon: "📡", href: "/teacher#classes" },
  { label: "Curriculum", icon: "⬡", href: "/curriculum" },
];

const typeIcon: Record<string, string> = {
  manual: "📘", plan: "🗺", questions: "❓", test: "▣", experiment: "⚗", slides: "🖥",
};

export default async function TeacherPortal() {
  const session = await getSession();
  const name = session?.name ?? "Instructor";
  // "Dr. Meera Nair" → "Dr. Meera"; "Meera Nair" → "Meera"
  const parts = name.split(" ");
  const shortName = parts[0].endsWith(".") ? parts.slice(0, 2).join(" ") : parts[0];
  return (
    <PortalShell
      title="Instructor Deck"
      role="Teacher · Certified Instructor"
      userName={session?.name ?? "Instructor"}
      userId={session?.sub ?? "ISC-T-XXXX-XXXXXX"}
      nav={nav}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-electric/70">
            ▣ Instructor Deck
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-star sm:text-3xl">
            Good orbit, <span className="text-electric">{shortName}</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary !py-2.5">📤 Upload Resource</button>
          <button className="btn-primary !py-2.5">+ Schedule Session</button>
        </div>
      </div>

      {/* ---------- Classes ---------- */}
      <div id="classes" className="mt-8 grid gap-5 lg:grid-cols-3">
        {teacherClasses.map((c) => (
          <div key={c.id} className="holo-panel p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-star">{c.name}</h3>
              <span className="rounded-full border border-electric/30 bg-electric/10 px-2.5 py-1 font-mono text-[10px] text-electric">
                {c.students} cadets
              </span>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-star/40">
                  <span>Avg Progress</span><span className="text-electric">{c.avgProgress}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-electric to-nebula-light" style={{ width: `${c.avgProgress}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-star/40">
                  <span>Avg Test Score</span><span className="text-gold">{c.avgScore}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold" style={{ width: `${c.avgScore}%` }} />
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 rounded-lg border border-white/10 py-2 font-mono text-[10px] uppercase tracking-widest text-star/60 hover:border-electric/40 hover:text-electric">
                Progress
              </button>
              <button className="flex-1 rounded-lg border border-white/10 py-2 font-mono text-[10px] uppercase tracking-widest text-star/60 hover:border-electric/40 hover:text-electric">
                Attendance
              </button>
              <button className="flex-1 rounded-lg border border-white/10 py-2 font-mono text-[10px] uppercase tracking-widest text-star/60 hover:border-electric/40 hover:text-electric">
                Reports
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Analytics + Resources ---------- */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div id="analytics" className="holo-panel p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
            Class Performance · Grade 6A · By Chapter
          </p>
          <div className="mt-6 flex h-52 items-end gap-4 px-2">
            {classPerformance.map((c) => (
              <div key={c.chapter} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="font-mono text-[10px] text-electric">{c.avg}%</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-galaxy via-electric/70 to-electric"
                  style={{ height: `${c.avg * 0.75}%` }}
                />
                <span className="font-mono text-[10px] uppercase text-star/40">{c.chapter}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg border border-gold/20 bg-gold/5 p-3 text-xs text-star/60">
            💡 Chapter 4 (Types of Orbits) scored lowest — the orbit simulator group activity is
            recommended before the next weekly test.
          </p>
        </div>

        <div id="resources" className="holo-panel p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
              Mission Resources
            </p>
            <span className="font-mono text-[10px] uppercase tracking-widest text-star/40">Grade 6 · Term 1</span>
          </div>
          <ul className="mt-4 divide-y divide-white/5">
            {teacherResources.map((r) => (
              <li key={r.id} className="group flex items-center gap-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-electric/20 bg-electric/5 text-base">
                  {typeIcon[r.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-star/80">{r.title}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-star/35">{r.size}</p>
                </div>
                <button className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-star/50 transition-all group-hover:border-electric/50 group-hover:text-electric">
                  ⤓ Download
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PortalShell>
  );
}

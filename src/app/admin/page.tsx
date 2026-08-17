import type { Metadata } from "next";
import PortalLayout from "@/layouts/PortalLayout";
import { adminSidebar } from "@/configs/portalSidebarConfig";
import Flag from "@/components/common/Flag";
import { getSession } from "@/utils/session";
import { adminStats, recentSignups } from "@/data/dashboard";
import { countries } from "@/data/global";

export const metadata: Metadata = { title: "Admin — Mission Director Console" };

const statCards = [
  { label: "Total Students", value: adminStats.students.toLocaleString(), accent: "text-electric" },
  { label: "Teachers", value: adminStats.teachers.toLocaleString(), accent: "text-star" },
  { label: "Schools", value: String(adminStats.schools), accent: "text-nebula-soft" },
  { label: "Countries", value: String(adminStats.countries), accent: "text-star" },
  { label: "Active Today", value: adminStats.activeToday.toLocaleString(), accent: "text-emerald-300" },
  { label: "Tests This Week", value: adminStats.testsThisWeek.toLocaleString(), accent: "text-gold" },
];

const cmsModules = [
  { icon: "☰", title: "Curriculum Management", desc: "Terms, chapters, lessons, media & 3D assets" },
  { icon: "?", title: "Question Bank", desc: "9 question types · tagging · difficulty calibration" },
  { icon: "🎮", title: "Game Management", desc: "Enable per grade · XP tuning · leaderboards" },
  { icon: "🏅", title: "Certificates", desc: "Templates, issuing rules & verification registry" },
  { icon: "📡", title: "Notifications", desc: "Announcements by country, school, grade or class" },
  { icon: "⬆", title: "Content Upload", desc: "Bulk import curriculum, media & question sets" },
];

export default async function AdminPanel() {
  const session = await getSession();
  return (
    <PortalLayout
      title="Director Console"
      role="Administrator"
      userName={session?.name ?? "Mission Director"}
      userId={session?.sub ?? "ISC-A-XXXX-XXXXXX"}
      nav={adminSidebar}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-electric/70">
            ◉ Mission Director Console
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-star sm:text-3xl">
            Global <span className="text-electric">Operations</span>
          </h1>
        </div>
        <button className="btn-primary !py-2.5">Generate Weekly Report</button>
      </div>

      {/* ---------- Stats ---------- */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {statCards.map((s) => (
          <div key={s.label} className="holo-panel p-5">
            <p className={`font-display text-2xl font-black ${s.accent}`}>{s.value}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-star/40">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ---------- Signups + Countries ---------- */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div id="students" className="holo-panel p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">Recent Registrations</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="font-mono text-[9px] uppercase tracking-[0.2em] text-star/35">
                  <th className="pb-3 pr-4">Student ID</th>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Grade</th>
                  <th className="pb-3">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentSignups.map((r) => (
                  <tr key={r.id} className="text-star/70 hover:bg-white/[0.02]">
                    <td className="py-3 pr-4 font-mono text-[11px] text-electric/70">{r.id}</td>
                    <td className="py-3 pr-4">{r.name}</td>
                    <td className="py-3 pr-4">{r.grade}</td>
                    <td className="py-3">
                      <span className="flex items-center gap-2">
                        <Flag code={r.countryCode} size={20} /> {r.countryName}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div id="countries" className="holo-panel p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">Enrollment by Country</p>
          <div className="mt-5 space-y-3">
            {countries.slice(0, 6).map((c) => {
              const max = countries[0].students;
              return (
                <div key={c.code} className="flex items-center gap-3">
                  <Flag code={c.code} size={22} />
                  <span className="w-24 truncate text-xs text-star/70">{c.name}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-galaxy to-electric"
                      style={{ width: `${(c.students / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-14 text-right font-mono text-[10px] text-star/50">
                    {c.students.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- CMS modules ---------- */}
      <div id="cms" className="mt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">Management Modules</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cmsModules.map((m) => (
            <button
              key={m.title}
              className="holo-panel group p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-holo-strong"
            >
              <span className="text-2xl">{m.icon}</span>
              <p className="mt-3 font-display text-xs font-bold uppercase tracking-wider text-star group-hover:text-electric">
                {m.title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-star/45">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

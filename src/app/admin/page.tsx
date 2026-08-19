import type { Metadata } from "next";
import Link from "next/link";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import { adminSidebar } from "@/configs/portalSidebarConfig";
import Flag from "@/components/common/Flag";
import { getSession } from "@/utils/session";
import { getPlatformOverview } from "@/services/adminService";

export const metadata: Metadata = { title: "Admin console" };
export const dynamic = "force-dynamic";

export default async function AdminPanel() {
  const session = await getSession();
  const overview = await getPlatformOverview();

  const stats = [
    { label: "Schools", value: overview.schools },
    { label: "Teachers", value: overview.teachers },
    { label: "Students", value: overview.students },
    { label: "Classes", value: overview.classes },
    { label: "Active (24h)", value: overview.activeLast24h },
    { label: "Tests this week", value: overview.testsThisWeek },
  ];

  return (
    <PortalLayout
      title="Admin console"
      role="Administrator"
      roleValue="admin"
      userName={session?.name ?? "Administrator"}
      userId={session?.sub ?? "—"}
      nav={adminSidebar}
    >
      <PortalPageHeader eyebrow="Platform" title="Global operations" />

      {/* ---------- KPI row ---------- */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-tile">
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* ---------- Schools ---------- */}
      <section id="schools" className="mt-8 scroll-mt-24">
        <h2 className="text-sm font-semibold text-star">Schools</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-star/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-star/10 bg-white/[0.02] text-left text-xs text-star/45">
                <th className="px-4 py-2.5 font-medium">School</th>
                <th className="px-4 py-2.5 font-medium">City</th>
                <th className="px-4 py-2.5 font-medium">Teachers</th>
                <th className="px-4 py-2.5 font-medium">Students</th>
                <th className="px-4 py-2.5 font-medium">Classes</th>
              </tr>
            </thead>
            <tbody>
              {overview.schoolsList.map((s) => (
                <tr key={s.id} className="border-b border-star/[0.06] last:border-0">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/admin/schools/${s.id}`} className="text-star hover:text-electric hover:underline">
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-star/60">{s.city ?? "—"}</td>
                  <td className="px-4 py-3 text-star/70">{s.teacherCount}</td>
                  <td className="px-4 py-3 text-star/70">{s.studentCount}</td>
                  <td className="px-4 py-3 text-star/70">{s.classCount}</td>
                </tr>
              ))}
              {overview.schoolsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-star/45">
                    No schools yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- Signups + Countries ---------- */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section id="signups" className="scroll-mt-24">
          <h2 className="text-sm font-semibold text-star">Recent registrations</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-star/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-star/10 bg-white/[0.02] text-left text-xs text-star/45">
                  <th className="px-4 py-2.5 font-medium">Student</th>
                  <th className="px-4 py-2.5 font-medium">Grade</th>
                  <th className="px-4 py-2.5 font-medium">Country</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentSignups.map((r) => (
                  <tr key={r.id} className="border-b border-star/[0.06] last:border-0">
                    <td className="px-4 py-3">
                      <p className="text-star/85">{r.name}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-star/35">{r.id}</p>
                    </td>
                    <td className="px-4 py-3 text-star/70">{r.grade ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-star/70">
                        <Flag code={r.countryCode} size={18} /> {r.countryName}
                      </span>
                    </td>
                  </tr>
                ))}
                {overview.recentSignups.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-star/45">
                      No registrations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="countries" className="scroll-mt-24">
          <h2 className="text-sm font-semibold text-star">Enrollment by country</h2>
          <p className="mt-1 text-xs text-star/45">
            {overview.countriesRepresented} of {overview.enrollmentByCountry.length} countries have students enrolled.
          </p>
          <div className="mt-3 rounded-xl border border-star/10 p-5">
            <div className="space-y-3">
              {overview.enrollmentByCountry.slice(0, 8).map((c) => {
                const max = Math.max(1, overview.enrollmentByCountry[0]?.students ?? 1);
                return (
                  <div key={c.code} className="flex items-center gap-3">
                    <Flag code={c.code} size={20} />
                    <span className="w-28 truncate text-xs text-star/70">{c.name}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-electric"
                        style={{ width: `${(c.students / max) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-star/50">{c.students}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </PortalLayout>
  );
}

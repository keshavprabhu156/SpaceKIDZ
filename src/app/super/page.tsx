import type { Metadata } from "next";
import Link from "next/link";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import { superAdminSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import { getPlatformOverview } from "@/services/adminService";

export const metadata: Metadata = { title: "Super admin" };
export const dynamic = "force-dynamic";

const portals = [
  { label: "Admin console", href: "/admin", desc: "Platform-wide operations, schools, registrations" },
  { label: "Teacher portal", href: "/teacher", desc: "Classes, roster health, chapter performance" },
  { label: "Student portal", href: "/student", desc: "XP, tests, leaderboard, badges" },
];

export default async function SuperAdminConsole() {
  const session = await getSession();
  const overview = await getPlatformOverview();

  const stats = [
    { label: "Schools", value: overview.schools },
    { label: "Teachers", value: overview.teachers },
    { label: "Students", value: overview.students },
    { label: "Classes", value: overview.classes },
    { label: "Countries active", value: overview.countriesRepresented },
    { label: "Tests this week", value: overview.testsThisWeek },
  ];

  return (
    <PortalLayout
      title="Super admin"
      role="Super admin · Full access"
      roleValue="super_admin"
      userName={session?.name ?? "Founder"}
      userId={session?.sub ?? "—"}
      nav={superAdminSidebar}
    >
      <PortalPageHeader eyebrow="Every school · Every portal" title="Platform overview" />
      <p className="mt-2 max-w-xl text-sm text-star/55">
        You have full access — this account can view the admin console and every school&apos;s
        teacher and student portals without restriction.
      </p>

      {/* ---------- KPI row ---------- */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-tile">
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* ---------- Jump to a portal ---------- */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold text-star">Jump to a portal</h2>
        <p className="mt-1 text-xs text-star/45">
          Opens the real portal, logged in as this account — not a simulated view.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {portals.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="card-edu block !p-5 hover:border-electric/40"
            >
              <p className="font-display text-base font-semibold text-star">{p.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-star/50">{p.desc}</p>
              <span className="mt-3 inline-block text-xs text-electric">Open →</span>
            </Link>
          ))}
        </div>
      </section>

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
            </tbody>
          </table>
        </div>
      </section>
    </PortalLayout>
  );
}

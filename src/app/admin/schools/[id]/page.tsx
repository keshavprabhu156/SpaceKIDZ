import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import { adminSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import { getSchoolDetail } from "@/services/adminService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const school = await getSchoolDetail(id);
  return { title: school ? school.name : "School" };
}

export const dynamic = "force-dynamic";

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const school = await getSchoolDetail(id);
  if (!school) notFound();

  return (
    <PortalLayout
      title="School"
      role="Administrator"
      roleValue="admin"
      userName={session?.name ?? "Administrator"}
      userId={session?.sub ?? "—"}
      nav={adminSidebar}
    >
      <PortalPageHeader
        eyebrow={[school.city, school.countryName].filter(Boolean).join(", ")}
        title={school.name}
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="stat-tile">
          <p className="stat-label">Teachers</p>
          <p className="stat-value">{school.teachers.length}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Classes</p>
          <p className="stat-value">{school.classes.length}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Students</p>
          <p className="stat-value">{school.students.length}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Academic year</p>
          <p className="stat-value">{school.academicYear ?? "—"}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-star/40">
        Teacher join code: <span className="font-mono text-star/60">{school.teacherCode}</span>
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold text-star">Teachers</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-star/10">
            <ul className="divide-y divide-star/[0.06]">
              {school.teachers.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-star/85">{t.name}</p>
                    <p className="text-xs text-star/40">{t.email}</p>
                  </div>
                  <span className="shrink-0 text-xs text-star/45">
                    {t.classCount} class{t.classCount !== 1 ? "es" : ""}
                  </span>
                </li>
              ))}
              {school.teachers.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-star/45">No teachers yet.</li>
              )}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-star">Classes</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-star/10">
            <ul className="divide-y divide-star/[0.06]">
              {school.classes.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-star/85">{c.name}</p>
                    <p className="text-xs text-star/40">Taught by {c.teacherName}</p>
                  </div>
                  <span className="shrink-0 text-xs text-star/45">{c.studentCount} students</span>
                </li>
              ))}
              {school.classes.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-star/45">No classes yet.</li>
              )}
            </ul>
          </div>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-star">Students</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-star/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-star/10 bg-white/[0.02] text-left text-xs text-star/45">
                <th className="px-4 py-2 font-medium">Student</th>
                <th className="px-4 py-2 font-medium">Grade</th>
                <th className="px-4 py-2 font-medium">Class</th>
                <th className="px-4 py-2 font-medium">XP</th>
              </tr>
            </thead>
            <tbody>
              {school.students.map((s) => (
                <tr key={s.id} className="border-b border-star/[0.06] last:border-0">
                  <td className="px-4 py-2.5 font-medium text-star">{s.name}</td>
                  <td className="px-4 py-2.5 text-star/70">{s.grade}</td>
                  <td className="px-4 py-2.5 text-star/70">{s.className ?? "—"}</td>
                  <td className="px-4 py-2.5 text-star/70">{s.xp.toLocaleString()}</td>
                </tr>
              ))}
              {school.students.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-star/45">
                    No students yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PortalLayout>
  );
}

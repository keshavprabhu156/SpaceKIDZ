import { prisma } from "./prisma";
import type {
  EnquiryRow,
  PlatformOverview,
  SchoolDetail,
  StudentDirectoryRow,
  TeacherDirectoryRow,
} from "@/types/admin";

/**
 * SERVER-ONLY platform-wide queries — used by /admin and /super.
 * Unlike teacherService, nothing here is scoped: this IS the "see everything"
 * layer, so it must only ever be called from a route already gated to
 * admin/super_admin by middleware. Never call this from a teacher- or
 * student-facing page.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export async function getPlatformOverview(): Promise<PlatformOverview> {
  const [schools, teachers, students, classes, countries] = await Promise.all([
    prisma.school.count(),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.student.count(),
    prisma.class.count(),
    prisma.country.findMany(),
  ]);

  const countryMap = new Map(countries.map((c) => [c.code, c.name]));

  const now = Date.now();
  const [activeLast24h, testsThisWeek] = await Promise.all([
    prisma.student.count({ where: { lastActiveAt: { gte: new Date(now - DAY_MS) } } }),
    prisma.testAttempt.count({ where: { createdAt: { gte: new Date(now - 7 * DAY_MS) } } }),
  ]);

  const recentStudents = await prisma.student.findMany({
    take: 5,
    orderBy: { user: { createdAt: "desc" } },
    include: { user: true },
  });
  const recentSignups = recentStudents.map((s) => ({
    id: s.userId,
    name: s.user.name,
    grade: s.grade,
    countryCode: s.countryCode,
    countryName: countryMap.get(s.countryCode) ?? s.countryCode,
    createdAt: s.user.createdAt.toISOString(),
  }));

  const byCountry = await prisma.student.groupBy({
    by: ["countryCode"],
    _count: { _all: true },
  });
  const countByCode = new Map(byCountry.map((r) => [r.countryCode, r._count._all]));
  const enrollmentByCountry = countries
    .map((c) => ({ code: c.code, name: c.name, students: countByCode.get(c.code) ?? 0 }))
    .sort((a, b) => b.students - a.students);
  const countriesRepresented = enrollmentByCountry.filter((c) => c.students > 0).length;

  const schoolRows = await prisma.school.findMany({
    include: {
      teachers: true,
      students: true,
      classes: true,
    },
  });
  const schoolsList = schoolRows.map((s) => ({
    id: s.id,
    name: s.name,
    city: s.city,
    teacherCount: s.teachers.length,
    studentCount: s.students.length,
    classCount: s.classes.length,
  }));

  return {
    schools,
    teachers,
    students,
    classes,
    countriesRepresented,
    activeLast24h,
    testsThisWeek,
    recentSignups,
    enrollmentByCountry,
    schoolsList,
  };
}

/** Every teacher on the platform, with their school and load. */
export async function getTeacherDirectory(): Promise<TeacherDirectoryRow[]> {
  const teachers = await prisma.teacher.findMany({
    include: { user: true, school: true, classes: { include: { students: true } } },
    orderBy: { user: { name: "asc" } },
  });

  return teachers.map((t) => ({
    id: t.userId,
    name: t.user.name,
    email: t.user.email,
    schoolId: t.schoolId,
    schoolName: t.school?.name ?? "Unassigned",
    classCount: t.classes.length,
    studentCount: t.classes.reduce((n, c) => n + c.students.length, 0),
  }));
}

/** Every student on the platform, across every school. */
export async function getStudentDirectory(): Promise<StudentDirectoryRow[]> {
  const [students, countries] = await Promise.all([
    prisma.student.findMany({
      include: { user: true, class: true, school: true },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.country.findMany(),
  ]);
  const countryMap = new Map(countries.map((c) => [c.code, c.name]));

  return students.map((s) => ({
    id: s.userId,
    name: s.user.name,
    email: s.user.email,
    grade: s.grade,
    className: s.class ? `Grade ${s.class.grade} · ${s.class.name}` : null,
    schoolName: s.school?.name ?? s.schoolName,
    countryName: countryMap.get(s.countryCode) ?? s.countryCode,
    xp: s.xp,
    lastActiveAt: s.lastActiveAt?.toISOString() ?? null,
  }));
}

/** Full detail for one school — its teachers, classes and students. */
export async function getSchoolDetail(schoolId: string): Promise<SchoolDetail | null> {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      country: true,
      teachers: { include: { user: true, classes: true } },
      classes: { include: { teacher: { include: { user: true } }, students: true } },
      students: { include: { user: true, class: true } },
    },
  });
  if (!school) return null;

  return {
    id: school.id,
    name: school.name,
    city: school.city,
    countryName: school.country.name,
    academicYear: school.academicYear,
    teacherCode: school.teacherCode,
    teachers: school.teachers.map((t) => ({
      id: t.userId,
      name: t.user.name,
      email: t.user.email,
      classCount: t.classes.length,
    })),
    classes: school.classes.map((c) => ({
      id: c.id,
      name: `Grade ${c.grade} · ${c.name}`,
      grade: c.grade,
      teacherName: c.teacher.user.name,
      studentCount: c.students.length,
    })),
    students: school.students.map((s) => ({
      id: s.userId,
      name: s.user.name,
      grade: s.grade,
      className: s.class ? `Grade ${s.class.grade} · ${s.class.name}` : null,
      xp: s.xp,
    })),
  };
}

/** School/partner enquiries submitted through the public contact form. */
export async function getEnquiries(): Promise<EnquiryRow[]> {
  const rows = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    organization: r.organization,
    message: r.message,
    handled: r.handled,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function setEnquiryHandled(id: string, handled: boolean) {
  await prisma.enquiry.update({ where: { id }, data: { handled } });
}

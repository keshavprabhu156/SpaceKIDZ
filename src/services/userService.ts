/**
 * User repository.
 *
 * PRODUCTION: uses Prisma queries against PostgreSQL.
 * Passwords are encrypted using bcryptjs.
 */
import * as bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { countries } from "@/data/global";
import type { Role, StudentProfile, User } from "@/types/user";

// Re-exported so existing call sites importing these from the service keep working.
export type { StudentProfile, User };

// Explicit, exhaustive mapping in both directions — deliberately NOT a
// fallback/default. An unrecognized value throws instead of silently
// becoming "admin", which is what the old two-branch version did the moment
// a role other than STUDENT/TEACHER/ADMIN existed in the database.
function toAppRole(dbRole: string): Role {
  switch (dbRole) {
    case "STUDENT":
      return "student";
    case "TEACHER":
      return "teacher";
    case "SCHOOL_ADMIN":
      return "school_admin";
    case "ADMIN":
      return "admin";
    case "SUPER_ADMIN":
      return "super_admin";
    default:
      throw new Error(`Unknown role from database: ${dbRole}`);
  }
}

function toPrismaRole(role: Role) {
  switch (role) {
    case "student":
      return "STUDENT";
    case "teacher":
      return "TEACHER";
    case "school_admin":
      return "SCHOOL_ADMIN";
    case "admin":
      return "ADMIN";
    case "super_admin":
      return "SUPER_ADMIN";
  }
}

export async function findByEmail(email: string): Promise<User | undefined> {
  const dbUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: {
      student: true,
    },
  });

  if (!dbUser) return undefined;

  let profile: StudentProfile | undefined = undefined;
  if (dbUser.student) {
    const countryName = countries.find((c) => c.code === dbUser.student!.countryCode)?.name || "India";
    profile = {
      fullName: dbUser.name,
      dateOfBirth: dbUser.student.dateOfBirth.toISOString().split("T")[0],
      gender: dbUser.student.gender,
      grade: dbUser.student.grade,
      schoolName: dbUser.student.schoolName,
      schoolId: dbUser.student.schoolId || undefined,
      phone: dbUser.student.phone,
      parentName: dbUser.student.parentName,
      parentContact: dbUser.student.parentContact,
      city: dbUser.student.city,
      state: dbUser.student.state,
      country: countryName,
      language: dbUser.student.language,
      timezone: dbUser.student.timezone,
    };
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    passwordHash: dbUser.passwordHash,
    salt: "",
    role: toAppRole(dbUser.role),
    name: dbUser.name,
    grade: dbUser.student?.grade || undefined,
    profile,
    createdAt: dbUser.createdAt.toISOString(),
  };
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export async function createStudent(input: {
  email: string;
  password: string;
  profile: StudentProfile;
}): Promise<User> {
  const email = input.email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(input.password, 10);

  // Map country name to ISO 2-letter country code
  const countryCode = countries.find((c) => c.name === input.profile.country)?.code || "IN";

  // Generate a sequential student ID (SC-S-YYYY-XXXXXX)
  const currentYear = new Date().getFullYear();
  const count = await prisma.student.count();
  const nextSeq = String(count + 1).padStart(6, "0");
  const studentId = `ISC-S-${currentYear}-${nextSeq}`;

  const dbUser = await prisma.$transaction(async (tx) => {
    // Check if email already exists
    const existing = await tx.user.findUnique({ where: { email } });
    if (existing) throw new Error("An account with this email already exists");

    return tx.user.create({
      data: {
        id: studentId,
        email,
        passwordHash,
        role: "STUDENT",
        name: input.profile.fullName,
        student: {
          create: {
            dateOfBirth: new Date(input.profile.dateOfBirth),
            gender: input.profile.gender,
            grade: input.profile.grade,
            schoolName: input.profile.schoolName,
            schoolId: input.profile.schoolId || null,
            phone: input.profile.phone,
            parentName: input.profile.parentName,
            parentContact: input.profile.parentContact,
            city: input.profile.city,
            state: input.profile.state,
            countryCode,
            language: input.profile.language,
            timezone: input.profile.timezone,
          },
        },
      },
      include: {
        student: true,
      },
    });
  });

  return {
    id: dbUser.id,
    email: dbUser.email,
    passwordHash: dbUser.passwordHash,
    salt: "",
    role: "student",
    name: dbUser.name,
    grade: dbUser.student?.grade || undefined,
    profile: input.profile,
    createdAt: dbUser.createdAt.toISOString(),
  };
}

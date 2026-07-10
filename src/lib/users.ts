/**
 * User repository.
 *
 * DEV: in-memory store seeded with demo accounts (survives hot reloads via
 * globalThis). PRODUCTION: replace the internals with Prisma queries against
 * PostgreSQL — the exported function signatures are the contract and match
 * the planned Prisma schema (see prisma/schema.prisma).
 *
 * Passwords are salted-SHA-256 here for zero native deps in dev; swap for
 * bcrypt/argon2 when the Prisma backend lands.
 */
import { createHash, randomBytes } from "crypto";
import type { Role } from "./auth";

export interface StudentProfile {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  grade: number;
  schoolName: string;
  schoolId?: string;
  phone: string;
  parentName: string;
  parentContact: string;
  city: string;
  state: string;
  country: string;
  language: string;
  timezone: string;
}

export interface User {
  id: string; // Student/Teacher/Admin ID, e.g. ISC-S-2026-000123
  email: string;
  passwordHash: string;
  salt: string;
  role: Role;
  name: string;
  grade?: number;
  profile?: StudentProfile;
  createdAt: string;
}

type Store = { users: Map<string, User>; counter: number };

const g = globalThis as unknown as { __iscUserStore?: Store };

function hash(password: string, salt: string) {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

function seed(): Store {
  const users = new Map<string, User>();
  const mk = (id: string, email: string, name: string, role: Role, grade?: number): User => {
    const salt = "demo";
    return {
      id,
      email,
      salt,
      passwordHash: hash("space123", salt),
      role,
      name,
      grade,
      createdAt: new Date().toISOString(),
    };
  };
  // Demo accounts — password for all: space123
  users.set("student@demo.isc", mk("ISC-S-2026-000001", "student@demo.isc", "Alex Sharma", "student", 6));
  users.set("teacher@demo.isc", mk("ISC-T-2026-000001", "teacher@demo.isc", "Dr. Meera Nair", "teacher"));
  users.set("admin@demo.isc", mk("ISC-A-2026-000001", "admin@demo.isc", "Mission Director", "admin"));
  return { users, counter: 2 };
}

function store(): Store {
  if (!g.__iscUserStore) g.__iscUserStore = seed();
  return g.__iscUserStore;
}

export function findByEmail(email: string): User | undefined {
  return store().users.get(email.toLowerCase().trim());
}

export function verifyPassword(user: User, password: string): boolean {
  return user.passwordHash === hash(password, user.salt);
}

export function nextStudentId(): string {
  const s = store();
  const n = String(s.counter++).padStart(6, "0");
  return `ISC-S-${new Date().getFullYear()}-${n}`;
}

export function createStudent(input: {
  email: string;
  password: string;
  profile: StudentProfile;
}): User {
  const s = store();
  const email = input.email.toLowerCase().trim();
  if (s.users.has(email)) throw new Error("An account with this email already exists");
  const salt = randomBytes(8).toString("hex");
  const user: User = {
    id: nextStudentId(),
    email,
    salt,
    passwordHash: hash(input.password, salt),
    role: "student",
    name: input.profile.fullName,
    grade: input.profile.grade,
    profile: input.profile,
    createdAt: new Date().toISOString(),
  };
  s.users.set(email, user);
  return user;
}

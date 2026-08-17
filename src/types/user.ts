export type Role = "student" | "teacher" | "admin";

/** Decoded JWT session payload stored in the `isc_session` cookie. */
export interface SessionPayload {
  sub: string; // user id (e.g. ISC-S-2026-000123)
  name: string;
  role: Role;
  grade?: number;
  [key: string]: unknown;
}

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
  salt: string; // Empty for bcrypt (built-in salt); kept for legacy schema compatibility
  role: Role;
  name: string;
  grade?: number;
  profile?: StudentProfile;
  createdAt: string;
}

/** Credentials posted to /api/auth/login */
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

/** Payload posted to /api/auth/register */
export interface RegisterPayload {
  email: string;
  password: string;
  profile: StudentProfile;
}

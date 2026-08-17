import type { RegisterPayload, StudentProfile } from "@/types/user";

/**
 * Auth validation.
 *
 * Dependency-free validators (PRM uses zod; zod is not installed here, so the
 * same shape is expressed in plain TypeScript). Each validator returns an
 * error string, or null when the input is valid.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;
export const MIN_GRADE = 4;
export const MAX_GRADE = 10;

export const REQUIRED_PROFILE_FIELDS: (keyof StudentProfile)[] = [
  "fullName",
  "dateOfBirth",
  "gender",
  "grade",
  "schoolName",
  "phone",
  "parentName",
  "parentContact",
  "city",
  "state",
  "country",
  "language",
  "timezone",
];

export function validateEmail(email?: string): string | null {
  if (!email || !EMAIL_RE.test(email)) return "A valid email is required";
  return null;
}

export function validatePassword(password?: string): string | null {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}

export function validateLogin(input: {
  email?: string;
  password?: string;
}): string | null {
  if (!input.email || !input.password) return "Email and password are required";
  return null;
}

export function validateGrade(grade: number): string | null {
  if (Number.isNaN(grade) || grade < MIN_GRADE || grade > MAX_GRADE) {
    return `Grade must be between ${MIN_GRADE} and ${MAX_GRADE}`;
  }
  return null;
}

export function validateStudentProfile(profile?: StudentProfile): string | null {
  if (!profile) return "Profile is required";

  for (const field of REQUIRED_PROFILE_FIELDS) {
    if (profile[field] === undefined || profile[field] === "") {
      return `Missing field: ${field}`;
    }
  }
  return validateGrade(Number(profile.grade));
}

/** Full registration payload check, in the order the API reports errors. */
export function validateRegistration(
  body: Partial<RegisterPayload> | null
): string | null {
  if (!body) return "Invalid request";
  return (
    validateEmail(body.email) ??
    validatePassword(body.password) ??
    validateStudentProfile(body.profile)
  );
}

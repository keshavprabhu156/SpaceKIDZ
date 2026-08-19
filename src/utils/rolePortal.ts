import type { Role } from "@/types/user";

/**
 * Single source of truth for "where does this role live".
 * Used by: middleware (redirect-on-denial), the login form (post-login
 * redirect), and nowhere else — don't hardcode `/${role}` anywhere else.
 */
export const PORTAL_PATH: Record<Role, string> = {
  student: "/student",
  teacher: "/teacher",
  school_admin: "/", // no dedicated portal yet — falls back to the homepage
  admin: "/admin",
  super_admin: "/super",
};

/**
 * Access rank per role — higher can view any route owned by a lower rank.
 * student/teacher/school_admin are peers (0): none can see another's portal.
 * admin (2) sees everything except /super. super_admin (3) sees everything.
 */
export const ROLE_RANK: Record<Role, number> = {
  student: 0,
  teacher: 0,
  school_admin: 0,
  admin: 2,
  super_admin: 3,
};

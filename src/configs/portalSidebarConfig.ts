import type { NavItem } from "@/types/nav";

/**
 * Sidebar navigation for each portal (mirrors PRM's adminSidebarConfig).
 *
 * Every item here is a genuinely separate PAGE, never a same-page anchor
 * (e.g. "/admin#schools"). An anchor link to a section already visible on
 * screen just scrolls nowhere — it reads as broken, not as navigation. If a
 * destination doesn't have its own route yet, it doesn't belong in the
 * sidebar; a dashboard section that isn't a distinct page just stays part of
 * that page's own content instead. Highlighting is derived from the current
 * URL by PortalSidebar — don't add an `active` flag here, it goes stale.
 */

export const studentSidebar: NavItem[] = [
  { label: "Mission Control", icon: "◉", href: "/student" },
  { label: "My Curriculum", icon: "◈", href: "/student/curriculum" },
  { label: "Weekly Tests", icon: "▣", href: "/student/tests" },
  { label: "Game Deck", icon: "🎮", href: "/student/games" },
];

export const teacherSidebar: NavItem[] = [
  { label: "Overview", icon: "◉", href: "/teacher" },
  { label: "Classes", icon: "◈", href: "/teacher/classes" },
  { label: "Curriculum", icon: "⬡", href: "/teacher/curriculum" },
];

export const adminSidebar: NavItem[] = [
  { label: "Overview", icon: "◉", href: "/admin" },
  { label: "Teachers", icon: "◈", href: "/admin/teachers" },
  { label: "Students", icon: "🎓", href: "/admin/students" },
  { label: "Enquiries", icon: "✉", href: "/admin/enquiries" },
  { label: "Curriculum", icon: "☰", href: "/admin/curriculum" },
];

export const superAdminSidebar: NavItem[] = [
  { label: "Platform overview", icon: "◉", href: "/super" },
  { label: "Admin console", icon: "▣", href: "/admin" },
  { label: "Teacher portal", icon: "◈", href: "/teacher" },
  { label: "Student portal", icon: "🎓", href: "/student" },
];

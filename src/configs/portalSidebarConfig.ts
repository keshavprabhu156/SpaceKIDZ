import type { NavItem } from "@/types/nav";

/** Sidebar navigation for each portal (mirrors PRM's adminSidebarConfig). */

export const studentSidebar: NavItem[] = [
  { label: "Mission Control", icon: "◉", href: "/student", active: true },
  { label: "My Curriculum", icon: "◈", href: "/curriculum" },
  { label: "Weekly Tests", icon: "▣", href: "/student/tests" },
  { label: "Game Deck", icon: "🎮", href: "/games" },
  { label: "Achievements", icon: "🏅", href: "/student#achievements" },
  { label: "Leaderboard", icon: "⬆", href: "/student#leaderboard" },
];

export const teacherSidebar: NavItem[] = [
  { label: "Instructor Deck", icon: "▣", href: "/teacher", active: true },
  { label: "Lesson Plans", icon: "◈", href: "/teacher#resources" },
  { label: "Question Banks", icon: "?", href: "/teacher#resources" },
  { label: "Class Analytics", icon: "◉", href: "/teacher#analytics" },
  { label: "Announcements", icon: "📡", href: "/teacher#classes" },
  { label: "Curriculum", icon: "⬡", href: "/curriculum" },
];

export const adminSidebar: NavItem[] = [
  { label: "Overview", icon: "◉", href: "/admin", active: true },
  { label: "Students", icon: "◈", href: "/admin#students" },
  { label: "Teachers", icon: "▣", href: "/admin#students" },
  { label: "Schools", icon: "⬡", href: "/admin#countries" },
  { label: "Countries", icon: "🌐", href: "/admin#countries" },
  { label: "Curriculum CMS", icon: "☰", href: "/admin#cms" },
  { label: "Question Bank", icon: "?", href: "/admin#cms" },
  { label: "Games", icon: "🎮", href: "/admin#cms" },
];

import type { NavLink } from "@/types/nav";

/** Public site header links. */
export const publicNavLinks: NavLink[] = [
  { href: "/#how", label: "How it works" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/#audience", label: "For schools" },
  { href: "/games", label: "Games" },
  { href: "/demo", label: "Live demo" },
  { href: "/#faq", label: "FAQ" },
];

/** Footer link groups. */
export const footerNavLinks: NavLink[] = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/demo", label: "Live demo" },
  { href: "/games", label: "Games" },
  { href: "/register", label: "Create an account" },
  { href: "/login", label: "Teacher portal" },
];

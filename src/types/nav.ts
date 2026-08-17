/** A link in the public site header. */
export interface NavLink {
  href: string;
  label: string;
}

/** A link in a portal sidebar. */
export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

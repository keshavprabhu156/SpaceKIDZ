/** A link in the public site header. */
export interface NavLink {
  href: string;
  label: string;
}

/** A link in a portal sidebar. Highlighting is derived from the current URL
 *  (see PortalSidebar), not stored here — a hardcoded flag goes stale the
 *  moment a second page exists in the same portal. */
export interface NavItem {
  label: string;
  icon: string;
  href: string;
}

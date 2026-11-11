export const navItems = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Projects", href: "/projects" },
  { title: "Site Reports", href: "/site-reports" },
  { title: "Construction", href: "/construction" },
  { title: "Project Consultants", href: "/project-consultants" },
  { title: "Design Portal", href: "/design-portal" },
  { title: "COO Operations", href: "/coo-operations" },
  { title: "Stores", href: "/stores" },
  { title: "Financials", href: "/financials" },
  { title: "Staff & KPI", href: "/staff-kpi" },
  { title: "Board Analysis", href: "/board-analysis" },
  { title: "Announcements", href: "/announcements" },
  // { title: "Users", href: "/users" },
]

/** Account pages inside the dashboard shell that aren't sidebar links. */
export const accountItems = [{ title: "Profile", href: "/profile" }]

/**
 * Detail pages whose header title differs from their section's, e.g.
 * `/projects/[projectId]` shows "Project" rather than "Projects".
 */
export const detailPageTitles = [{ parentHref: "/projects", title: "Project" }]

/** Every page in the dashboard shell, used for header titles and route guards. */
export const dashboardPages = [...navItems, ...accountItems]

export function isNavItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

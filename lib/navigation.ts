import { isClientUser, type AuthUser } from "@/lib/types/auth"

export const navItems = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Projects", href: "/projects" },
  { title: "Clients", href: "/clients" },
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
  { title: "Users", href: "/users" },
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

/** The only sections a client account can open, including their detail pages. */
const clientSections = ["/projects"]

/** Where a signed-in user lands after login or when a page is off limits. */
export function getHomeRoute(user: AuthUser) {
  return isClientUser(user) ? "/projects" : "/dashboard"
}

/** Sidebar links the user is allowed to see. */
export function getNavItems(user: AuthUser | null) {
  if (!user || !isClientUser(user)) return navItems
  return navItems.filter((item) => clientSections.includes(item.href))
}

/** Whether the user may open a dashboard page. Staff can open every page. */
export function canAccessPage(user: AuthUser, pathname: string) {
  if (!isClientUser(user)) return true
  return clientSections.some((href) => isNavItemActive(pathname, href))
}

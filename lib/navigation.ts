import {
  isClientUser,
  mustChangePassword,
  type AuthUser,
} from "@/lib/types/auth"

/**
 * Where a staff account on a temporary password sets its own. It sits in the
 * auth layout but needs a session, so it's neither public nor in the sidebar.
 */
export const CHANGE_PASSWORD_ROUTE = "/change-password"

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

/** Where client accounts work. Everything under it is client-only. */
export const PORTAL_ROUTE = "/portal"

/** Sidebar links for client accounts, under `app/(clients)`. */
export const portalNavItems = [
  { title: "Projects", href: `${PORTAL_ROUTE}/projects` },
]

/** Account pages inside the dashboard shell that aren't sidebar links. */
export const accountItems = [{ title: "Profile", href: "/profile" }]

/**
 * Detail pages whose header title differs from their section's, e.g.
 * `/projects/[projectId]` shows "Project" rather than "Projects".
 */
export const detailPageTitles = [
  { parentHref: "/projects", title: "Project" },
  { parentHref: `${PORTAL_ROUTE}/projects`, title: "Project" },
]

/** Every page in the dashboard shell, used for header titles and route guards. */
export const dashboardPages = [...navItems, ...accountItems]

/** Every signed-in page, staff and client, used for header titles. */
export const allPages = [...dashboardPages, ...portalNavItems]

export function isNavItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Where a signed-in user lands after login or when a page is off limits. */
export function getHomeRoute(user: AuthUser) {
  if (mustChangePassword(user)) return CHANGE_PASSWORD_ROUTE
  return isClientUser(user) ? `${PORTAL_ROUTE}/projects` : "/dashboard"
}

/** Sidebar links the user is allowed to see. */
export function getNavItems(user: AuthUser | null) {
  return user && isClientUser(user) ? portalNavItems : navItems
}

/**
 * Whether the user may open a signed-in page. Client accounts are kept to the
 * portal and staff to everything else. A temporary password locks the
 * account to the change-password screen, which is closed to everyone else,
 * so changing it sends the user on to their home page.
 */
export function canAccessPage(user: AuthUser, pathname: string) {
  if (mustChangePassword(user)) return pathname === CHANGE_PASSWORD_ROUTE
  if (pathname === CHANGE_PASSWORD_ROUTE) return false
  // Clients only see the portal, and staff never do.
  return isClientUser(user) === isNavItemActive(pathname, PORTAL_ROUTE)
}

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
  { title: "Settings", href: "/settings" },
]

export function isNavItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

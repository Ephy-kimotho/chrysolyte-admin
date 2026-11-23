import { redirect } from "next/navigation"

// The portal has no landing page of its own yet, so start on the projects.
export default function PortalPage() {
  redirect("/portal/projects")
}

"use client"

import { MaterialStoreCard } from "@/components/stores/material-store-card"
import { useStores } from "@/hooks/use-stores"
import type { Project } from "@/lib/types/projects"

type ProjectStoreTabProps = {
  project: Pick<Project, "id" | "name">
}

/** The project's material store, shared with the Stores page. */
export function ProjectStoreTab({ project }: ProjectStoreTabProps) {
  const { data: stores } = useStores()
  const store = stores.materialStores.find(
    (item) => item.projectId === project.id
  ) ?? { projectId: project.id, projectName: project.name, items: [] }

  return <MaterialStoreCard store={store} />
}

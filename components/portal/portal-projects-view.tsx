"use client"

import { LoadError } from "@/components/load-error"
import { PortalProjectCard } from "@/components/portal/portal-project-card"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePortal } from "@/hooks/use-portal"

export function PortalProjectsView() {
  const portalQuery = usePortal()

  return (
    <section
      aria-labelledby="portal-projects-heading"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="portal-projects-heading"
          className="font-heading text-xl font-bold text-heading"
        >
          Your projects
        </h2>
        <p className="text-sm text-muted-foreground">
          {portalQuery.data
            ? `What Chrysolyte is delivering for ${portalQuery.data.client.name}.`
            : "What Chrysolyte is delivering for you."}
        </p>
      </div>

      {portalQuery.isPending ? (
        <PortalProjectsSkeleton />
      ) : portalQuery.isError ? (
        <LoadError
          error={portalQuery.error}
          fallback="We couldn't load your projects."
          onRetry={() => portalQuery.refetch()}
          isRetrying={portalQuery.isFetching}
        />
      ) : portalQuery.data.projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          You don&apos;t have any projects with Chrysolyte yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {portalQuery.data.projects.map((project) => (
            <li key={project.id} className="min-w-0">
              <PortalProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function PortalProjectsSkeleton() {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <p role="status" className="sr-only">
        Loading your projects…
      </p>
      {[0, 1, 2].map((card) => (
        <Card key={card} className="gap-0 rounded-2xl py-0">
          <Skeleton className="h-40 rounded-none" />
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-2 w-full" />
            <div className="grid grid-cols-2 gap-3 pt-3">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  )
}

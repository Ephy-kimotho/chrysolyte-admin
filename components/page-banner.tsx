type PageBannerProps = {
  title: string
  description: string
}

/** The green introduction banner at the top of a portal page. */
export function PageBanner({ title, description }: PageBannerProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-linear-to-r from-accent to-primary/45 px-5 py-6 text-accent-foreground sm:px-6 sm:pb-10">
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      <p className="text-sm leading-relaxed text-accent-foreground/90">
        {description}
      </p>
    </section>
  )
}

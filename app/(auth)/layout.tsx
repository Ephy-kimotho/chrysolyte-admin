import Image from "next/image"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[radial-gradient(ellipse_at_top_left,var(--sidebar-gradient-from),var(--background)_55%,var(--sidebar-gradient-to))] px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-black/40 md:min-h-140 md:grid-cols-2 md:rounded-[2rem]">
        <section className="relative isolate flex flex-col gap-6 overflow-hidden border-b bg-linear-to-br from-secondary/40 to-transparent p-6 sm:p-10 md:border-r md:border-b-0 md:p-12">
          <Image
            src="/assets/images/logo.png"
            alt="Chrysolyte"
            width={180}
            height={90}
            loading="eager"
            className="h-auto w-32 opacity-90 sm:w-44"
          />

          <div className="space-y-3">
            <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight text-heading uppercase sm:text-4xl lg:text-[2.75rem]">
              Chrysolyte
              <br />
              FirmControl
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
              Integrated control for construction, design, operations, people,
              stores and finance.
            </p>
          </div>

          <HexagonMark className="pointer-events-none absolute -right-16 -bottom-24 -z-10 hidden size-80 text-foreground/5 md:block" />
        </section>

        <section className="flex flex-col justify-center p-6 sm:p-10 md:p-12">
          {children}
        </section>
      </div>
    </main>
  )
}

function HexagonMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M100 8 180 54v92l-80 46-80-46V54Z" strokeWidth="10" />
      <path d="M100 48 145 74v52l-45 26-45-26V74Z" strokeWidth="6" />
    </svg>
  )
}

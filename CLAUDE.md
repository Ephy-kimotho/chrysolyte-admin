# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

This project uses npm (`package-lock.json`).

```bash
npm run dev         # Start the dev server
npm run build       # Production build
npm run start       # Serve the production build
npm run lint        # ESLint across the repo; one file: npx eslint app/page.tsx
npm run typecheck   # tsc --noEmit
npm run format      # Prettier --write, .ts and .tsx files only
npx shadcn@latest add <component>   # Add a shadcn/ui component
```

No test runner is configured yet, so there are no tests to run.

For this Next.js version's breaking changes, start with `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`.

## Architecture

This is the administrative side of Chrysolyte, a construction and consultancy company. It's an early-stage app on the Next.js 16 App Router, React 19, Tailwind CSS 4 and shadcn/ui. Feature pages are still placeholders, and `README.md` is generic template text.

- **Layout:** There is no `src/` directory. `app/`, `components/`, `hooks/` and `lib/` sit at the repo root, and `@/*` resolves to the root.
- **Routing:** The sidebar shell lives in `app/(dashboard)/layout.tsx`, and auth pages live in `app/(auth)/`, outside that shell. `/` redirects to `/dashboard`. To add a sidebar page, create its route and add it to `lib/navigation.ts`, which drives both the sidebar links and the header title.
- **Styling:** There is no Tailwind config file; `app/globals.css` holds the theme. Colors are CSS variables set in `:root`, then exposed to Tailwind in `@theme inline`, so a new color token needs an entry in both.
- **Fonts:** `app/layout.tsx` loads them with `next/font` and sets `--font-sans` (Inter), `--font-heading` (DM Sans) and `--font-mono` (Geist Mono).
- **Theming:** The app has one theme, with no dark mode or theme toggle. Don't add `dark:` utilities. Keep `@custom-variant dark` in `globals.css`, because removing it makes the `dark:` classes in shadcn/ui components follow the OS color scheme.
- **shadcn/ui:** Components use the `radix-nova` style and the unified `radix-ui` package (for example, `import { Slot } from "radix-ui"` and `Slot.Root`), not individual `@radix-ui/*` packages.
- **`cn`:** This comes from the npm package `cn`, a replacement for `clsx` plus `tailwind-merge`, neither of which is a direct dependency. `lib/utils.ts` re-exports it.
- **Data and forms:** TanStack Query, axios, React Hook Form, Zod and `@hookform/resolvers` are installed but not wired up yet. There is no `QueryClientProvider`, API client or form code. API integration comes after the UI is built.

## Conventions

- **Forms:** Manage forms with React Hook Form and validate them with Zod.
- **Schemas:** Put form schemas in `lib/schemas/`, in one file per domain (for example, `lib/schemas/auth.ts` and `lib/schemas/buildings.ts`).
- **Types:** Put types in `lib/types/`.
- **Formatting:** Put formatting utilities in `lib/format.ts`. This covers date and time formatting with date-fns, plus any other formatting the app needs later.
- **Mutations:** Abstract each mutation into a custom hook in `hooks/` instead of writing the logic in a component. Name the hook for its action and pass it an options object holding `data` and any other parameters. For example, adding a new project uses `useCreateProject(options)`.
- **Responsive design:** Make every screen mobile responsive. This applies to shadcn/ui components too, so adjust their defaults where they don't work on small screens.

# AGENTS.md — myBikeLog

## Project

Bicycle maintenance tracker. Next.js 16 (App Router) + TypeScript + Supabase (PostgreSQL/Auth) + Tailwind CSS v4 + Capacitor (mobile shell). Deployed on Vercel. Production domain: `mybikelog.app`.

## Commands

```bash
npm run dev        # next dev (port 3000)
npm run build      # next build
npm run lint       # eslint (flat config, ESLint 9)
npx tsc --noEmit   # typecheck (no script defined — run manually)
```

No test framework is configured.

## Env

Copy `.env.example` → `.env.local`. Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Strava keys, `NEXT_PUBLIC_APP_URL`. All `.env*` files are gitignored.

## Architecture

- **App Router**: `src/app/` — Server Components fetch data, thin Client Components handle interactivity.
- **Page pattern**: Each page has a `page.tsx` (server, data fetch) + `*Content.tsx` (client, rendering). E.g. `dashboard/page.tsx` → `DashboardContent.tsx`.
- **Dashboard layout**: `'use client'` sidebar with nav, user menu, real-time notification count via Supabase Realtime.
- **Auth**: Supabase Auth. Middleware (`middleware.ts`) redirects unauthenticated users from `/dashboard/*` → `/login`, and authenticated users from `/login`|`/register` → `/dashboard`.
- **Supabase clients**: Three separate clients — `src/lib/supabase/{client,server,middleware}.ts`. Use the correct one for the context (browser / server component / middleware).
- **i18n**: `next-intl`, cookie-based locale (no URL prefix). Supported: `it` (default), `en`, `fr`, `es`. Translations in `messages/*.json`. Use `useTranslations()` in client, `getTranslations()` in server.
- **State**: Zustand (client state), `@tanstack/react-query` (server state), Supabase Realtime (live DB changes).
- **Forms**: `react-hook-form` + `zod` validation.
- **Styling**: Tailwind v4 via `@tailwindcss/postcss`. Custom design system in `src/app/globals.css` with CSS variables (primary orange `#ff6b35`, glassmorphism, dark-mode-only). Use utility classes from globals.css (`.card`, `.glass-card`, `.btn-primary`, `.status-ok/warning/danger`, `.skeleton`, etc.).
- **Mobile**: Capacitor wraps the Next.js app. `android/` and `ios/` dirs exist. `src/lib/mobile/init.ts` + `src/components/MobileInitializer.tsx` handle native init (biometric, haptics, status bar).
- **UI components**: `src/components/ui/` — barrel-exported from `index.ts`. Import as `import { Button, Modal, Card } from '@/components/ui'`.
- **Types**: `src/types/index.ts` — all DB types, enums (`ComponentType`, `ComponentStatus`, `MaintenanceAction`), form types, and `DEFAULT_COMPONENTS` config.

## DB Schema

`supabase/schema.sql` — run manually in Supabase SQL Editor. Tables: `profiles`, `strava_tokens`, `bikes`, `components`, `maintenance_logs`, `notifications`. All have RLS. Component wear status is auto-calculated by a DB trigger (`update_component_status`). Storage bucket `receipts` must be created manually.

## Path Alias

`@/*` → `./src/*` (configured in `tsconfig.json`).

## Key Conventions

- All UI text must go through i18n — never hardcode strings in components.
- Component wear thresholds: km-based or hours-based (e.g. suspension uses hours).
- Strava integration: OAuth flow via `/api/auth/strava/*` routes, sync via `/api/strava/sync`.
- Images are unoptimized (`next.config.ts`: `images.unoptimized: true`) — relevant for Capacitor compatibility.

## Session History

- **Hero bug fix**: `min-h-[100dvh]` non supportato da Android WebView + `overflow-hidden` tagliava il contenuto. Sostituito con `min-h-screen`, rimosso `overflow-hidden`, rimosse blob orbs (causavano glitch), semplificato layout. Hero ora usa gradient semplice e si adatta a qualsiasi viewport.
- **PDF download**: Implementato multi-approccio per il download su mobile: CORS proxy, blob conversion, native `DownloadListener` in `MainActivity.java`, nuova API route `/api/pdf/upload`. Fixato problema download su WebView Android.
- **APK size**: Puliti asset inutilizzati in `android/app/src/main/assets` (immagini, audio, video, font). Ridotto significativamente la dimensione dell'APK.

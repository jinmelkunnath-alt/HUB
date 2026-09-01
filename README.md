# Lotus Hub

A premium media content discovery platform — built as a clean, minimal, dark,
cinematic web application.

**Current phase: Phase 1 — Foundation & Design System.**

> Phase 1 builds the complete visual identity, routing, global layout, and
> reusable component architecture. No authentication, payments, database
> operations, or real admin/business logic are implemented yet — the project is
> structured so those can be added cleanly in later phases.

## Stack

- [React](https://reactjs.org/) 18
- [Vite](https://vitejs.dev/) 6
- [TypeScript](https://www.typescriptlang.org/) 5
- [React Router](https://reactrouter.com/) 6

Dependencies are intentionally minimal. No UI framework, CSS framework, or
state library — the design system is hand-written CSS and reusable React
components.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check + production build
npm run preview    # preview the production build
npm run typecheck  # TypeScript check only
npm run test:smoke # render all routes & assert no console errors
```

## Project structure

```
src/
├── components/
│   ├── layout/    # Header, DesktopNav, MobileNav, Footer, PageContainer
│   ├── ui/        # Button, Modal, Loading, EmptyState, ErrorState, LotusLogo, StaticPage
│   └── media/     # MediaCard, MediaGrid, MediaRow, MediaThumbnail, CategoryCard, Hero
├── layouts/       # PublicLayout, AuthLayout, AdminLayout
├── pages/
│   ├── public/    # Home, Browse, Categories, FileDetails, Tokens, Profile, FAQ, Contact, legal
│   ├── auth/      # Login, Register
│   ├── admin/     # Overview + module placeholders
│   └── errors/    # 401 / 403 / 404 / 429 / 500 / 502 / 503 / Offline
├── routes/        # Route table (createBrowserRouter)
├── services/      # mockData.ts — LOCAL placeholder data, swap for real data later
├── hooks/         # useScrollToTop, useMediaQuery, useUIRestrictions
├── types/         # media.ts
├── utils/         # cn, format, uiRestrictions
└── config/        # env.ts, site.ts
```

## Future-phase compatibility

Phase 1 intentionally does **not** implement: Firebase Authentication, Telegram
registration verification, username/password login, session control, Firestore,
the token system, download authorization, ZIP password access, external storage
providers, Cloudflare Worker APIs, or real admin functionality.

Each area is prepared structurally and isolated so those systems can be added
without rebuilding existing work:

- **Data** — `src/services/mockData.ts` exposes clean accessors (`getMedia`,
  `getMediaById`, …). Later phases replace the implementation with Firestore
  reads; the UI layer is unaffected.
- **Config** — `src/config/env.ts` centralizes environment config; secrets are
  never placed in frontend code. See `.env.example`.
- **Admin** — `/Admin/admin` has a fully separate layout with module placeholders
  (Overview, Files, Categories, Users, Token Top-ups, Analytics, Audit Logs,
  Settings).
- **Auth** — Login/Register pages exist structurally under `/login` and
  `/register` with a dedicated auth layout.

## Design notes

- Original outlined **lotus mark** (`LotusLogo`) doubles as the favicon
  (`/favicon.svg`). No third-party branding, assets, or layouts are reproduced.
- Media thumbnails use generated placeholder gradients — no copyrighted media.
- Global UI restrictions (context-menu and image-drag suppression) are treated
  as presentation niceties only, not security, and do not break keyboard
  navigation or accessibility.
- Browser tab title is **Lotus Hub**; no Vite or React branding is exposed.

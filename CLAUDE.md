# International Space Curriculum — dev notes

Next.js 15 App Router + TypeScript + Tailwind (v3 config in `tailwind.config.ts`) +
React Three Fiber. See README.md for the full feature map.

## Environment quirks (this machine)

- Node lives at `C:\Program Files\nodejs` but is NOT on the default PATH of spawned
  shells. Prefix PowerShell commands with:
  `$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')`
- `.claude/launch.json` starts the dev server through `cmd.exe /c set PATH=... && npm run dev`
  for the same reason.

## Conventions

- **Design tokens** live in `tailwind.config.ts` (colors: `space-*`, `galaxy`, `nebula`,
  `electric`, `gold`, `star`) and component classes in `globals.css`
  (`holo-panel`, `glass-panel`, `btn-primary/secondary/ghost`, `input-holo`,
  `label-holo`, `section-tag`). Use these, don't invent new one-off styles.
- **Scroll animations**: never write per-section GSAP. Add `data-reveal`,
  `data-reveal-stagger` (animates children) or `data-parallax="0.2"`; `ScrollFX` picks
  them up. Pages using them must mount `<ScrollFX />`.
- **3D**: all R3F components are client components, loaded with
  `dynamic(..., { ssr: false })` from a client wrapper. Keep geometry low-poly; bloom is
  cheap, geometry is not. The astronaut is a procedural rig — animations target group
  refs so a GLTF can replace the meshes.
- **Content is data-driven**: curriculum/games/countries/achievements/dashboard numbers
  all come from `src/data/*`. Don't hardcode content in components.
- **Auth**: JWT via `jose` in httpOnly cookie `isc_session`; `src/middleware.ts` gates
  `/student|/teacher|/admin` by role (admin may view all). Server components read the
  session via `getSession()` from `src/lib/session.ts`. Dev user store is in-memory
  (`src/lib/users.ts`, seeded demo accounts, password `space123`) — registrations reset
  on server restart by design until Prisma lands.

## Gotchas

- NEVER run `npm run build` while the dev server is running — both use `.next/` and the
  build corrupts the dev server's chunks (page loses all styling). Stop dev first.
  ALSO: `preview_stop` does not reliably kill the `cmd.exe`-wrapped node process on
  Windows — check `Get-NetTCPConnection -LocalPort 3000 -State Listen` and
  `Stop-Process` the owner before building; clear `.next/` if styling broke.
- Pages that render differently per session (e.g. `/curriculum/[grade]` shows ▶ Start vs
  🔒 Login) must export `dynamic = "force-dynamic"` — with `generateStaticParams` Next
  happily prerenders the logged-out variant and serves it to everyone in production.
- The Claude preview browser window is often `visibility: hidden`: requestAnimationFrame
  is fully paused there, so canvas/Three.js/GSAP animation and rAF-driven game loops
  won't advance, and screenshots time out. Verify animation logic via DOM/state checks,
  not by waiting for rAF-driven outcomes. Hidden tabs also defer React Suspense
  selective hydration — avoid `useSearchParams`-in-Suspense for critical forms (login
  reads query params in a `useEffect` instead, for this reason).

- Percentage-height bars inside flex columns need `h-full` + `justify-end` on the column
  (bit us twice in dashboard charts).
- Emoji country flags render as letter codes on Windows Chrome — known platform
  limitation, replace with SVG flags when brand assets arrive.
- `next/font/google` needs network at build time.

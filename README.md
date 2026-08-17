# 🚀 International Space Curriculum — Space Academy Platform

A premium, futuristic international space education platform for **Grades 4–10**.
Built as an immersive "Space Academy" — 3D astronaut hero, mission-control dashboards,
interactive orbit simulations, games, and full role-based portals for students, teachers
and administrators.

> **New to this project? Read [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) first.**
> It explains the architecture (why there is no separate backend folder), how to create
> and connect the Supabase database, and exactly which folder your code belongs in.

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000 — frontend AND backend
npm run build      # production build
```

Database (see the guide for full Supabase setup):

```bash
npm run db:deploy && npm run db:seed   # create tables + starter data
npm run db:studio                      # visual database browser
```

### Demo Accounts (password: `space123`)

| Role    | Email              | Lands on   |
| ------- | ------------------ | ---------- |
| Student | student@demo.isc   | `/student` |
| Teacher | teacher@demo.isc   | `/teacher` |
| Admin   | admin@demo.isc     | `/admin`   |

Student self-registration at `/register` creates a real session and an auto-generated
Student ID (`ISC-S-<year>-<seq>`).

## Tech Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · React Three Fiber /
Three.js (+ postprocessing bloom) · GSAP ScrollTrigger · Framer Motion · JWT (jose) ·
Prisma schema ready for PostgreSQL.

## What's Implemented

- **Landing experience** — full-screen hero with a procedural 3D astronaut that breathes,
  floats, waves on load, follows the mouse with head/torso, and periodically inspects
  floating equation holograms. Surrounded by orbiting satellites, a mini rocket, planets,
  orbit rings, asteroids, constellation lines, ambient particles, star field, bloom and
  vignette post-processing.
- **Scroll experience** — GSAP ScrollTrigger reveals + parallax star layers, driven by
  `data-reveal` / `data-reveal-stagger` / `data-parallax` attributes (see
  `src/components/fx/ScrollFX.tsx`). Respects `prefers-reduced-motion`.
- **Curriculum** — data-driven grades 4–10 (`src/data/curriculum.ts`): terms → chapters →
  lessons with types (reading, 3D model, simulation, experiment, quiz…), durations and XP.
  There is deliberately no video/animation format — the curriculum is book material
  from *Space Science* plus quizzes.
- **Interactive demo** (`/demo`) — real two-body-physics orbit simulator (R3F) + a working
  weekly-test engine (MCQ, true/false, match-the-following, image identification) with
  instant evaluation and explanations.
- **Games** (`/games`) — 16-game deck; six are playable today: Space Quiz Challenge,
  Space Memory Game, Moon Landing Challenge, Satellite Orbit Simulator, Assemble a
  Rocket, and Find the Constellation.
- **Lesson viewer** (`/student/learn/[lessonId]`) — every lesson in the curriculum opens
  in an interactive viewer that renders by type: `3d-model` lessons get the clickable
  Satellite Anatomy Explorer (6 subsystems with readouts), `simulation` lessons embed the
  orbit simulator, `quiz` lessons run the assessment engine, `reading` lessons render the
  book chapter in a readable measure with an objectives sidebar, and
  activities/experiments render structured procedure cards. Completion persists to
  localStorage (mirrors the Prisma `LessonProgress` model) with an XP toast, plus
  prev/next lesson navigation. Curriculum grade pages are session-aware: visitors see
  🔒 Login, students see ▶ Start deep links.
- **Auth** — JWT sessions (httpOnly cookie), role-based middleware protecting
  `/student`, `/teacher`, `/admin`; login, multi-step validated registration, logout,
  and a forgot-password flow (`/api/auth/forgot`, enumeration-safe, email delivery
  pending provider integration). Google Sign-In and OTP have reserved slots.
- **Contact** — landing-page enquiry form posting to `/api/contact` (logged server-side
  until the Enquiry model lands).
- **Weekly tests in portal** — `/student/tests` with the live assessment engine, past
  results and scoring rules.
- **PWA / SEO / Docker** — web manifest, SVG app icon, robots.txt + sitemap.xml
  (set `NEXT_PUBLIC_SITE_URL`), standalone output and a production `Dockerfile`.
- **Student portal** — Mission Control dashboard: XP level ring, rank, Space Coins,
  streak, weekly activity chart, current chapter progress, daily challenges, upcoming
  sessions, assignments, global leaderboard, badge wall.
- **Teacher portal** — classes with progress/score bars, per-chapter performance
  analytics with teaching recommendations, downloadable resource library.
- **Admin panel** — global stats, recent registrations, enrollment by country, and CMS
  module launchpad (curriculum, question bank, games, certificates, notifications).

## Architecture Notes

```
src/
  app/            # routes (landing, curriculum, demo, games, login, register,
                  #         student/, teacher/, admin/, api/auth/*)
  components/
    three/        # HeroScene, Astronaut rig, SceneExtras (satellites, holograms…)
    fx/           # ScrollFX (GSAP), StarBackground
    sections/     # landing page sections
    demo/         # OrbitSimulator, SampleTest engine
    games/        # playable games
    portal/       # PortalShell sidebar layout shared by all three portals
  data/           # curriculum, games, countries, achievements, dashboard telemetry
  lib/            # auth (JWT), users (repository), session helper
  middleware.ts   # role-based route protection
prisma/schema.prisma  # production PostgreSQL model (documented migration path)
```

**Swappable content layer** — every page consumes typed shapes from `src/data/*` and
`src/lib/users.ts`. Moving to PostgreSQL means implementing the same signatures with
Prisma (schema already written); zero UI changes.

## Integrating Real Assets Later

| Asset                  | Where it goes |
| ---------------------- | ------------- |
| Logo / branding        | `public/brand/`, swap placeholder mark in `Navbar.tsx` + `PortalShell.tsx` |
| Astronaut GLTF         | Replace primitive meshes inside `components/three/Astronaut.tsx` — keep the group refs; all animations (wave, breathe, mouse-follow) drive the rig, not the meshes |
| Curriculum content     | Replace/extend `src/data/curriculum.ts`, or serve the same shapes from `/api/curriculum` once Prisma lands |
| Book text per lesson   | `Lesson.body` in the Prisma schema (paragraphs of chapter content) |
| Figures/diagrams/3D    | Cloud storage; `Lesson.contentUrl` field is reserved in the Prisma schema |
| Question banks         | `WeeklyTest`/`Question` models (JSON payload per question type) |

## Production Checklist

- Set `JWT_SECRET` (see `.env.example`)
- Wire PostgreSQL via `prisma/schema.prisma`; replace `src/lib/users.ts` internals
- Swap salted-SHA-256 dev hashing for bcrypt/argon2
- Add rate limiting (Redis slot reserved) on auth endpoints
- Docker: standard Next.js standalone output works (`output: "standalone"` in
  `next.config.mjs` when containerizing)

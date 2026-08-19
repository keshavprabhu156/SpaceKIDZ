# Space Education Portal — Developer Guide

**Read this before writing any code.** It explains how this project is built, why it
looks different from PRM_FRONTEND, how to get the database running, and exactly which
folder your code belongs in.

---

## 1. The most important thing to understand

### "Where is the backend folder?"

There isn't one — **and that's correct.** This project is *full-stack in a single
codebase*.

If you worked on **PRM_FRONTEND**, you're used to this setup:

```
PRM_FRONTEND/          ← project 1: the UI only (Vite + React)
   vite.config.ts      ← proxies /api  →  http://192.168.1.120:8500
   src/services/*.ts   ← axios calls that go OUT to another server

<somewhere else>/      ← project 2: the actual backend (separate folder/repo,
                          separate language, started separately)
   + a SQL client (pgAdmin / MySQL Workbench) to look at the database
```

Two projects. Two terminals. Two deployments.

**This project is one project:**

```
SpaceKIDZ/
   src/app/            ← the FRONTEND (pages the user sees)
   src/app/api/        ← the BACKEND (runs on the server, talks to the database)
   prisma/             ← the DATABASE schema + seed data
```

Next.js runs **both halves in the same process**. When you run `npm run dev`, you are
starting the frontend *and* the backend at the same time, on the same port (3000). There
is nothing else to start.

### Why there's no SQL application to install

The database is **PostgreSQL hosted on Supabase** (in the cloud). Nobody installs
Postgres or pgAdmin locally. Instead:

- The connection string lives in `.env` as `DATABASE_URL`
- We talk to it through **Prisma** (an ORM — you write TypeScript, it writes SQL)
- To *look* at the data with a GUI, run `npm run db:studio` — that's our pgAdmin

### The three layers

```
  BROWSER                          SERVER                        DATABASE
┌──────────────────┐   fetch()   ┌────────────────────┐  Prisma ┌──────────────┐
│ src/app/*/page   │────────────▶│ src/app/api/*/route│────────▶│  Supabase    │
│ src/components   │             │ src/services/*     │         │  PostgreSQL  │
│ src/hooks        │◀────────────│ src/validation/*   │◀────────│              │
└──────────────────┘    JSON     └────────────────────┘         └──────────────┘
     "use client"                    server-only code
```

**Rule of thumb:** a file with `"use client"` at the top runs in the browser. Everything
else runs on the server and may touch the database. **Never import `prisma` into a
`"use client"` file** — it will leak your database credentials into the browser bundle.

---

## 2. First-time setup (new machine)

```bash
git clone <repo-url>
cd SpaceKIDZ
npm install
```

Then create your `.env` (copy `.env.example`) and follow section 3 to fill in
`DATABASE_URL`.

> **Windows note (this machine):** Node is installed but not on the PATH of spawned
> shells. If `npm` isn't found in a new terminal, run this first:
>
> ```powershell
> $env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
> ```

---

## 3. Creating the Supabase database

The old Supabase project was deleted (free projects are removed after long inactivity),
which is why login/registration currently returns a 500. Here's how to make a new one.

### Step 1 — Create the project

1. Go to **https://supabase.com** and sign in (GitHub login is easiest).
2. Click **New project**.
3. Fill in:
   - **Name:** `space-curriculum`
   - **Database Password:** click *Generate a password* and **save it somewhere safe
     right now** — Supabase will not show it again.
   - **Region:** pick the one closest to your users (`South Asia (Mumbai)` for India).
   - **Plan:** Free.
4. Click **Create new project** and wait ~2 minutes while it provisions.

### Step 2 — Copy the connection string

1. In your project, click **Connect** (top bar) — or **Project Settings → Database**.
2. Find **Connection string** and select the **URI** tab.
3. Choose **Session pooler** (host looks like `aws-x-ap-south-1.pooler.supabase.com`,
   port `5432`). This is what the project used before.
4. Copy it. It looks like:

```
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

### Step 3 — Put it in `.env`

Create/edit `.env` in the project root:

```env
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:YourRealPassword@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="paste-a-long-random-string-here"
```

Two things people get wrong:

- **Replace `[YOUR-PASSWORD]`** with the real password, brackets removed.
- If your password contains `@ : / ? # [ ] &`, you must **percent-encode** it
  (`@` → `%40`, `#` → `%23`). Easiest fix: reset the password to letters+numbers only.

For `JWT_SECRET`, generate one:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> `.env` is git-ignored. **Never commit it.** Share credentials through a password
> manager, not Git or WhatsApp.

### Step 4 — Create the tables and load the starter data

```bash
npm run db:deploy
```

This runs the existing migration in `prisma/migrations/` and creates all tables
(User, Student, Teacher, Grade, Chapter, Lesson, WeeklyTest, Badge…).

```bash
npm run db:seed
```

This runs `prisma/seed.ts` and inserts: 12 countries, 10 badges, the Grade 6 curriculum
with 4 weekly tests, and the three demo accounts.

### Step 5 — Verify

```bash
npm run db:studio      # opens a database GUI at localhost:5555 — check the User table
npm run dev            # then open http://localhost:3000/login
```

Log in with a demo account (password **`space123`** for all three):

| Role    | Email              | Lands on   |
| ------- | ------------------ | ---------- |
| Student | student@demo.isc   | `/student` |
| Teacher | teacher@demo.isc   | `/teacher` |
| Admin   | admin@demo.isc     | `/admin`   |

If login works, the backend is fully connected.

> **If `db:deploy` fails** with a pooler/advisory-lock error, temporarily switch
> `DATABASE_URL` to the **Direct connection** string (Supabase → Connect → Direct
> connection), run the command, then switch back to the Session pooler.

---

## 4. Everyday commands

| Command              | What it does                                              |
| -------------------- | --------------------------------------------------------- |
| `npm run dev`        | Start the app (frontend **and** backend) on port 3000     |
| `npm run typecheck`  | Check types without building — **run before every push**   |
| `npm run lint`       | ESLint                                                    |
| `npm run build`      | Production build                                          |
| `npm run db:studio`  | Visual database browser (our pgAdmin) at port 5555        |
| `npm run db:migrate` | After editing `schema.prisma` — creates + applies a migration |
| `npm run db:deploy`  | Apply existing migrations (use on a fresh database)       |
| `npm run db:seed`    | Insert the starter data                                   |
| `npm run db:generate`| Regenerate the Prisma client (after pulling schema changes)|
| `npm run db:reset`   | ⚠️ **Wipes the database**, re-migrates, re-seeds           |

---

## 5. Where do I put my code? (the manual)

```
src/
├── app/                    ROUTES. Folder name = URL. Do not rename casually.
│   ├── page.tsx              → /                 (the landing page)
│   ├── layout.tsx            → wraps every page (fonts, <html>, metadata)
│   ├── globals.css           → global styles + reusable classes
│   ├── curriculum/page.tsx   → /curriculum
│   ├── curriculum/[grade]/   → /curriculum/6   ([grade] = URL parameter)
│   ├── student/ teacher/ admin/  → the three portals (login-protected)
│   └── api/                  ★ THE BACKEND. Each route.ts = one endpoint.
│       └── auth/login/route.ts   → POST /api/auth/login
│
├── components/             REUSABLE UI. Grouped by purpose.
│   ├── common/               shared widgets (Flag, SplitText, LogoutButton)
│   ├── layout/               Navbar, Footer
│   ├── sidebar/              PortalSidebar
│   ├── sections/             big landing-page blocks (Hero, GamesSection…)
│   ├── fx/                   visual effects (ScrollFX, SpaceBackdrop)
│   ├── three/                3D (React Three Fiber) components
│   ├── games/ learn/ demo/   feature-specific components
│
├── layouts/                PAGE SHELLS. PortalLayout = sidebar + content frame.
├── configs/                STATIC CONFIG. Nav links, sidebar menus.
├── context/                REACT CONTEXT. AuthContext + AuthProvider.
├── hooks/                  CUSTOM HOOKS. useAuth, useLogin, useContactForm…
├── services/               ★ DATA ACCESS.
│   ├── apiClient.ts          browser → our API (fetch wrapper, error handling)
│   ├── authService.ts        client calls: login, register, logout
│   ├── userService.ts        SERVER-ONLY: reads/writes users via Prisma
│   ├── tokenService.ts       SERVER-ONLY: signs/verifies JWT sessions
│   └── prisma.ts             SERVER-ONLY: the database connection
├── types/                  TYPESCRIPT INTERFACES, one file per domain.
├── validation/             INPUT RULES, shared by forms and API routes.
├── data/                   STATIC CONTENT (curriculum, games, countries).
├── utils/                  SMALL HELPERS (session reader, site URL).
└── middleware.ts           ROUTE GUARD. Blocks /student /teacher /admin if not logged in.
```

### Quick lookup table

| I want to…                          | Put it in                                        |
| ----------------------------------- | ------------------------------------------------ |
| Add a new page/URL                  | `src/app/<name>/page.tsx`                        |
| Add a new API endpoint              | `src/app/api/<name>/route.ts`                    |
| Add a reusable button/card/modal    | `src/components/common/`                         |
| Add a landing-page section          | `src/components/sections/`                       |
| Add a database table                | `prisma/schema.prisma` → then `npm run db:migrate` |
| Write a database query              | `src/services/<domain>Service.ts`                |
| Call our API from the browser       | `src/services/<domain>Service.ts` (via apiClient)|
| Share form/component logic          | `src/hooks/use<Thing>.ts`                        |
| Define a shape/interface            | `src/types/<domain>.ts`                          |
| Add a validation rule               | `src/validation/<domain>Validation.ts`           |
| Add nav/menu items                  | `src/configs/`                                   |
| Add curriculum/lesson content       | `src/data/curriculum.ts`                         |
| Add a colour/font/shadow token      | `tailwind.config.ts`                             |
| Add a reusable CSS class            | `src/app/globals.css` (inside `@layer components`)|

---

## 6. Recipes

### A. Add a new page (e.g. `/about`)

Create `src/app/about/page.tsx`:

```tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-space-black">
      <Navbar />
      <section className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
        <h1 className="h-section">About <span className="text-grad">us</span></h1>
      </section>
      <Footer />
    </main>
  );
}
```

That's it — the URL `/about` now exists. No router file to edit (this is the big
difference from PRM's `AppRoutes.tsx`).

### B. Add an API endpoint (backend)

Create `src/app/api/schools/route.ts`:

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/services/prisma";
import { getSession } from "@/utils/session";

export async function GET() {
  const session = await getSession();               // 1. who is asking?
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const schools = await prisma.school.findMany();   // 2. query the DB
  return NextResponse.json({ schools });            // 3. reply with JSON
}
```

Then let the browser call it — add to `src/services/schoolService.ts`:

```ts
import apiClient from "./apiClient";

export const fetchSchools = () =>
  apiClient.get<{ schools: School[] }>("/api/schools");
```

**Never call `fetch("/api/…")` directly from a component.** Always go through a service,
so error handling and the 401 redirect stay in one place.

### C. Add a database table

1. Edit `prisma/schema.prisma`:

```prisma
model Enquiry {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}
```

2. Run `npm run db:migrate` and give it a name (e.g. `add_enquiry`).
3. Query it from a service: `await prisma.enquiry.create({ data: … })`.

### D. Add a form with validation

1. Rules → `src/validation/enquiryValidation.ts`
2. State + submit → `src/hooks/useEnquiryForm.ts`
3. API call → `src/services/enquiryService.ts`
4. Markup → your component, which just calls the hook

The API route imports the **same** validation file, so the browser and server can never
disagree about what's valid. (See `useContactForm` + `contactValidation` for a worked
example.)

### E. Add a scroll animation

Don't write GSAP. Add an attribute — `src/components/fx/ScrollFX.tsx` picks it up:

| Attribute                 | Effect                                   |
| ------------------------- | ---------------------------------------- |
| `data-reveal`             | fade + rise into view                    |
| `data-reveal-stagger`     | children appear one after another        |
| `data-parallax="0.2"`     | vertical parallax                        |
| `data-count="37700"`      | number counts up                         |

---

## 7. Conventions (please follow)

1. **Use design tokens, not raw colours.** `text-star`, `bg-space-navy`, `text-electric`
   — defined in `tailwind.config.ts`. Never `#4f7df9` in a component.
2. **Reuse the component classes** in `globals.css`: `btn-primary`, `btn-secondary`,
   `card-edu`, `input-holo`, `h-section`, `lede`, `text-grad`, `section-tag`.
3. **Content lives in `src/data/`**, never hardcoded in a component.
4. **Types live in `src/types/`**, imported with `import type { … }`.
5. **Import with the `@/` alias** (`@/components/...`), not `../../..`.
6. **`"use client"` only when needed** — if it uses `useState`, `useEffect`, or an
   `onClick`, it's a client component. Otherwise leave it as a server component (faster).
7. **Run `npm run typecheck` before pushing.**
8. **One component per file**, named the same as the file.

---

## 8. Gotchas that have bitten us

- **Never run `npm run build` while `npm run dev` is running.** Both use `.next/` and the
  build corrupts the dev server's chunks (the page loses all styling). Stop dev first; if
  styling breaks, delete `.next/` and restart.
- **Pages that differ per user must export `dynamic = "force-dynamic"`.** Otherwise Next
  pre-renders the logged-out version and serves it to everyone in production. See
  `src/app/curriculum/[grade]/page.tsx`.
- **Don't import `prisma` into a `"use client"` file.** Server-only: `prisma.ts`,
  `userService.ts`, `tokenService.ts`, anything in `app/api/`.
- **Tailwind opacity steps** — `border-star/12` is invalid; use `border-star/[0.12]`.
  Valid shorthand steps are 5, 10, 15, 20, 25…
- **Emoji flags render as letter codes on Windows Chrome.** Known platform limitation.
- **`next/font/google` needs internet at build time.**

---

## 9. Current status / open items

**Working:** landing page, curriculum browser, lesson viewer, 6 playable games, orbit
simulator, weekly-test engine, login/registration/logout, role-gated portals, PWA/SEO.

**Needs work:**

| Item | Where |
| --- | --- |
| Only Grade 6 is seeded into the database; other grades come from static `src/data` | `prisma/seed.ts` |
| 10 of 16 games are not yet playable | `src/data/games.ts` (`playable: false`) |
| Google Sign-In is UI-only | `src/app/login/LoginForm.tsx` |
| No automated tests at all | — |
| Rate limits are in-process (per instance) — move to Redis before scaling out | `src/utils/rateLimit.ts` |
| A student could still use one `/grade` call per question to learn an answer before submitting. Fully closing this means persisting answers at grade time (needs a schema change) | `src/app/api/student/tests/grade/route.ts` |

### Assessment integrity — how it works now

This was rewritten because the original version could be trivially cheated. The rules:

1. **The server owns the answer key.** `GET /tests/active` strips `answer` and
   `explain` for signed-in students. For **match** questions it also sends only the
   left-hand prompts plus a *shuffled* pool of choices — otherwise the aligned
   `pairs` array would give away the mapping.
2. **The client never sends a score.** `POST /tests/submit` accepts `{ testId, answers }`
   and recomputes the score from the database (`scoreAttempt()` in
   `services/weeklyTestService.ts`). A forged `score` field is structurally ignored.
3. **One graded attempt per test.** A second submit returns `409`, so XP can't be
   farmed by resubmitting.
4. **Instant feedback is preserved** via `POST /tests/grade`, which marks one answer
   at a time and is rate-limited per question so it can't be used as an answer oracle.

**When adding a question type,** update `gradeQuestion()` in `weeklyTestService.ts` —
that function is the single source of truth for correctness. Never grade in the browser
for a scored test.

---

## 10. Cheat sheet

```bash
npm install                 # once
npm run dev                 # start everything → localhost:3000
npm run db:studio           # look at the database
npm run typecheck           # before you push

# Fresh database (after creating a new Supabase project)
npm run db:deploy && npm run db:seed
```

Demo login: `student@demo.isc` / `teacher@demo.isc` / `admin@demo.isc` — password
`space123`.

# Build Instructions — Corp History Timeline

How to build and deploy this app with Claude Code. Read alongside `spec.md`,
which is the source of truth for scope and decisions. Overriding principle:
**keep it simple; add complexity later.**

We build in **two steps**: (1) a live, good-looking site with placeholder data
and working login, deployed to Vercel; (2) swap the placeholder data for a real
Neon database. Nothing else changes between the steps.

## Before you start (accounts & keys)

Claude Code can't create these for you:

1. **Clerk** account → create an application → enable **Discord** as a social
   connection (set up a Discord OAuth app, paste its client ID/secret into
   Clerk). Copy the Clerk publishable + secret keys.
2. **Vercel** account, connected to a Git repo for this project.
3. **No custom domain needed** — the app uses Vercel's default
   `your-project.vercel.app` URL. (You can add a custom domain later in Vercel's
   settings; nothing in the build depends on it.)
4. **Neon** account — needed for **Step 2 only**, not Step 1. Free tier is
   enough. Copy the connection string when you get there.
5. **Node** + **Claude Code** installed locally.

Keys go in `.env.local` locally and in Vercel's env-var settings for production.

## How to run it

1. In an empty project folder, start Claude Code.
2. Put `spec.md` and this file in the folder so Claude Code can read them.
3. Do **Step 1** end to end — including deploying to Vercel — before touching
   Step 2. Verify login works on the live site.
4. Commit after each working phase.

---

## STEP 1 — Web only, dummy data (paste this)

> Read `spec.md` in this folder — it's the source of truth. Guiding principle:
> keep everything as simple as possible; I'll add complexity later.
>
> This is STEP 1 of a two-step build. In this step there is **NO database** —
> all entries come from a hardcoded placeholder array. The goal is a live,
> good-looking site with working login, deployed to Vercel. Build in phases,
> stop after each so I can verify, commit when a phase works.
>
> Stack: Next.js (App Router, TypeScript), Clerk auth with Discord sign-in,
> Tailwind + shadcn/ui. Target host is Vercel. Keep the timeline render layer
> thin and decoupled so a database can replace the data source later without
> touching the UI.
>
> **Phase 1a — Scaffold + auth.** Next.js + TypeScript + Tailwind + shadcn/ui,
> add Clerk, wire Discord sign-in, header with sign-in / user button. Viewing is
> public; only the header changes when logged in. Tell me exactly which env vars
> go in `.env.local`. Stop when I can log in with Discord.
>
> **Phase 1b — Placeholder data + timeline.** Create
> `lib/placeholder-data.ts` exporting a typed array of ~6 example entries
> (mix of milestones and stories, matching the `entries` shape in spec.md, with
> varied `date_precision`). Build the public `/` page that reads from this array
> and renders a vertical timeline — milestones emphasized on the spine, stories
> as smaller side cards, each showing author name and a date formatted to its
> precision. Custom, thin component. Good empty state. Keep the "get entries"
> call behind a single function (e.g. `getEntries()`) so Step 2 can swap its
> internals only.
>
> **Phase 1c — Edit UI (stubbed).** Add the auth-gated add/edit form (type,
> title, body, date + precision, optional image URL) and an officer-only
> `/review` page. Show edit/approve controls only for logged-in / officer users
> (read role from Clerk `publicMetadata`). Since there's no database yet, wire
> the submit/approve actions as no-ops that log to console — the point is the
> full UI and gating, not persistence.
>
> **Phase 1d — Deploy to Vercel.** Walk me through pushing to Git, importing on
> Vercel, and setting the Clerk env vars in Vercel. The app uses Vercel's
> default `*.vercel.app` URL — no custom domain. Remind me to add that live URL
> to Clerk's allowed origins and to the Discord OAuth app's redirect settings so
> login works in production. Stop when the placeholder site is live at its
> vercel.app URL and I can log in there.

**End of Step 1:** a live site on your domain, real login, placeholder history,
no database yet.

---

## STEP 2 — Add Neon database (paste this after Step 1 is live)

> Continue the project from Step 1. This is STEP 2: replace the placeholder data
> with a real database. Same UI, same look — only the data layer changes. Build
> in phases, stop after each, commit when a phase works.
>
> Stack addition: **Neon** (serverless Postgres) via **Drizzle ORM**
> (`@neondatabase/serverless`). Keep the `getEntries()` seam from Step 1 —
> change its internals, not its callers.
>
> **Phase 2a — Schema + connection.** Add Drizzle + the Neon driver. Define the
> `entries` table from spec.md as a Drizzle schema. Set up the DB connection
> from `DATABASE_URL`. Add a migration. Tell me the env var to add locally and
> in Vercel. Stop when migrations run against my Neon database.
>
> **Phase 2b — Seed + read swap.** Add a seed script that inserts the Step 1
> placeholder entries into Neon (as `approved` where appropriate). Change
> `getEntries()` to query the database instead of the array. The public timeline
> should look identical to Step 1 but now be DB-backed. Remove the placeholder
> array once confirmed.
>
> **Phase 2c — Real writes.** Implement persistence via server actions:
> add/edit/delete entries. Stories save as `approved`; milestones save as
> `pending`. Author id/name come from the Clerk user; capture `author_name` at
> creation. Members can edit/delete only their own entries. Enforce every check
> **server-side**.
>
> **Phase 2d — Officer review.** Make `/review` real: list `pending` milestones
> from the DB with approve / reject actions; officers can edit/delete any entry.
> Guard the route and the actions server-side by role.
>
> **Phase 2e — Ship.** Add `DATABASE_URL` to Vercel, run the migration against
> production, redeploy. Confirm the smoke test below on the live site.

**End of Step 2:** fully functional, DB-backed app on your domain.

---

## Guardrails / things to hold Claude Code to

- **Simplicity first.** If a phase can be done with less, do less. Reject
  optional libraries and abstractions that aren't needed yet.
- **Keep the data seam.** All reads go through one `getEntries()`-style function
  so Step 2 swaps internals without touching the UI. This is what makes the
  two-step plan clean.
- **Server-side permission checks.** Hiding a button is not security. Every
  mutation re-checks role/ownership on the server.
- **Public timeline shows only `approved`.** Pending/rejected never leak to
  visitors.
- **Keep the timeline component swappable.** Data in our own shape → thin render
  layer. Swapping to react-chrono / MUI later is a render-layer change.
- **Don't scope-creep.** spec.md §9 items (search, uploads, comments, EVE SSO…)
  are out for v1. Note as "later," don't build.
- **Capture `author_name` at creation** so attribution survives Discord name
  changes.

## Env vars

- Step 1: Clerk publishable key + secret key (local `.env.local` and Vercel).
- Step 2: add `DATABASE_URL` (Neon connection string) locally and in Vercel.
- Note: Neon's dashboard mentions "Better Auth" — ignore it. Auth is Clerk;
  Neon is only the database.

## First-run smoke test (after Step 2)

- Visit the site logged out → timeline is visible.
- Log in with Discord, no role assigned yet → no "Add entry" link, `/submit`
  redirects home. Login alone grants no write access.
- Set your Clerk user `publicMetadata.role` to `"member"` → "Add entry" link
  appears.
- Add a story → appears on the public timeline immediately.
- Add a milestone → does NOT appear yet.
- Set your Clerk user `publicMetadata.role` to `"officer"` → `/review` shows the
  pending milestone → approve → it appears.
- Log out → pending/rejected entries are invisible.

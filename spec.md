# Corp History Timeline — Spec

> North-star document. The "what and why." Keep it stable; let implementation
> details live in code. If a decision here changes, update this file first,
> then the code.

## 0. Guiding principle — start simple

Build the smallest thing that works, then add complexity only when a real need
appears. Prefer one moving part over two. The build is split into two steps
(see §8) so there is always something working and deployed. Everything in §10
is deliberately deferred.

## 1. Purpose

A web app that preserves an EVE Online corporation's history as a single,
visible, shareable timeline. History is crowd-sourced from many members because
no one person holds the whole story.

Two kinds of content share one timeline:

- **Milestones** — canonical corp history (major battles, system defense,
  wormhole moves, alliance changes). Officer-approved. The authoritative backbone.
- **Stories** — short personal accounts from members, loosely attached to a
  point in time. Color around the milestones.

Solves the three things a shared doc could not: no random edits, clear
authorship, and a presentation people actually want to look at.

## 2. Access model

- **Viewing is public.** Anyone, logged in or not, can read the timeline.
- **Editing requires an assigned role, not just login.** Discord sign-in alone
  grants no write access — an officer must manually set
  `publicMetadata.role = "member"` (or `"officer"`) in the Clerk dashboard
  before a user can add or edit anything. This is deliberate: it stops any
  random Discord login from getting write access by default.

| Role    | Who                                          | Can do |
|---------|-----------------------------------------------|--------|
| Visitor | Not logged in, or logged in with no role set | Read approved content only |
| Member  | Logged in + `role: "member"` in Clerk        | Add stories, propose milestones, edit/delete own entries |
| Officer | Logged in + `role: "officer"` in Clerk       | All member actions + approve/reject milestones + edit/delete any entry |

Roles live in Clerk `publicMetadata.role = "member" | "officer"`. Both roles
are assigned by hand in the Clerk dashboard for v1 — there's no self-serve
path into either one.

## 3. Core concepts

### Entry types
Milestones and stories are one underlying record, distinguished by a `type`
field. Same timeline; they differ in styling and in the approval rule.

### Dating
Every entry is anchored in time, but precision varies — members may only recall
the year.
- `event_date`: a real date.
- `date_precision`: `"day" | "month" | "year"`.
- Year-only? Store `YYYY-01-01` with precision `"year"`; UI renders just the year.
- Sort chronologically by `event_date`; ties broken by `created_at`.

### Approval rule (the one that matters)
- **Stories** are trusted on submission: a logged-in member's story publishes
  immediately (`status = "approved"`). Login-gating is the moderation.
- **Milestones** are canon and must be vetted: created as `status = "pending"`,
  appear publicly only after an officer approves.
- Officers can edit/remove any entry; members only their own.

## 4. Features (v1 scope)

- **Timeline (`/`)** — public. All `approved` entries, chronological, milestones
  and stories visually distinct. The front door.
- **Add entry** — auth-required (modal or `/submit`). Fields: type, title, body,
  date + precision, optional image URL. Author = logged-in Clerk user.
- **Review queue (`/review`)** — officer-only. Lists `pending` milestones with
  approve / reject.
- **Edit entry** — author or officer. Same form as add.
- **Auth** — Clerk sign-in with Discord; visible user button when logged in.

Behaviors:
- Public timeline never shows `pending` or `rejected`.
- Every entry shows author name and date (rendered at stored precision).
- `author_name` captured at creation so attribution stays stable if a Discord
  display name later changes.

## 5. Permissions matrix

| Action                      | Visitor | Member | Officer |
|-----------------------------|:---:|:---:|:---:|
| View approved entries       | ✅ | ✅ | ✅ |
| Add story (auto-approved)   | ❌ | ✅ | ✅ |
| Propose milestone (pending) | ❌ | ✅ | ✅ |
| Edit/delete own entry       | ❌ | ✅ | ✅ |
| Edit/delete any entry       | ❌ | ❌ | ✅ |
| Approve/reject milestone    | ❌ | ❌ | ✅ |

"Visitor" here includes anyone logged in via Discord who hasn't been assigned
a role yet — login alone doesn't promote you to Member.

Permission checks are enforced **server-side** (server actions / route
handlers), never only in the UI.

## 6. Data model

One primary table, `entries` (Postgres / Neon):

| Column           | Type        | Notes |
|------------------|-------------|-------|
| `id`             | uuid/serial | Primary key |
| `type`           | text/enum   | `"milestone" \| "story"` |
| `title`          | text        | Required |
| `body`           | text        | Plain text or light markdown |
| `event_date`     | date        | Anchor point |
| `date_precision` | text/enum   | `"day" \| "month" \| "year"` |
| `image_url`      | text        | Optional |
| `author_id`      | text        | Clerk user id |
| `author_name`    | text        | Denormalized display name at creation |
| `status`         | text/enum   | `"pending" \| "approved" \| "rejected"` |
| `created_at`     | timestamp   | |
| `updated_at`     | timestamp   | |

Roles are not a table in v1 — they live in Clerk metadata. A local `members`
table can be added later if needed.

## 7. Tech stack

- **Framework:** Next.js (App Router), TypeScript.
- **Auth:** Clerk, Discord social connection. Public read; login required to
  edit. Role in `publicMetadata`.
- **Database:** **Neon** (serverless Postgres), accessed via **Drizzle ORM**
  (`@neondatabase/serverless` driver). Drizzle earns its place by giving typed
  queries and simple migrations as the schema evolves.
- **Styling / UI:** Tailwind CSS + shadcn/ui.
- **Timeline rendering:** a small custom vertical-timeline component (central
  spine; milestones centered/emphasized, stories as side cards). Kept thin and
  **decoupled** — entries come from our own data layer in our own shape, so the
  render layer is swappable. Drop-in alternatives: `react-chrono` or
  MUI `<Timeline>`.
- **Hosting:** **Vercel** (git push to deploy). Uses the **default Vercel
  domain** (`your-project.vercel.app`); a custom domain can be added later in
  Vercel's settings if wanted.

## 8. Build plan — two steps

The point of the split: get a real, deployed, good-looking site up **before**
introducing a database, so the DB is the only new variable in step 2.

### Step 1 — Web only, dummy data
- Full UI: public timeline, header with Clerk sign-in/user button, add/edit
  form, officer review page.
- **No database.** Entries come from a hardcoded placeholder array in the code
  (`lib/placeholder-data.ts`), a handful of example milestones and stories.
- Clerk login works; role-gated UI is visible (edit/approve controls appear only
  for logged-in / officer users).
- Write actions are stubbed (no-ops or ephemeral) since there's nothing to
  persist to yet — the goal is look, feel, auth, and deploy.
- **Deployed to Vercel on the default `*.vercel.app` domain.** End state: a live
  site the corp can see, with placeholder history.

### Step 2 — Add Neon database
- Add Drizzle + Neon and the `entries` schema; migrate; seed with the same
  placeholder entries so the timeline looks identical after the switch.
- Replace the placeholder array with real DB queries.
- Implement real persistence: add/edit/delete and the officer approve/reject
  flow, all enforced server-side per §5.
- End state: fully functional app, same UI, now backed by a real database.

## 9. Out of scope for v1 (explicit non-goals)

- EVE SSO / in-game identity verification (Discord attribution is enough).
- Image/file uploads (accept an image URL only).
- Comments, reactions, discussion threads.
- Search, tags, filtering.
- Multiple corps / tenancy.
- Self-serve role-management UI (officers set by hand in Clerk).

## 10. Future ideas (not now)

Search/filtering; tags for battles vs. moves vs. lore; real image uploads;
reactions; per-year "chapters"; printable history export; optional EVE SSO
alongside Discord.

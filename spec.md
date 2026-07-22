# Corp History Timeline — Vision

> This is the durable "why and what." It should stay true even as the site is
> rebuilt or re-styled. Implementation details — the schema, the framework, the
> hosting, the exact fields — live in the code and the README and are expected
> to change; nothing in this document should depend on them. If a *principle*
> here changes, update this file first, then the code.

## 1. Purpose

Preserve an EVE Online corporation's history as a single, shared, lasting
timeline — the battles, the moves between systems, the turning points, and the
personal stories that surround them.

The history is crowd-sourced, because no one person holds all of it. The app
exists to gather those fragments from many members into one place that is
curated, correctly attributed, and genuinely nice to read — the three things a
shared document could never do well.

## 2. What lives on the timeline

Two kinds of content, side by side on one timeline, deliberately distinct:

- **Milestones** — the corporation's canonical history: major battles, system
  defenses, wormhole moves, alliance changes. These are the authoritative
  backbone, and they are curated before they become official.
- **Stories** — short, personal accounts from members, loosely pinned in time.
  These are the color and texture around the milestones, and they are trusted
  on submission rather than gate-kept.

Both can carry supporting material — a video, a battle report or killmail link,
an image, a reference — but the account itself is the point; media is optional
enrichment, never a requirement.

## 3. Principles

These are the rules that define the product. They should outlast any particular
implementation.

**Open to read, curated to contribute.** Anyone can view the history — it's
something the corp is proud to show. Contributing is a privilege, not a default:
being able to log in is *not* the same as being allowed to write. Write access
is granted deliberately to known members, so no random visitor — even an
authenticated one — can alter the record.

**Two tiers of trust.** Ordinary contributors can add their own stories and
propose milestones. A smaller group of curators (officers) decides what becomes
canonical history and can correct any entry or hide it from the timeline. This
mirrors how the corp actually works and keeps the official history trustworthy.
Crucially, "correct" and "hide" never mean *destroy* — see the append-only
principle below.

**Milestones are vetted; stories are trusted.** A member's personal story
appears immediately — the fact that only known members can write is the
safeguard. A milestone claims to be *official history*, so it stays a proposal
until a curator approves it. This is the single most important distinction in
the product.

**Everything is anchored in time — at whatever precision is known.** Some events
are remembered to the day, others only to the year. The timeline honors that:
it never invents precision the contributor didn't have, and it orders the
history as faithfully as the available dates allow.

**Every entry is attributed, permanently.** History without authorship is just
rumor. Each entry is credited to the member who wrote it, and that credit stays
stable even if their name or handle later changes.

**The record is append-only — nothing is destroyed, only superseded or hidden.**
This is what makes the history trustworthy over time. An entry is never
overwritten and never deleted: every edit is saved as a *new revision*, and the
timeline simply shows the latest visible one. The full chain of revisions is
preserved and viewable by curators, so it is always clear how an entry changed
and who changed it. "Removing" an entry means marking it *hidden* (it drops off
the public timeline but remains in the record and can be un-hidden), not erasing
it. The strongest thing anyone can do to the past is add a superseding revision;
no one can rewrite or delete what was already there. This guarantee holds even
against a curator acting in bad faith: the worst they can do is add another
revision or hide something, both of which are visible and reversible to other
curators.

**Every change is itself a recorded event.** Edits, hides, and un-hides are each
logged with who did them and when. Accountability is not a feature bolted on —
it falls out naturally from an append-only record.

## 4. Experience goals

- The distinction between official history and personal story should be obvious
  at a glance, before reading a word.
- The site should look intentional and inviting — especially to a logged-out
  visitor or a prospective recruit, who sees it first.
- It should be effortless for a nervous new member to add their story; the path
  from "I have something to add" to a saved entry is short and unintimidating.
- Legibility over cleverness. This is something people read, sometimes at
  length; clarity and calm win over interactivity for its own sake.
- It should read well on a phone, since most people will open it from a chat
  link.

## 5. What this is not (scope boundaries)

Deliberately excluded, to keep the project focused and durable:

- Not an in-game-identity system. Trust comes from known members and curators,
  not from verifying EVE characters.
- Not a discussion platform. No comments, threads, or reactions — it's an
  archive, not a forum.
- Not a media host. Entries reference media by link; the app doesn't store or
  manage large files.
- Not a multi-organization product. It serves one corporation's history.
- Not self-serve for privileges. Contributor and curator status is granted by
  people, not claimed.

## 6. Directions it might grow

Possible later, none committed, all subordinate to the principles above:
search and filtering; tags or categories (battles vs. moves vs. lore);
grouping the timeline into per-era "chapters"; richer media handling; a
printable or exportable history; broadening how identity and roles are managed.

One capability is deliberately **deferred until a real need forces its shape**,
rather than guessed at now:

- **True deletion / redaction** — for the rare case of content that must
  actually leave the public record (something harmful, doxxing, a legal ask).
  When that need appears it will come with a concrete requirement that dictates
  the right behavior; building it in the abstract now would almost certainly
  guess wrong. The one commitment made in advance: the record's storage must
  never let normal operation physically destroy a revision, so that a careful,
  role-restricted redaction can be *added* later without a rewrite.

---

## Appendix — Current implementation snapshot (mutable)

> This section is the one part expected to go stale. It records how the vision
> is *currently* realized, for orientation only. Treat the code and README as
> the real source of truth for anything here.

- Web app built with Next.js (App Router) and TypeScript, styled with Tailwind
  and shadcn/ui.
- Authentication via Clerk, using Discord sign-in. Roles are held in Clerk user
  metadata and assigned by hand; login alone grants no write access.
- Data stored in Neon (serverless Postgres), accessed through Drizzle ORM.
- A single custom, intentionally thin timeline component renders entries, so the
  presentation layer can be swapped without touching the data.
- Hosted on Vercel.

Append-only data shape (current sketch, expected to evolve):

- An **entry** is the stable identity of a milestone or story. It carries only
  what doesn't change per edit — its id, its type (`milestone` / `story`), and a
  `hidden` flag. It holds no editable content directly.
- An **entry revision** is one immutable version of that entry's content —
  title, body, event date + precision, links/media, plus who authored this
  revision and when. Editing creates a new revision row; existing rows are never
  updated or deleted.
- The timeline shows, for each non-hidden entry, its **latest** revision.
  Curators can view the full ordered list of revisions for any entry.
- `hidden` is a reversible flag on the entry, not a deletion. A hidden entry
  leaves the public timeline but stays fully in the record.
- Approval state (`pending` / `approved` / `rejected`) applies to the entry and
  follows the vetting rule: stories approved on submit, milestones pending until
  a curator approves.
- Changes worth auditing — edits (new revisions), hides, un-hides, approvals —
  are recorded as events with actor and timestamp. In the simplest form the
  revision rows and the `hidden`/approval transitions already carry most of this;
  a dedicated action-log table can be added if a fuller audit trail is wanted.

Invariant to preserve no matter how this evolves: **normal application operation
never physically deletes a revision.** Everything above depends on that.
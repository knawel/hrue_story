import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import {
  entries as entriesTable,
  entryRevisions as entryRevisionsTable,
  EntryRow,
  EntryRevisionRow,
} from "@/lib/db/schema";
import { Entry } from "@/lib/types";

// Content comes from the latest revision; authorship from the first, so an
// officer's later edit never re-credits the entry to the officer. The name is
// that author's most recent one, so a changed handle reaches old entries too.
function rowToEntry(
  entry: EntryRow,
  revision: EntryRevisionRow,
  original: EntryRevisionRow,
  authorName: string,
): Entry {
  return {
    id: entry.id,
    type: entry.type,
    title: revision.title,
    summary: revision.summary ?? undefined,
    body: revision.body,
    event_date: revision.eventDate,
    date_precision: revision.datePrecision,
    image_url: revision.imageUrl ?? undefined,
    youtube_url: revision.youtubeUrl ?? undefined,
    killboard_url: revision.killboardUrl ?? undefined,
    other_url: revision.otherUrl ?? undefined,
    author_id: original.authorId,
    author_name: authorName,
    owner_id: original.authorId,
    status: entry.status,
    hidden: entry.hidden,
    created_at: entry.createdAt,
    updated_at: revision.createdAt,
  };
}

function byEventDateThenCreatedAt(a: Entry, b: Entry) {
  return (
    a.event_date.localeCompare(b.event_date) ||
    a.created_at.localeCompare(b.created_at)
  );
}

// Entries + their latest revision, joined in application code rather than
// SQL — simplest correct way to get "one row per entry" without a
// DISTINCT ON / window-function query, and cheap at this app's scale.
// Also picks out each entry's *earliest* revision, whose author is the entry's
// owner and credited author — both fixed at creation, surviving later edits.
async function withLatestRevision(entryRows: EntryRow[]): Promise<Entry[]> {
  if (entryRows.length === 0) return [];

  const revisionRows = await getDb()
    .select()
    .from(entryRevisionsTable)
    .where(
      inArray(
        entryRevisionsTable.entryId,
        entryRows.map((entry) => entry.id),
      ),
    )
    .orderBy(entryRevisionsTable.createdAt);

  const latestByEntryId = new Map<string, EntryRevisionRow>();
  const firstByEntryId = new Map<string, EntryRevisionRow>();
  for (const revision of revisionRows) {
    if (!firstByEntryId.has(revision.entryId)) {
      firstByEntryId.set(revision.entryId, revision);
    }
    latestByEntryId.set(revision.entryId, revision);
  }

  const nameRows = await getDb()
    .selectDistinctOn([entryRevisionsTable.authorId], {
      authorId: entryRevisionsTable.authorId,
      authorName: entryRevisionsTable.authorName,
    })
    .from(entryRevisionsTable)
    .where(
      inArray(
        entryRevisionsTable.authorId,
        [...firstByEntryId.values()].map((revision) => revision.authorId),
      ),
    )
    .orderBy(entryRevisionsTable.authorId, desc(entryRevisionsTable.createdAt));
  const latestNameByAuthorId = new Map(
    nameRows.map((row) => [row.authorId, row.authorName]),
  );

  return entryRows
    .map((entry) => {
      const revision = latestByEntryId.get(entry.id);
      const original = firstByEntryId.get(entry.id);
      return revision && original
        ? rowToEntry(
            entry,
            revision,
            original,
            latestNameByAuthorId.get(original.authorId) ?? original.authorName,
          )
        : undefined;
    })
    .filter((entry): entry is Entry => entry !== undefined);
}

export async function getEntries(): Promise<Entry[]> {
  const entryRows = await getDb()
    .select()
    .from(entriesTable)
    .where(
      and(eq(entriesTable.status, "approved"), eq(entriesTable.hidden, false)),
    );

  return (await withLatestRevision(entryRows)).sort(byEventDateThenCreatedAt);
}

export async function getPendingMilestones(): Promise<Entry[]> {
  const entryRows = await getDb()
    .select()
    .from(entriesTable)
    .where(
      and(
        eq(entriesTable.status, "pending"),
        eq(entriesTable.type, "milestone"),
      ),
    );

  return (await withLatestRevision(entryRows)).sort(byEventDateThenCreatedAt);
}

export async function getHiddenEntries(): Promise<Entry[]> {
  const entryRows = await getDb()
    .select()
    .from(entriesTable)
    .where(eq(entriesTable.hidden, true));

  return (await withLatestRevision(entryRows)).sort(byEventDateThenCreatedAt);
}

// Full revision history, newest first — officer-only, so returned as raw
// rows rather than the public Entry shape.
export async function getEntryRevisions(
  id: string,
): Promise<EntryRevisionRow[]> {
  return getDb()
    .select()
    .from(entryRevisionsTable)
    .where(eq(entryRevisionsTable.entryId, id))
    .orderBy(desc(entryRevisionsTable.createdAt));
}

export async function getEntryById(id: string): Promise<Entry | undefined> {
  const [entryRow] = await getDb()
    .select()
    .from(entriesTable)
    .where(eq(entriesTable.id, id))
    .limit(1);

  if (!entryRow) return undefined;

  const [entry] = await withLatestRevision([entryRow]);
  return entry;
}

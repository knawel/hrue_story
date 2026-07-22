import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import {
  entries as entriesTable,
  entryRevisions as entryRevisionsTable,
  EntryRow,
  EntryRevisionRow,
} from "@/lib/db/schema";
import { Entry } from "@/lib/types";

function rowToEntry(
  entry: EntryRow,
  revision: EntryRevisionRow,
  ownerId: string,
): Entry {
  return {
    id: entry.id,
    type: entry.type,
    title: revision.title,
    body: revision.body,
    event_date: revision.eventDate,
    date_precision: revision.datePrecision,
    image_url: revision.imageUrl ?? undefined,
    youtube_url: revision.youtubeUrl ?? undefined,
    killboard_url: revision.killboardUrl ?? undefined,
    other_url: revision.otherUrl ?? undefined,
    author_id: revision.authorId,
    author_name: revision.authorName,
    owner_id: ownerId,
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
// Also picks out each entry's *earliest* revision author as its owner, since
// ownership is fixed at creation and must survive later edits by an officer.
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
  const ownerIdByEntryId = new Map<string, string>();
  for (const revision of revisionRows) {
    if (!ownerIdByEntryId.has(revision.entryId)) {
      ownerIdByEntryId.set(revision.entryId, revision.authorId);
    }
    latestByEntryId.set(revision.entryId, revision);
  }

  return entryRows
    .map((entry) => {
      const revision = latestByEntryId.get(entry.id);
      const ownerId = ownerIdByEntryId.get(entry.id);
      return revision && ownerId
        ? rowToEntry(entry, revision, ownerId)
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

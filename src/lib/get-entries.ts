import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { entries as entriesTable } from "@/lib/db/schema";
import { Entry } from "@/lib/types";

function rowToEntry(row: typeof entriesTable.$inferSelect): Entry {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    event_date: row.eventDate,
    date_precision: row.datePrecision,
    image_url: row.imageUrl ?? undefined,
    youtube_url: row.youtubeUrl ?? undefined,
    killboard_url: row.killboardUrl ?? undefined,
    other_url: row.otherUrl ?? undefined,
    author_id: row.authorId,
    author_name: row.authorName,
    status: row.status,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export async function getEntries(): Promise<Entry[]> {
  const rows = await getDb()
    .select()
    .from(entriesTable)
    .where(eq(entriesTable.status, "approved"))
    .orderBy(asc(entriesTable.eventDate), asc(entriesTable.createdAt));

  return rows.map(rowToEntry);
}

export async function getPendingMilestones(): Promise<Entry[]> {
  const rows = await getDb()
    .select()
    .from(entriesTable)
    .where(
      and(
        eq(entriesTable.status, "pending"),
        eq(entriesTable.type, "milestone"),
      ),
    )
    .orderBy(asc(entriesTable.eventDate), asc(entriesTable.createdAt));

  return rows.map(rowToEntry);
}

export async function getEntryById(id: string): Promise<Entry | undefined> {
  const [row] = await getDb()
    .select()
    .from(entriesTable)
    .where(eq(entriesTable.id, id))
    .limit(1);

  return row ? rowToEntry(row) : undefined;
}

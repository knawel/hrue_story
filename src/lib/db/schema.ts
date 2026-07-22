import {
  boolean,
  date,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const entryType = pgEnum("entry_type", ["milestone", "story"]);
export const datePrecision = pgEnum("date_precision", [
  "day",
  "month",
  "year",
]);
export const entryStatus = pgEnum("entry_status", [
  "pending",
  "approved",
  "rejected",
]);

// Stable identity only — no editable content. Current content lives in the
// entry's most recent entry_revisions row.
export const entries = pgTable("entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: entryType("type").notNull(),
  status: entryStatus("status").notNull().default("pending"),
  hidden: boolean("hidden").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const entryRevisions = pgTable("entry_revisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  entryId: uuid("entry_id")
    .notNull()
    .references(() => entries.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  eventDate: date("event_date", { mode: "string" }).notNull(),
  datePrecision: datePrecision("date_precision").notNull(),
  imageUrl: text("image_url"),
  youtubeUrl: text("youtube_url"),
  killboardUrl: text("killboard_url"),
  otherUrl: text("other_url"),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type EntryRow = typeof entries.$inferSelect;
export type NewEntryRow = typeof entries.$inferInsert;
export type EntryRevisionRow = typeof entryRevisions.$inferSelect;
export type NewEntryRevisionRow = typeof entryRevisions.$inferInsert;

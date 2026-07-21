import {
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

export const entries = pgTable("entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: entryType("type").notNull(),
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
  status: entryStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type EntryRow = typeof entries.$inferSelect;
export type NewEntryRow = typeof entries.$inferInsert;

export type EntryType = "milestone" | "story";
export type DatePrecision = "day" | "month" | "year";
export type EntryStatus = "pending" | "approved" | "rejected";

export type Entry = {
  id: string;
  type: EntryType;
  title: string;
  body: string;
  event_date: string;
  date_precision: DatePrecision;
  image_url?: string;
  author_id: string;
  author_name: string;
  status: EntryStatus;
  created_at: string;
  updated_at: string;
};

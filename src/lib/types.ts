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
  youtube_url?: string;
  killboard_url?: string;
  other_url?: string;
  author_id: string;
  author_name: string;
  owner_id: string;
  status: EntryStatus;
  hidden: boolean;
  created_at: string;
  updated_at: string;
};

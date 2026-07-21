import { placeholderEntries } from "@/lib/placeholder-data";
import { Entry } from "@/lib/types";

function sortEntries(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => {
    const byDate = a.event_date.localeCompare(b.event_date);
    if (byDate !== 0) return byDate;
    return a.created_at.localeCompare(b.created_at);
  });
}

export async function getEntries(): Promise<Entry[]> {
  return sortEntries(placeholderEntries.filter((e) => e.status === "approved"));
}

export async function getPendingMilestones(): Promise<Entry[]> {
  return sortEntries(
    placeholderEntries.filter(
      (e) => e.status === "pending" && e.type === "milestone",
    ),
  );
}

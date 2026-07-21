import { Entry } from "@/lib/types";
import { formatEntryDate } from "@/lib/format-entry-date";
import { cn } from "@/lib/utils";

export function Timeline({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        No history yet. Sign in and add the first entry.
      </div>
    );
  }

  return (
    <ol className="relative border-l pl-6">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className={cn("relative pb-8 last:pb-0", entry.type === "story" && "ml-6")}
        >
          <span
            className={cn(
              "absolute top-1.5 rounded-full",
              entry.type === "milestone"
                ? "-left-[31px] size-3 bg-primary"
                : "-left-[37px] size-2 bg-muted-foreground",
            )}
          />
          <div
            className={cn(
              "rounded-lg border p-4",
              entry.type === "milestone" ? "bg-card shadow-sm" : "bg-muted/40",
            )}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3
                className={cn(
                  entry.type === "milestone"
                    ? "text-lg font-semibold"
                    : "text-sm font-medium",
                )}
              >
                {entry.title}
              </h3>
              <time className="shrink-0 text-xs text-muted-foreground">
                {formatEntryDate(entry.event_date, entry.date_precision)}
              </time>
            </div>
            <p
              className={cn(
                "mt-2 text-muted-foreground",
                entry.type === "milestone" ? "text-sm" : "text-xs",
              )}
            >
              {entry.body}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              — {entry.author_name}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

import Link from "next/link";
import { Entry } from "@/lib/types";
import { Role } from "@/lib/get-role";
import { formatEntryDate } from "@/lib/format-entry-date";
import { EntryLinks } from "@/components/entry-links";
import { MilestoneEntry } from "@/components/milestone-entry";
import { cn } from "@/lib/utils";

export function Timeline({
  entries,
  currentUserId,
  role,
}: {
  entries: Entry[];
  currentUserId?: string | null;
  role?: Role | null;
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        No history yet. Sign in and add the first entry.
      </div>
    );
  }

  return (
    <ol className="relative border-l pl-6">
      {entries.map((entry) => {
        const canEdit =
          !!role &&
          (role === "officer" ||
            (!!currentUserId && entry.owner_id === currentUserId));

        return (
          <li
            key={entry.id}
            className={cn(
              "relative pb-8 last:pb-0",
              entry.type === "story" && "ml-6",
            )}
          >
            {entry.type === "milestone" ? (
              <MilestoneEntry entry={entry} canEdit={canEdit} />
            ) : (
              <>
                <span className="absolute -left-[37px] top-1.5 size-2 rounded-full bg-muted-foreground" />
                <div className="rounded-lg border bg-muted/40 p-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-sm font-medium">{entry.title}</h3>
                    <time className="shrink-0 text-xs text-muted-foreground">
                      {formatEntryDate(entry.event_date, entry.date_precision)}
                    </time>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {entry.body}
                  </p>
                  <EntryLinks entry={entry} />
                  <div className="mt-3 flex items-baseline justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                      — {entry.author_name}
                    </p>
                    {canEdit && (
                      <Link
                        href={`/submit/${entry.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}

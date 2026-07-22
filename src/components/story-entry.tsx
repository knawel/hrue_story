"use client";

import { useState } from "react";
import Link from "next/link";
import { Paperclip } from "lucide-react";
import { Entry } from "@/lib/types";
import { formatEntryDate } from "@/lib/format-entry-date";
import { EntryLinks } from "@/components/entry-links";
import { EntryMarkdown } from "@/components/entry-markdown";

function hasMedia(entry: Entry) {
  return !!(
    entry.image_url ||
    entry.youtube_url ||
    entry.killboard_url ||
    entry.other_url
  );
}

export function StoryEntry({
  entry,
  canEdit,
}: {
  entry: Entry;
  canEdit: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((value) => !value);

  return (
    <>
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse story" : "Expand story"}
        onClick={toggle}
        className="absolute -left-[37px] top-1.5 size-2 rounded-full bg-silver focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      />
      <div className="rounded-lg border bg-transparent">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={toggle}
          className="flex w-full flex-wrap items-baseline gap-x-2 gap-y-1 px-4 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <span className="font-medium text-foreground">{entry.title}</span>
          <span className="text-muted-foreground">— {entry.author_name}</span>
          <time className="text-muted-foreground">
            {formatEntryDate(entry.event_date, entry.date_precision)}
          </time>
          {hasMedia(entry) && (
            <Paperclip
              aria-hidden="true"
              className="size-3 shrink-0 text-muted-foreground"
            />
          )}
        </button>
        {expanded && (
          <div className="border-t px-4 py-3">
            <EntryMarkdown body={entry.body} className="text-sm text-muted-foreground" />
            <EntryLinks entry={entry} />
            {canEdit && (
              <div className="mt-3 text-right">
                <Link
                  href={`/submit/${entry.id}`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                >
                  Edit
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

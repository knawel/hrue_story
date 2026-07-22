"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Entry } from "@/lib/types";
import { formatEntryDate } from "@/lib/format-entry-date";
import { EntryLinks } from "@/components/entry-links";
import { cn } from "@/lib/utils";

export function MilestoneEntry({
  entry,
  canEdit,
}: {
  entry: Entry;
  canEdit: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isClampable, setIsClampable] = useState(false);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  // Measured once, while collapsed (the default state) — if the clamped
  // body is shorter than the full text, there's something to expand.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) setIsClampable(el.scrollHeight > el.clientHeight + 1);
  }, []);

  const toggle = () => setExpanded((value) => !value);

  return (
    <>
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse milestone" : "Expand milestone"}
        onClick={toggle}
        className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      />
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-semibold">{entry.title}</h3>
          <time className="shrink-0 text-xs text-muted-foreground">
            {formatEntryDate(entry.event_date, entry.date_precision)}
          </time>
        </div>
        <p
          ref={bodyRef}
          className={cn(
            "mt-2 text-sm text-muted-foreground",
            !expanded && "line-clamp-4",
          )}
        >
          {entry.body}
        </p>
        {isClampable && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={toggle}
            className="mt-1 text-xs font-medium text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
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
  );
}

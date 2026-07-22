"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Entry } from "@/lib/types";
import { formatEntryDate } from "@/lib/format-entry-date";
import { EntryLinks } from "@/components/entry-links";
import { EntryMarkdown } from "@/components/entry-markdown";
import { stripMarkdown } from "@/lib/strip-markdown";

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
        className="absolute -left-[32px] top-1.5 size-3.5 rounded-full bg-gold ring-4 ring-gold/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      />
      <div className="corner-brackets border bg-card p-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-semibold">{entry.title}</h3>
          <time className="shrink-0 text-xs text-muted-foreground">
            {formatEntryDate(entry.event_date, entry.date_precision)}
          </time>
        </div>
        {expanded ? (
          <EntryMarkdown
            body={entry.body}
            className="mt-2 text-sm text-muted-foreground"
          />
        ) : (
          <p ref={bodyRef} className="mt-2 line-clamp-4 text-sm text-muted-foreground">
            {stripMarkdown(entry.body)}
          </p>
        )}
        {isClampable && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={toggle}
            className="mt-1 text-xs font-medium text-gold hover:text-gold-bright hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
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
              className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import { Fragment, useState } from "react";
import { Entry } from "@/lib/types";
import { Role } from "@/lib/get-role";
import { MilestoneEntry } from "@/components/milestone-entry";
import { StoryEntry } from "@/components/story-entry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function yearOf(entry: Entry) {
  return entry.event_date.slice(0, 4);
}

export function Timeline({
  entries,
  currentUserId,
  role,
}: {
  entries: Entry[];
  currentUserId?: string | null;
  role?: Role | null;
}) {
  const [showStories, setShowStories] = useState(false);

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        No history yet. Sign in and add the first entry.
      </div>
    );
  }

  const storyCount = entries.filter((entry) => entry.type === "story").length;
  const visibleEntries = showStories
    ? entries
    : entries.filter((entry) => entry.type !== "story");

  return (
    <div>
      {storyCount > 0 && (
        <div className="mb-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={showStories}
            onClick={() => setShowStories((value) => !value)}
          >
            {showStories ? "Hide stories" : `Show stories (${storyCount})`}
          </Button>
        </div>
      )}
      {visibleEntries.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
          No milestones yet.
        </div>
      ) : (
        <ol className="timeline-spine relative pl-6">
          {visibleEntries.map((entry, index) => {
            const canEdit =
              !!role &&
              (role === "officer" ||
                (!!currentUserId && entry.owner_id === currentUserId));

            const year = yearOf(entry);
            const isNewYear =
              index === 0 || yearOf(visibleEntries[index - 1]) !== year;

            return (
              <Fragment key={entry.id}>
                {isNewYear && (
                  <li
                    className={cn(
                      "relative pb-2 text-sm font-semibold tracking-wide text-brand",
                      index !== 0 && "pt-4",
                    )}
                  >
                    <span className="absolute -left-[33px] top-1/2 h-px w-[18px] -translate-y-1/2 bg-brand" />
                    {year}
                  </li>
                )}
                <li
                  className={cn(
                    "relative pb-8 last:pb-0",
                    entry.type === "story" && "ml-6",
                  )}
                >
                  {entry.type === "milestone" ? (
                    <MilestoneEntry entry={entry} canEdit={canEdit} />
                  ) : (
                    <StoryEntry entry={entry} canEdit={canEdit} />
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      )}
    </div>
  );
}

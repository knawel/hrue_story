"use client";

import { Fragment, useState } from "react";
import { useTranslations } from "next-intl";
import { Entry } from "@/lib/types";
import { Role } from "@/lib/get-role";
import { MilestoneEntry } from "@/components/milestone-entry";
import { StoryEntry } from "@/components/story-entry";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [warningOpen, setWarningOpen] = useState(false);
  const t = useTranslations("Timeline");

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        {t("empty")}
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
        <div className="mb-8 flex justify-center">
          <Button
            type="button"
            variant="outline"
            aria-pressed={showStories}
            onClick={() =>
              showStories ? setShowStories(false) : setWarningOpen(true)
            }
          >
            <BookOpen />
            {showStories
              ? t("hideStories")
              : t("showStories", { count: storyCount })}
          </Button>
        </div>
      )}
      <AlertDialog open={warningOpen} onOpenChange={setWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("warningTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("warningBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setWarningOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setShowStories(true);
                setWarningOpen(false);
              }}
            >
              {t("confirmShow")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {visibleEntries.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
          {t("noMilestones")}
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
                      "sticky top-0 z-10 bg-background/85 py-2 text-base font-semibold tracking-wide text-brand backdrop-blur-sm",
                      index !== 0 && "mt-4",
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

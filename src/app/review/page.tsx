import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { formatEntryDate } from "@/lib/format-entry-date";
import { getHiddenEntries, getPendingMilestones } from "@/lib/get-entries";
import { getRole } from "@/lib/get-role";
import {
  approveEntryAction,
  rejectEntryAction,
  unhideEntryAction,
} from "@/lib/actions";

export default async function ReviewPage() {
  const role = await getRole();
  if (role !== "officer") redirect("/");

  const [pending, hidden] = await Promise.all([
    getPendingMilestones(),
    getHiddenEntries(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-2xl font-semibold text-gold">
        Review queue
      </h1>
      <p className="mt-2 text-muted-foreground">
        Pending milestones awaiting approval.
      </p>

      <div className="mt-8 space-y-4">
        {pending.length === 0 && (
          <p className="text-muted-foreground">Nothing pending.</p>
        )}
        {pending.map((entry) => (
          <div key={entry.id} className="rounded-lg border p-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-semibold">{entry.title}</h2>
              <time className="shrink-0 text-sm text-muted-foreground">
                {formatEntryDate(entry.event_date, entry.date_precision)}
              </time>
            </div>
            <p className="mt-2 text-base text-muted-foreground">{entry.body}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              — {entry.author_name}
            </p>
            <div className="mt-4 flex gap-2">
              <form action={approveEntryAction}>
                <input type="hidden" name="id" value={entry.id} />
                <SubmitButton size="sm" pendingLabel="Approving…">
                  Approve
                </SubmitButton>
              </form>
              <form action={rejectEntryAction}>
                <input type="hidden" name="id" value={entry.id} />
                <SubmitButton size="sm" variant="outline" pendingLabel="Rejecting…">
                  Reject
                </SubmitButton>
              </form>
              <Button
                size="sm"
                variant="ghost"
                render={<Link href={`/submit/${entry.id}`}>Edit</Link>}
              />
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-heading mt-12 text-xl font-semibold text-gold">
        Hidden entries
      </h2>
      <p className="mt-2 text-muted-foreground">
        Off the public timeline, still in the record.
      </p>

      <div className="mt-8 space-y-4">
        {hidden.length === 0 && (
          <p className="text-muted-foreground">Nothing hidden.</p>
        )}
        {hidden.map((entry) => (
          <div key={entry.id} className="rounded-lg border p-4">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-semibold">{entry.title}</h3>
              <time className="shrink-0 text-sm text-muted-foreground">
                {formatEntryDate(entry.event_date, entry.date_precision)}
              </time>
            </div>
            <p className="mt-2 text-base text-muted-foreground">{entry.body}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              — {entry.author_name}
            </p>
            <div className="mt-4 flex gap-2">
              <form action={unhideEntryAction}>
                <input type="hidden" name="id" value={entry.id} />
                <SubmitButton size="sm" pendingLabel="Un-hiding…">
                  Un-hide
                </SubmitButton>
              </form>
              <Button
                size="sm"
                variant="ghost"
                render={<Link href={`/submit/${entry.id}`}>Edit</Link>}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

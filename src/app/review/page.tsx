import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatEntryDate } from "@/lib/format-entry-date";
import { getPendingMilestones } from "@/lib/get-entries";
import { getRole } from "@/lib/get-role";
import { approveEntryAction, rejectEntryAction } from "@/lib/actions";

export default async function ReviewPage() {
  const role = await getRole();
  if (role !== "officer") redirect("/");

  const pending = await getPendingMilestones();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Review queue</h1>
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
              <time className="shrink-0 text-xs text-muted-foreground">
                {formatEntryDate(entry.event_date, entry.date_precision)}
              </time>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{entry.body}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              — {entry.author_name}
            </p>
            <div className="mt-4 flex gap-2">
              <form action={approveEntryAction}>
                <input type="hidden" name="id" value={entry.id} />
                <Button type="submit" size="sm">
                  Approve
                </Button>
              </form>
              <form action={rejectEntryAction}>
                <input type="hidden" name="id" value={entry.id} />
                <Button type="submit" size="sm" variant="outline">
                  Reject
                </Button>
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

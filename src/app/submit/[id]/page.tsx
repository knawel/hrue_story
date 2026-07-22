import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { EntryForm } from "@/components/entry-form";
import { SubmitButton } from "@/components/submit-button";
import {
  editEntryAction,
  hideEntryAction,
  unhideEntryAction,
} from "@/lib/actions";
import { getEntryById } from "@/lib/get-entries";
import { getRole } from "@/lib/get-role";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = await getRole();
  if (!role) redirect("/");

  const { userId } = await auth();
  const entry = await getEntryById(id);
  if (!entry) notFound();

  const canEdit = role === "officer" || entry.owner_id === userId;
  if (!canEdit) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading text-2xl font-semibold text-gold">
        Edit entry
      </h1>
      <p className="mt-2 text-muted-foreground">
        Saving creates a new revision — the previous text is kept, never
        overwritten.
      </p>
      <div className="mt-8">
        <EntryForm
          action={editEntryAction}
          defaultValues={entry}
          submitLabel="Save changes"
        />
      </div>
      {role === "officer" && (
        <div className="mt-8 border-t pt-8">
          <Link
            href={`/submit/${entry.id}/history`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
          >
            View revision history
          </Link>
          <form
            action={entry.hidden ? unhideEntryAction : hideEntryAction}
            className="mt-6"
          >
            <input type="hidden" name="id" value={entry.id} />
            <p className="mb-3 text-sm text-muted-foreground">
              {entry.hidden
                ? "This entry is hidden from the public timeline."
                : "Hiding drops this entry from the public timeline. It stays in the record and can be un-hidden."}
            </p>
            <SubmitButton
              variant={entry.hidden ? "outline" : "destructive"}
              pendingLabel={entry.hidden ? "Un-hiding…" : "Hiding…"}
            >
              {entry.hidden ? "Un-hide entry" : "Hide entry"}
            </SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}

import { redirect } from "next/navigation";
import { EntryForm } from "@/components/entry-form";
import { submitEntryAction } from "@/lib/actions";
import { getRole } from "@/lib/get-role";

export default async function SubmitPage() {
  const role = await getRole();
  if (!role) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Add an entry</h1>
      <p className="mt-2 text-muted-foreground">
        Stories publish immediately. Milestones need officer approval before
        they show up on the public timeline.
      </p>
      <div className="mt-8">
        <EntryForm action={submitEntryAction} />
      </div>
    </div>
  );
}

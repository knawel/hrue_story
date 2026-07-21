import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { EntryForm } from "@/components/entry-form";
import { editEntryAction } from "@/lib/actions";
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

  const canEdit = role === "officer" || entry.author_id === userId;
  if (!canEdit) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Edit entry</h1>
      <div className="mt-8">
        <EntryForm
          action={editEntryAction}
          defaultValues={entry}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}

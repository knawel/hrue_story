import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatEntryDate } from "@/lib/format-entry-date";
import { getEntryById, getEntryRevisions } from "@/lib/get-entries";
import { getRole } from "@/lib/get-role";

export default async function EntryHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = await getRole();
  if (role !== "officer") redirect("/");

  const entry = await getEntryById(id);
  if (!entry) notFound();

  const revisions = await getEntryRevisions(id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Revision history</h1>
      <p className="mt-2 text-muted-foreground">{entry.title}</p>

      <ol className="mt-8 space-y-4">
        {revisions.map((revision, index) => (
          <li key={revision.id} className="rounded-lg border p-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-semibold">
                {revision.title}
                {index === 0 && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    (current)
                  </span>
                )}
              </h2>
              <time className="shrink-0 text-xs text-muted-foreground">
                {formatEntryDate(revision.eventDate, revision.datePrecision)}
              </time>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {revision.body}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              — {revision.authorName} ·{" "}
              {new Date(revision.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </li>
        ))}
      </ol>

      <Link
        href={`/submit/${id}`}
        className="mt-8 inline-block text-sm font-medium text-primary hover:underline"
      >
        Back to edit
      </Link>
    </div>
  );
}

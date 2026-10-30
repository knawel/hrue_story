import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
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

  const [t, tGuide] = await Promise.all([
    getTranslations("Edit"),
    getTranslations("Guide"),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading text-2xl font-semibold text-brand">
        {t("title")}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("intro")}</p>
      <Link
        href="/guide"
        className="mt-2 inline-block text-sm font-medium text-brand hover:text-brand-bright hover:underline"
      >
        {tGuide("link")}
      </Link>
      <div className="mt-8">
        <EntryForm
          action={editEntryAction}
          defaultValues={entry}
          submitLabel={t("save")}
        />
      </div>
      {role === "officer" && (
        <div className="mt-8 border-t pt-8">
          <Link
            href={`/submit/${entry.id}/history`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
          >
            {t("viewHistory")}
          </Link>
          <form
            action={entry.hidden ? unhideEntryAction : hideEntryAction}
            className="mt-6"
          >
            <input type="hidden" name="id" value={entry.id} />
            <p className="mb-3 text-sm text-muted-foreground">
              {entry.hidden ? t("hiddenNotice") : t("hideNotice")}
            </p>
            <SubmitButton
              variant={entry.hidden ? "outline" : "destructive"}
              pendingLabel={entry.hidden ? t("unhiding") : t("hiding")}
            >
              {entry.hidden ? t("unhide") : t("hide")}
            </SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}

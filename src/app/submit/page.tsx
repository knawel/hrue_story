import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EntryForm } from "@/components/entry-form";
import { submitEntryAction } from "@/lib/actions";
import { getRole } from "@/lib/get-role";

export default async function SubmitPage() {
  const role = await getRole();
  if (!role) redirect("/");

  const [t, tGuide] = await Promise.all([
    getTranslations("Submit"),
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
        <EntryForm action={submitEntryAction} />
      </div>
    </div>
  );
}

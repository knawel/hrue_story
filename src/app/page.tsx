import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getEntries } from "@/lib/get-entries";
import { getRole } from "@/lib/get-role";
import { Timeline } from "@/components/timeline";

export default async function Home() {
  const [entries, role, { userId }, t, tGuide] = await Promise.all([
    getEntries(),
    getRole(),
    auth(),
    getTranslations("Home"),
    getTranslations("Guide"),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold text-brand">HRUE</h1>
      <p className="mt-2 text-muted-foreground">{t("tagline")}</p>
      <Link
        href="/guide"
        className="mt-2 inline-block text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
      >
        {tGuide("title")}
      </Link>
      <div className="mt-10">
        <Timeline entries={entries} currentUserId={userId} role={role} />
      </div>
    </div>
  );
}

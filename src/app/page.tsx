import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { getEntries } from "@/lib/get-entries";
import { getRole } from "@/lib/get-role";
import { Timeline } from "@/components/timeline";

export default async function Home() {
  const [entries, role, { userId }, t] = await Promise.all([
    getEntries(),
    getRole(),
    auth(),
    getTranslations("Home"),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold text-brand">HRUE</h1>
      <p className="mt-2 text-muted-foreground">{t("tagline")}</p>
      <div className="mt-10">
        <Timeline entries={entries} currentUserId={userId} role={role} />
      </div>
    </div>
  );
}

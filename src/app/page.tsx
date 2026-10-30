import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getEntries } from "@/lib/get-entries";
import { getRole } from "@/lib/get-role";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const [entries, role, { userId }, t, tGuide] = await Promise.all([
    getEntries(),
    getRole(),
    auth(),
    getTranslations("Home"),
    getTranslations("Guide"),
  ]);

  const milestones = entries.filter((entry) => entry.type === "milestone").length;
  const stories = entries.length - milestones;
  // Entries come sorted by event date, so the first one is the earliest.
  const since = entries[0]?.event_date.slice(0, 4);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <section className="flex items-center gap-4 sm:gap-6">
        <Image
          src="/logo.png"
          alt=""
          width={96}
          height={96}
          priority
          className="size-16 shrink-0 rounded-2xl shadow-lg ring-1 ring-black/5 sm:size-24"
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            HRUE
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("tagline")}</p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        {since && (
          <p className="text-sm text-muted-foreground">
            {t("stats", { milestones, stories, since })}
          </p>
        )}
        <Button
          variant="outline"
          size="sm"
          render={
            <Link href="/guide">
              <BookOpen />
              {tGuide("title")}
            </Link>
          }
        />
      </div>

      <div className="mt-12">
        <Timeline entries={entries} currentUserId={userId} role={role} />
      </div>
    </div>
  );
}

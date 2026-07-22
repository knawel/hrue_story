import { auth } from "@clerk/nextjs/server";
import { getEntries } from "@/lib/get-entries";
import { getRole } from "@/lib/get-role";
import { Timeline } from "@/components/timeline";

export default async function Home() {
  const [entries, role, { userId }] = await Promise.all([
    getEntries(),
    getRole(),
    auth(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold text-gold">HRUE</h1>
      <p className="mt-2 text-muted-foreground">
        Holy Russian Empire — milestones and stories from across the corp, in
        one place.
      </p>
      <div className="mt-10">
        <Timeline entries={entries} currentUserId={userId} role={role} />
      </div>
    </div>
  );
}

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
      <h1 className="text-2xl font-semibold">Corp History Timeline</h1>
      <p className="mt-2 text-muted-foreground">
        Milestones and stories from across the corp, in one place.
      </p>
      <div className="mt-10">
        <Timeline entries={entries} currentUserId={userId} role={role} />
      </div>
    </div>
  );
}

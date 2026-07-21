import { getEntries } from "@/lib/get-entries";
import { Timeline } from "@/components/timeline";

export default async function Home() {
  const entries = await getEntries();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Corp History Timeline</h1>
      <p className="mt-2 text-muted-foreground">
        Milestones and stories from across the corp, in one place.
      </p>
      <div className="mt-10">
        <Timeline entries={entries} />
      </div>
    </div>
  );
}

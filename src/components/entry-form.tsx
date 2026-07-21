import { Entry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EntryForm({
  action,
  defaultValues,
  submitLabel = "Submit",
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: Partial<Entry>;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="space-y-6">
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <div className="space-y-2">
        <Label>Type</Label>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="milestone"
              defaultChecked={defaultValues?.type !== "story"}
            />
            Milestone
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="story"
              defaultChecked={defaultValues?.type === "story"}
            />
            Story
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={defaultValues?.title}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          name="body"
          required
          rows={5}
          defaultValue={defaultValues?.body}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_date">Date</Label>
          <Input
            id="event_date"
            name="event_date"
            type="date"
            required
            defaultValue={defaultValues?.event_date}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_precision">Precision</Label>
          <select
            id="date_precision"
            name="date_precision"
            defaultValue={defaultValues?.date_precision ?? "day"}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="day">Day</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL (optional)</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={defaultValues?.image_url}
        />
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}

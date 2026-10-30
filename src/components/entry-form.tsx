"use client";

import { useTranslations } from "next-intl";
import { Entry } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";

export function EntryForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: Partial<Entry>;
  submitLabel?: string;
}) {
  const t = useTranslations("Form");

  return (
    <form action={action} className="space-y-6">
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <div className="space-y-2">
        <Label>{t("type")}</Label>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="milestone"
              defaultChecked={defaultValues?.type !== "story"}
              className="accent-brand"
            />
            {t("milestone")}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="story"
              defaultChecked={defaultValues?.type === "story"}
              className="accent-brand"
            />
            {t("story")}
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">{t("title")}</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={defaultValues?.title}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">{t("body")}</Label>
        <Textarea
          id="body"
          name="body"
          required
          rows={5}
          defaultValue={defaultValues?.body}
        />
        <p className="text-sm text-muted-foreground">
          <code>**bold**</code> <code>*italic*</code>{" "}
          <code>[text](url)</code> <code>- list</code>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_date">{t("date")}</Label>
          <Input
            id="event_date"
            name="event_date"
            type="date"
            required
            defaultValue={defaultValues?.event_date}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_precision">{t("precision")}</Label>
          <select
            id="date_precision"
            name="date_precision"
            defaultValue={defaultValues?.date_precision ?? "day"}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
          >
            <option value="day">{t("day")}</option>
            <option value="month">{t("month")}</option>
            <option value="year">{t("year")}</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">{t("imageUrl")}</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={defaultValues?.image_url}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtube_url">{t("youtubeUrl")}</Label>
        <Input
          id="youtube_url"
          name="youtube_url"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          defaultValue={defaultValues?.youtube_url}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="killboard_url">
          {t("killboardUrl")}
        </Label>
        <Input
          id="killboard_url"
          name="killboard_url"
          type="url"
          placeholder="https://zkillboard.com/..."
          defaultValue={defaultValues?.killboard_url}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="other_url">{t("otherUrl")}</Label>
        <Input
          id="other_url"
          name="other_url"
          type="url"
          defaultValue={defaultValues?.other_url}
        />
      </div>

      <SubmitButton>{submitLabel ?? t("submit")}</SubmitButton>
    </form>
  );
}

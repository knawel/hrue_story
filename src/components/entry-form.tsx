"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { Entry } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";

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
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Wraps the selection (or a placeholder) in a Markdown quote with an
  // attribution line, then selects the part the author should type over.
  function insertQuote() {
    const el = bodyRef.current;
    if (!el) return;

    const { selectionStart: start, selectionEnd: end, value } = el;
    const selected = value.slice(start, end).trim();
    const quote = selected || t("quotePlaceholder");
    const author = t("quoteAuthorPlaceholder");

    const before = value.slice(0, start);
    const after = value.slice(end);
    const lead = before === "" || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const tail = after === "" || after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";

    const quoteLines = quote
      .split("\n")
      .map((line) => `> ${line}`.trimEnd())
      .join("\n");
    const head = `${lead}${quoteLines}\n>\n> — `;
    el.setRangeText(`${head}${author}${tail}`, start, end);

    el.focus();
    if (selected) {
      el.setSelectionRange(start + head.length, start + head.length + author.length);
    } else {
      const quoteStart = start + lead.length + 2;
      el.setSelectionRange(quoteStart, quoteStart + quote.length);
    }
  }

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
              disabled={!!defaultValues?.id}
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
              disabled={!!defaultValues?.id}
              className="accent-brand"
            />
            {t("story")}
          </label>
        </div>
        {defaultValues?.id && (
          <p className="text-sm text-muted-foreground">{t("typeFixed")}</p>
        )}
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
        <Label htmlFor="summary">{t("summary")}</Label>
        <Textarea
          id="summary"
          name="summary"
          rows={3}
          defaultValue={defaultValues?.summary}
        />
        <p className="text-sm text-muted-foreground">{t("summaryHint")}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">{t("body")}</Label>
        <Textarea
          id="body"
          name="body"
          required
          rows={5}
          ref={bodyRef}
          defaultValue={defaultValues?.body}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            <code>**bold**</code> <code>*italic*</code>{" "}
            <code>[text](url)</code> <code>- list</code> <code>&gt; quote</code>
          </p>
          <Button type="button" variant="outline" size="sm" onClick={insertQuote}>
            <Quote />
            {t("addQuote")}
          </Button>
        </div>
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

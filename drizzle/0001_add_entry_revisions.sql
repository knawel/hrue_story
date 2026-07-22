CREATE TABLE "entry_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entry_id" uuid NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"event_date" date NOT NULL,
	"date_precision" date_precision NOT NULL,
	"image_url" text,
	"youtube_url" text,
	"killboard_url" text,
	"other_url" text,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "hidden" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "entry_revisions" ADD CONSTRAINT "entry_revisions_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
INSERT INTO "entry_revisions" ("entry_id", "title", "body", "event_date", "date_precision", "image_url", "youtube_url", "killboard_url", "other_url", "author_id", "author_name", "created_at")
SELECT "id", "title", "body", "event_date", "date_precision", "image_url", "youtube_url", "killboard_url", "other_url", "author_id", "author_name", "created_at"
FROM "entries";
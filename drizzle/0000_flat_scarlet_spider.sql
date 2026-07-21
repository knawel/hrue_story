CREATE TYPE "public"."date_precision" AS ENUM('day', 'month', 'year');--> statement-breakpoint
CREATE TYPE "public"."entry_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."entry_type" AS ENUM('milestone', 'story');--> statement-breakpoint
CREATE TABLE "entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "entry_type" NOT NULL,
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
	"status" "entry_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

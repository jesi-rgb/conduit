ALTER TABLE "conversations" ADD COLUMN "text_selection_from_message" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "generated_by" text NOT NULL;
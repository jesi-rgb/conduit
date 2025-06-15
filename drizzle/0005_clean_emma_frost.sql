ALTER TABLE "conversations" ADD COLUMN "selected_text" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "selection_start_index" integer;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "selection_end_index" integer;--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "text_selection_from_message";
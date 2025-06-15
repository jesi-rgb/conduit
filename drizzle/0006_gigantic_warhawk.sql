ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "selection_node_type" varchar(10);--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "selection_node_index" integer;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "selection_start_offset" integer;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "selection_end_offset" integer;--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "selection_start_index";--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "selection_end_index";
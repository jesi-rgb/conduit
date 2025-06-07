DROP TABLE "branches" CASCADE;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "parent_conversation_id" uuid;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "branch_from_message_id" uuid;--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "branch_id";
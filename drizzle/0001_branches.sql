CREATE TABLE "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_conversation_id" uuid NOT NULL,
	"branch_from_message_id" uuid NOT NULL,
	"branch_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "branch_id" uuid;--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_parent_conversation_id_conversations_id_fk" FOREIGN KEY ("parent_conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_branch_from_message_id_messages_id_fk" FOREIGN KEY ("branch_from_message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
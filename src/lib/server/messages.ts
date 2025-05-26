import { validate as validateUuid } from "uuid";
import { conversations, messages } from "./db/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "./db";

export async function getMessages(conversationId: string) {
	if (!validateUuid(conversationId)) {
		console.log(`Invalid UUID: ${conversationId}, refusing to query database`);
		return null;
	}

	const conversationMessages = await db.
		select()
		.from(messages)
		.where(eq(messages.conversation_id, conversationId))
		.orderBy(messages.created_at);

	console.log(conversationMessages)
	return conversationMessages;

}

export async function createMessage({
	conversationId,
	role,
	content
}: {
	conversationId: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
}) {
	// Check if the ID is a valid UUID
	if (!validateUuid(conversationId)) {
		console.log(`Invalid UUID: ${conversationId}, refusing to create message`);
		return null;
	}

	console.log(`Creating message for conversation: ${conversationId}, role: ${role}`);

	// First create the message
	const result = await db.insert(messages)
		.values({
			conversation_id: conversationId,
			role,
			content
		})
		.returning();

	// Then update the conversation's updated_at timestamp
	await db.update(conversations)
		.set({
			updated_at: sql`NOW()`
		})
		.where(eq(conversations.id, conversationId));

	console.log('Message created:', result[0]);
	return result[0];
}

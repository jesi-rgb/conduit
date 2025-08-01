import { validate as validateUuid } from 'uuid';
import { conversations, messages } from './db/schema';
import { eq, sql } from 'drizzle-orm';
import { db } from './db';

export async function getMessages(conversationId: string) {
	if (!validateUuid(conversationId)) {
		console.log(`Invalid UUID: ${conversationId}, refusing to query database`);
		return null;
	}

	const conversationMessages = await db
		.select()
		.from(messages)
		.where(eq(messages.conversation_id, conversationId))
		.orderBy(messages.created_at);

	return conversationMessages;
}

export async function getMessagesFromBranch(branchId: string) {
	const branchMessages = await db
		.select()
		.from(messages)
		.where(eq(messages.conversation_id, branchId))
		.orderBy(messages.created_at);

	return branchMessages;
}

export async function getLastNMessages(conversationId: string, n: number = 4) {
	if (!validateUuid(conversationId)) {
		console.log(`Invalid UUID: ${conversationId}, refusing to query database`);
		return null;
	}

	const lastMessages = await db
		.select()
		.from(messages)
		.where(eq(messages.conversation_id, conversationId))
		.orderBy(sql`${messages.created_at} DESC`)
		.limit(n);

	// Return in chronological order (oldest first)
	return lastMessages.reverse();
}

export async function createMessage({
	id,
	conversationId,
	role,
	content
}: {
	id?: string;
	conversationId: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
}) {
	// Check if the ID is a valid UUID
	if (!validateUuid(conversationId)) {
		console.log(`Invalid UUID: ${conversationId}, refusing to create message`);
		return null;
	}

	// First create the message
	const result = await db
		.insert(messages)
		.values({
			id: id,
			conversation_id: conversationId,
			role,
			content
		})
		.returning();

	// Then update the conversation's updated_at timestamp
	await db
		.update(conversations)
		.set({
			updated_at: sql`NOW()`
		})
		.where(eq(conversations.id, conversationId));

	return result[0];
}

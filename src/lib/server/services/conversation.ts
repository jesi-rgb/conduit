
import { db } from '$lib/server/db';
import { conversations, messages, users } from '$lib/server/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { validate as validateUuid } from 'uuid';

export async function getConversations(userId: string) {
	return db.select()
		.from(conversations)
		.where(eq(conversations.user_id, userId))
		.orderBy(desc(conversations.updated_at));
}

export async function getConversation(id: string, userId: string) {
	// Check if the ID is a valid UUID
	if (!validateUuid(id)) {
		console.log(`Invalid UUID: ${id}, refusing to query database`);
		return null;
	}

	console.log(`Attempting to get conversation: ${id} for user: ${userId}`);

	const result = await db.select()
		.from(conversations)
		.where(and(
			eq(conversations.id, id),
			eq(conversations.user_id, userId)
		))
		.limit(1);

	if (result.length === 0) {
		console.log(`No conversation found with ID: ${id} for user: ${userId}`);
		return null;
	}

	console.log('Conversation found:', result[0]);
	return result[0];
}

export async function createConversation(title: string, userId: string) {
	console.log(`Creating conversation for user: ${userId}, title: ${title}`);

	const result = await db.insert(conversations)
		.values({
			title,
			user_id: userId
		})
		.returning();

	const newConversation = result[0];
	console.log('New conversation created:', newConversation);

	return newConversation;
}

export async function updateConversationTitle(id: string, title: string, userId: string) {
	// Check if the ID is a valid UUID
	if (!validateUuid(id)) {
		console.log(`Invalid UUID: ${id}, refusing to update conversation title`);
		return null;
	}

	console.log(`Updating conversation title: ${id}, new title: ${title}, user: ${userId}`);

	const result = await db.update(conversations)
		.set({
			title,
			updated_at: sql`NOW()`
		})
		.where(and(
			eq(conversations.id, id),
			eq(conversations.user_id, userId)
		))
		.returning();

	if (result.length === 0) {
		console.log(`No conversation found to update with ID: ${id}`);
		return null;
	}

	console.log('Conversation title updated:', result[0]);
	return result[0];
}

export async function deleteConversation(id: string, userId: string) {
	// Check if the ID is a valid UUID
	if (!validateUuid(id)) {
		console.log(`Invalid UUID: ${id}, refusing to delete conversation`);
		return null;
	}

	console.log(`Deleting conversation: ${id} for user: ${userId}`);

	return db.delete(conversations)
		.where(and(
			eq(conversations.id, id),
			eq(conversations.user_id, userId)
		));
}

export async function getMessages(conversationId: string) {
	// Check if the ID is a valid UUID
	if (!validateUuid(conversationId)) {
		console.log(`Invalid UUID: ${conversationId}, refusing to fetch messages`);
		return [];
	}

	console.log(`Fetching messages for conversation: ${conversationId}`);

	const result = await db.select()
		.from(messages)
		.where(eq(messages.conversation_id, conversationId))
		.orderBy(messages.created_at);

	console.log(`Found ${result.length} messages`);
	return result;
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


import { db } from '$lib/server/db';
import { conversations, messages, users } from '$lib/server/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { validate as validateUuid } from 'uuid';

export async function getConversations(userId: string) {
	return await db.select()
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



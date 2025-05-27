
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
		return null;
	}


	const result = await db.select()
		.from(conversations)
		.where(and(
			eq(conversations.id, id),
			eq(conversations.user_id, userId)
		))
		.limit(1);

	if (result.length === 0) {
		return null;
	}

	return result[0];
}

export async function createConversation(title: string, userId: string) {

	const result = await db.insert(conversations)
		.values({
			title,
			user_id: userId
		})
		.returning();

	const newConversation = result[0];

	return newConversation;
}

export async function updateConversationTitle(id: string, title: string, userId: string) {
	// Check if the ID is a valid UUID
	if (!validateUuid(id)) {
		return null;
	}

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
		return null;
	}

	return result[0];
}

export async function deleteConversation(id: string, userId: string) {
	// Check if the ID is a valid UUID
	if (!validateUuid(id)) {
		return null;
	}

	return db.delete(conversations)
		.where(and(
			eq(conversations.id, id),
			eq(conversations.user_id, userId)
		));
}



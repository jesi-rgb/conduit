
import { db } from '$lib/server/db';
import { conversations } from '$lib/server/db/schema';
import { eq, desc, isNotNull, and } from 'drizzle-orm';

export async function getBranches(parentConvId: string) {
	const results = await db.select()
		.from(conversations)
		.where(
			and(
				eq(conversations.parent_conversation_id, parentConvId),
			));
	return results;
}

export async function getBranch(branchId: string) {
	return await db.select()
		.from(conversations)
		.where(
			and(
				eq(conversations.id, branchId),
			))
		.limit(1);
}


export async function createBranch({ messageId, parentId, title, userId }: { messageId: string, parentId: string, title: string, userId: string }) {
	if (!title) title = `${parentId}-${messageId}`

	const result = await db.insert(conversations)
		.values({
			parent_conversation_id: parentId,
			branch_from_message_id: messageId,
			user_id: userId,
			title: title
		})
		.returning();

	return result[0];
}

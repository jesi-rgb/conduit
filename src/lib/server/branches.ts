
import { db } from '$lib/server/db';
import { branches } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { validate as validateUuid } from 'uuid';

export async function getBranches(userId: string) {
	return await db.select()
		.from(branches)
		.where(eq(branches.parent_conversation_id, userId))
		.orderBy(desc(branches.updated_at));
}

export async function getBranch(branchId: string) {
	return await db.select()
		.from(branches)
		.where(eq(branches.id, branchId))
		.limit(1);
}


export async function createBranch({ messageId, parentId, branchName }: { messageId: string, parentId: string, branchName: string }) {
	if (!branchName) branchName = `${parentId}-${messageId}`

	const result = await db.insert(branches)
		.values({
			parent_conversation_id: parentId,
			branch_from_message_id: messageId,
			branch_name: branchName
		})
		.returning();

	return result[0];
}

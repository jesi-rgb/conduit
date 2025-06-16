import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { messages } from '$lib/server/db/schema';
import { and, eq, lte } from 'drizzle-orm';
import { createAIStreamHandler } from '$lib/server/stream-handler';
import type { Message } from '$lib/types';

export async function POST({ params, request }) {
	try {
		const { model, endpoint, bearerToken, branchingPointDate } = await request.json();

		// Fetch message history (logic is specific to this route)
		const originalMessages = await db.select()
			.from(messages)
			.where(and(eq(messages.conversation_id, params.id), lte(messages.created_at, new Date(branchingPointDate))))
			.orderBy(messages.created_at);

		const branchMessages = await db.select()
			.from(messages)
			.where(eq(messages.conversation_id, params.branch))
			.orderBy(messages.created_at);

		const previousMessages = [...originalMessages, ...branchMessages];
		const aiMessages = previousMessages.map((msg: Message) => ({
			role: msg.role,
			content: msg.content
		}));

		// Define the logic to run when the stream completes
		const onComplete = async (content: string, modelName: string) => {
			const [assistantMessage] = await db
				.insert(messages)
				.values({
					conversation_id: params.branch,
					content: content,
					role: 'assistant',
					generated_by: modelName
				})
				.returning();
			return assistantMessage;
		};

		// Use the shared handler to create the response
		return createAIStreamHandler(aiMessages, { model, endpoint, bearerToken }, onComplete);

	} catch (error) {
		console.error('Chat API error:', error);
		return json({ error: 'Failed to process message' }, { status: 500 });
	}
}

import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { messages } from '$lib/server/db/schema';
import { createAIStreamHandler } from '$lib/server/stream-handler';
import type { Message } from '$lib/types';

export async function POST({ params, request }) {
	try {
		const { model, messages: incomingMessages, endpoint, bearerToken } = await request.json();

		const aiMessages = incomingMessages.map((msg: Message) => ({
			role: msg.role,
			content: msg.content
		}));

		const idStreamingResponse = incomingMessages[incomingMessages.length - 1].id;

		// Define the logic to run when the stream completes
		const onComplete = async (content: string, reasoning: string, modelName: string) => {
			const [assistantMessage] = await db
				.insert(messages)
				.values({
					id: idStreamingResponse,
					conversation_id: params.id,
					content: content,
					reasoning: reasoning,
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

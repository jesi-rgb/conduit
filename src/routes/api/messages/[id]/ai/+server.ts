import { json } from '@sveltejs/kit';
import { generateStreamingAIResponse } from '$lib/server/ai';
import { db } from '$lib/server/db';
import { messages } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '$lib/server/auth/user';

export async function GET({ params, request }) {

	try {
		// Fetch previous messages for context
		const previousMessages = await db.select()
			.from(messages)
			.where(eq(messages.conversation_id, params.id))
			.orderBy(messages.created_at)
			.limit(30);

		// Prepare messages for AI
		const aiMessages = previousMessages.map(msg => ({
			role: msg.role,
			content: msg.content
		}));

		// Create a streaming response
		const stream = await generateStreamingAIResponse(aiMessages);

		// Create a new Response with the streaming content
		return new Response(
			new ReadableStream({
				async start(controller) {
					const reader = stream.getReader();
					let assistantResponse = '';

					try {

						while (true) {
							const { done, value } = await reader.read();

							if (done) {
								// Once streaming is complete, save the full AI response
								const assistantMessageResult = await db.insert(messages).values({
									conversation_id: params.id,
									content: assistantResponse,
									role: 'assistant',
								}).returning();

								const assistantMessage = assistantMessageResult[0];

								// Send the final assistant message
								controller.enqueue(
									JSON.stringify({
										type: 'assistantMessage',
										message: assistantMessage
									}) + '\n'
								);

								controller.close();
								break;
							}

							// Accumulate the response
							assistantResponse += value;

							// Send each chunk
							controller.enqueue(
								JSON.stringify({
									type: 'chunk',
									content: value
								}) + '\n'
							);
						}
					} catch (error) {
						console.error('Streaming error:', error);
						controller.error(error);
					}
				}
			}),
			{
				headers: {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					'Connection': 'keep-open'
				}
			}
		);

	} catch (error) {
		console.error('Chat API error:', error);
		return json({ error: 'Failed to process message' }, { status: 500 });
	}
}

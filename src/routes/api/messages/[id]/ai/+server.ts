import { json } from '@sveltejs/kit';
import { generateStreamingAIResponse } from '$lib/server/ai';
import { db } from '$lib/server/db';
import type { Message } from '$lib/types';
import { messages } from '$lib/server/db/schema';

export async function POST({ params, request }) {
	const { model, messages: incomingMessages, endpoint, bearerToken } = await request.json()

	try {
		const aiMessages = incomingMessages.map((msg: Message) => ({
			role: msg.role,
			content: msg.content
		}));

		// Create a streaming response
		const stream = await generateStreamingAIResponse(aiMessages, {
			model: model,
			bearerToken: bearerToken,
			endpoint: endpoint
		});

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
								console.log(done)
								const assistantMessageResult = await db.insert(messages).values({
									conversation_id: params.id,
									content: assistantResponse,
									role: 'assistant',
								}).returning();

								const assistantMessage = assistantMessageResult[0];

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

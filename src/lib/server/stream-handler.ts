import { generateStreamingAIResponse } from '$lib/server/ai';
import type { Message } from '$lib/types';

type AIOptions = {
	model: string;
	endpoint: string;
	bearerToken: string;
};

type AIRequestMessage = {
	role: 'user' | 'assistant' | 'system';
	content: string;
};

/**
 * A callback function to be executed when the AI stream is complete.
 * It receives the fully accumulated content and the model name.
 * It should handle saving the message to the database and return the saved message.
 */
type OnCompleteCallback = (content: string, reasoning: string, model: string) => Promise<Message>;

/**
 * Creates a streaming AI response handler.
 *
 * @param aiMessages The message history to send to the AI.
 * @param aiOptions Configuration for the AI request.
 * @param onComplete A callback function to execute after the stream finishes to save the final message.
 * @returns A SvelteKit `Response` object with the streaming data.
 */
export function createAIStreamHandler(
	aiMessages: AIRequestMessage[],
	aiOptions: AIOptions,
	onComplete: OnCompleteCallback
): Response {
	return new Response(
		new ReadableStream({
			async start(controller) {
				const stream = await generateStreamingAIResponse(aiMessages, aiOptions);
				const reader = stream.getReader();
				let accumulatedContent = '';
				let accumulatedReasoning = '';
				let finalModel = '';

				try {
					while (true) {
						const { done, value } = await reader.read();

						if (done) {
							const finalMessage = await onComplete(accumulatedContent, accumulatedReasoning, finalModel);
							controller.enqueue(
								JSON.stringify({
									type: 'assistantMessage',
									message: finalMessage
								}) + '\n'
							);
							controller.close();
							break;
						}

						const delta = value.choices[0]?.delta;
						const chunkContent = delta?.content ?? '';
						const chunkReasoning = delta?.reasoning ?? '';

						if (chunkContent) {
							accumulatedContent += chunkContent;
						}

						if (chunkReasoning) {
							accumulatedReasoning += chunkReasoning;
						}

						if (value.model && !finalModel) {
							finalModel = value.model;
						}

						// Send both content and reasoning to frontend, but keep them separate
						controller.enqueue(
							JSON.stringify({
								type: 'chunk',
								content: chunkContent,
								reasoning: chunkReasoning
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
				Connection: 'keep-alive'
			}
		}
	);
}

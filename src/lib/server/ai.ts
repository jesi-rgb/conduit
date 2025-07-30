import type { Message } from '$lib/types';
import { FALLBACK_MODEL } from '$lib/types';
import { PUBLIC_FALLBACK_OPENROUTER_KEY } from '$env/static/public';

type AIOptions = {
	model: string;
	endpoint: string;
	bearerToken: string;
};

export async function generateTitle(
	messages: Message[],
	{ model, endpoint, bearerToken }: AIOptions
): Promise<string> {
	// Use fallback if no user API key provided
	const finalBearerToken = bearerToken || PUBLIC_FALLBACK_OPENROUTER_KEY;
	const finalModel = bearerToken ? model : FALLBACK_MODEL;

	const titlePrompt = `Generate a short, concise title (3-8 words) that captures the main topic or question from this conversation. 
Base it on the user's initial question and the assistant's response.

Requirements:
- Maximum 8 words, but use as few as possible
- Focus on the core topic/subject
- Avoid generic phrases like "Help with" or "Question about"
- Use specific keywords when possible
- Make it descriptive enough to identify the conversation later.

These are the messages in question:

${JSON.stringify(messages)}
`;

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${finalBearerToken}`
		},
		body: JSON.stringify({
			model: finalModel,
			prompt: titlePrompt,
			temperature: 0.1
		})
	});

	const json = await response.json();
	const title = json.choices[0].text;

	return title;
}

export async function generateStreamingAIResponse(
	messages: Message[],
	{ model, endpoint, bearerToken }: AIOptions
): Promise<ReadableStream<string>> {
	// Use fallback if no user API key provided
	const finalBearerToken = bearerToken || PUBLIC_FALLBACK_OPENROUTER_KEY;
	const finalModel = bearerToken ? model : FALLBACK_MODEL;

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${finalBearerToken}`,
			Accept: 'text/event-stream',
			'HTTP-Referer': 'https://conduitchat.app',
			'X-Title': 'Conduit'
		},

		body: JSON.stringify({
			model: finalModel,
			messages: messages,
			temperature: 0.1,
			stream: true // Enable streaming
		})
	});

	// Check if the response is ok
	if (!response.ok) {
		throw new Error(`API error: ${response.statusText}`);
	}

	// Create a ReadableStream that parses the SSE response
	return new ReadableStream({
		start(controller) {
			// Use a TextDecoder to handle incoming bytes
			const decoder = new TextDecoder();

			// Create a reader for the response body
			const reader = response.body?.getReader();

			if (!reader) {
				controller.error('No reader available');
				return;
			}

			async function processStream() {
				try {
					const { done, value } = await reader!.read();

					if (done) {
						controller.close();
						return;
					}

					// Decode the chunk
					const chunk = decoder.decode(value, { stream: true });

					// Split the chunk into lines
					const lines = chunk.split('\n');

					// Process each line
					for (const line of lines) {
						if (line.startsWith('data: ')) {
							try {
								const trimmedLine = line.slice(6).trim();

								// Skip the [DONE] message
								if (trimmedLine === '[DONE]') continue;

								const parsedChunk = JSON.parse(trimmedLine);

								controller.enqueue(parsedChunk);
							} catch (parseError) {
								console.error('Error parsing line:', parseError);
							}
						}
					}

					// Continue processing the stream
					await processStream();
				} catch (error) {
					controller.error(error);
				}
			}

			// Start processing the stream
			processStream();
		}
	});
}

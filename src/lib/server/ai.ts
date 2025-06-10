import { env } from '$env/dynamic/private';

import type { Message } from '$lib/types';

const prompt = `Generate a short, concise title (3-8 words) that captures the main topic or question from this conversation. 
Base it on the user's initial question and the assistant's response.

Requirements:
- Maximum 8 words
- Focus on the core topic/subject
- Avoid generic phrases like "Help with" or "Question about"
- Use specific keywords when possible
- Make it descriptive enough to identify the conversation later
`

type AIOptions = {
	model: string;
	endpoint: string;
	bearerToken: string;
}

export async function generateTitle(messages: Message[], { model, endpoint, bearerToken }: AIOptions): Promise<string> {
	if (!bearerToken) {
		throw Error('API Key is not set')
	}

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${bearerToken}`,
		},
		body: JSON.stringify({
			model: model,
			messages: [
				{ role: 'system', content: prompt },
				...messages
			],
			temperature: 0.1,
			max_tokens: 10,
		})
	});

	return response.text()
}

export async function generateStreamingAIResponse(messages: Message[], { model, endpoint, bearerToken }: AIOptions): Promise<ReadableStream<string>> {
	if (!bearerToken) {
		throw Error('API Key is not set')
	}

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${bearerToken}`,
			'Accept': 'text/event-stream'
		},
		body: JSON.stringify({
			model: model,
			messages: messages,
			temperature: 0.1,
			max_tokens: 800,
			stream: true // Enable streaming
		})
	});

	// Check if the response is ok
	if (!response.ok) {
		throw new Error(`OpenAI API error: ${response.statusText}`);
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
					const { done, value } = await reader.read();

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

								// Extract the delta content from the response
								const content = parsedChunk.choices[0]?.delta?.content;

								if (content) {
									controller.enqueue(content);
								}
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

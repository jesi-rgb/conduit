

import { env } from '$env/dynamic/private';

import type { Message } from '$lib/types';
import { json } from '@sveltejs/kit';

const prompt = 'Generate a title for the conversation that is being had between the user and the AI. The title should be short, no longer than 6 words, and descriptive.'

export async function generateTitle(messages: Message[]): Promise<string> {

	if (!env.OPENAI_API_KEY) {
		return "API key is not configured.";
	}

	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: 'gpt-4.1-nano',
			messages: [
				{ role: 'system', content: prompt },
				...messages
			],
			temperature: 0.1,
			max_tokens: 6,
		})
	});

	return response.text()
}

export async function generateStreamingAIResponse(messages: Message[]): Promise<ReadableStream<string>> {
	// If we don't have an OpenAI API key, return a fallback response
	if (!env.OPENAI_API_KEY) {
		console.warn('OPENAI_API_KEY is not set. Returning fallback response.');

		return new ReadableStream({
			start(controller) {
				controller.enqueue("API key is not configured.");
				controller.close();
			}
		});
	}

	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
			'Accept': 'text/event-stream'
		},
		body: JSON.stringify({
			model: 'gpt-4.1-nano',
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

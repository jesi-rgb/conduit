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

export async function generateFollowUpQuestions(
	messages: Message[],
	{ model, endpoint, bearerToken }: AIOptions
): Promise<string[]> {
	// Use fallback if no user API key provided or if bearerToken is a JWT (Supabase token)
	const isJWT = bearerToken && bearerToken.includes('.');
	const shouldUseFallback = !bearerToken || isJWT;

	const finalBearerToken = shouldUseFallback ? PUBLIC_FALLBACK_OPENROUTER_KEY : bearerToken;
	const finalModel = shouldUseFallback ? FALLBACK_MODEL : model;

	console.log('AI function - bearerToken:', bearerToken);
	console.log('AI function - isJWT:', isJWT);
	console.log('AI function - shouldUseFallback:', shouldUseFallback);
	console.log('AI function - finalBearerToken:', finalBearerToken);
	console.log('AI function - finalModel:', finalModel);

	const followUpPrompt = `Based on this conversation, suggest 3-4 short follow-up topics (3-4 words each) the user might want to explore next.

Focus on:
- Natural extensions of the current topic
- Related concepts not yet discussed
- Practical applications or examples
- Alternative approaches or perspectives

Return ONLY a JSON array of short strings (3-4 words each), no other text.
Examples: ["scale larger datasets", "security implications", "alternative frameworks", "error handling implementation"]

Conversation context:
${JSON.stringify(messages)}`;

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${finalBearerToken}`,
			'HTTP-Referer': 'https://conduitchat.app',
			'X-Title': 'Conduit'
		},
		body: JSON.stringify({
			model: finalModel,
			messages: [{ role: 'user', content: followUpPrompt }],
			temperature: 0.3
		})
	});

	console.log(response);

	if (!response.ok) {
		throw new Error(`API error: ${response.statusText}`);
	}

	const json = await response.json();
	const result = json.choices[0].message.content.trim();

	try {
		// Clean the result string - remove any markdown formatting or extra text
		const cleanResult = result
			.replace(/```json\n?/g, '')
			.replace(/```\n?/g, '')
			.trim();
		const questions = JSON.parse(cleanResult);
		return Array.isArray(questions) ? questions : [];
	} catch (error) {
		console.error('JSON parsing error:', error);
		console.error('Raw result:', result);
		// Fallback if JSON parsing fails
		return [];
	}
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

								// Skip empty lines
								if (!trimmedLine) continue;

								const parsedChunk = JSON.parse(trimmedLine);

								controller.enqueue(parsedChunk);
							} catch (parseError) {
								console.error('Error parsing line:', parseError);
								console.error('Problematic line:', line);
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

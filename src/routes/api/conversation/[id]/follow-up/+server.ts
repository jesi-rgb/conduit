import { getCurrentUser } from '$lib/server/auth/user';
import { getLastNMessages } from '$lib/server/messages';
import { generateFollowUpQuestions } from '$lib/server/ai';
import { json } from '@sveltejs/kit';
import type { Message } from '$lib/types';

export async function GET({
	params,
	request
}: {
	params: Record<string, string>;
	request: Request;
}) {
	try {
		const { id } = params;

		// Get current user for auth
		const user = await getCurrentUser(request);
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get last N messages from conversation
		const dbMessages = await getLastNMessages(id, 4);
		if (!dbMessages || dbMessages.length === 0) {
			return json({ questions: [] });
		}

		const contextMessages: Message[] = dbMessages
			.filter((msg) => msg.role === 'user' || msg.role === 'assistant')
			.map((msg) => ({
				id: msg.id,
				conversation_id: msg.conversation_id,
				role: msg.role,
				content: msg.content,
				reasoning: msg.reasoning ?? undefined,
				created_at: msg.created_at,
				generated_by: msg.generated_by ?? undefined
			}));

		if (contextMessages.length === 0) {
			return json({ questions: [] });
		}

		const openrouterKey = request.headers.get('X-OpenRouter-Key') || '';

		console.log('OpenRouter key provided:', !!openrouterKey);

		const questions = await generateFollowUpQuestions(contextMessages, {
			model: 'openai/gpt-4o-mini', // Default model when user has API key
			endpoint: 'https://openrouter.ai/api/v1/chat/completions',
			bearerToken: openrouterKey
		});

		return json({ questions });
	} catch (error) {
		console.error('Error generating follow-up questions:', error);
		return json({ questions: [] }); // Graceful fallback
	}
}

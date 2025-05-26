
import { json } from '@sveltejs/kit';
import { getCurrentUser } from '$lib/server/auth/user';
import {
	getConversations,
	createConversation,
	deleteConversation
} from '$lib/server/conversation';

export async function GET({ request }: { request: Request }) {
	const user = await getCurrentUser(request);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const conversations = await getConversations(user.id);
	return json({ conversations });
}

export async function POST({ request }: { request: Request }) {
	const user = await getCurrentUser(request);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { title = 'New Conversation' } = await request.json();
		const conversation = await createConversation(title, user.id);
		return json({ conversation });
	} catch (error) {
		console.error('Error creating conversation:', error);
		return json({ error: 'Failed to create conversation' }, { status: 500 });
	}
}

export async function DELETE({ request }: { request: Request }) {
	const user = await getCurrentUser(request);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { conversationId } = await request.json();

		if (!conversationId) {
			return json({ error: 'Conversation ID is required' }, { status: 400 });
		}

		await deleteConversation(conversationId, user.id);
		return json({ success: true });
	} catch (error) {
		console.error('Error deleting conversation:', error);
		return json({ error: 'Failed to delete conversation' }, { status: 500 });
	}
}

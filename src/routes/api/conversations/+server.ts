
import { json } from '@sveltejs/kit';
import { getCurrentUser } from '$lib/server/auth/user';
import {
	getConversations,
	createConversation,
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
		const requestBody = await request.json();
		const { title } = requestBody;
		const conversation = await createConversation(title, user.id);
		return json({ conversation });
	} catch (error) {
		console.error('Error creating conversation:', error);
		return json({ error: 'Failed to create conversation' }, { status: 500 });
	}
}


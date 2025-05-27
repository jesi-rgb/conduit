import { json } from "@sveltejs/kit";
import { deleteConversation, getConversation } from "$lib/server/conversation";
import { getCurrentUser } from "$lib/server/auth/user";

export async function GET({ params, request }: { params: Record<string, string>, request: Request }) {
	const user = await getCurrentUser(request);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params

	const conversation = await getConversation(id, user.id);
	return json({ conversation });
}

export async function DELETE({ params, request }: { params: Record<string, string>, request: Request }) {
	const user = await getCurrentUser(request);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params

	await deleteConversation(id, user.id);

	return json({ status: 200 });
}

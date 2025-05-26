import { json } from "@sveltejs/kit";
import { getConversation } from "$lib/server/conversation";
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

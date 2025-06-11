import { getCurrentUser } from "$lib/server/auth/user";
import { getMessages, createMessage } from "$lib/server/messages";
import type { Message } from "$lib/types";
import { json } from "@sveltejs/kit";



export async function GET({ params, request }: { request: Request }) {
	const { id } = params
	const messages = await getMessages(id);

	return json({ messages })

}

export async function POST({ params, request }: { request: Request }) {
	const { id } = params
	const msg: Message = (await request.json());
	await createMessage({ id: msg.id, conversationId: id, role: msg.role, content: msg.content })

	// return 200 OK

	return json({ status: 200 })
}

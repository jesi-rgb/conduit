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
	const msgText: Message = (await request.json());
	console.log(msgText)
	await createMessage({ conversationId: id, role: msgText.role, content: msgText.content })

	// return 200 OK

	return json({ status: 200 })
}

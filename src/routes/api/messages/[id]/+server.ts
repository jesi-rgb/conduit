import { getCurrentUser } from "$lib/server/auth/user";
import { getMessages } from "$lib/server/messages";
import { json } from "@sveltejs/kit";



export async function GET({ params, request }: { request: Request }) {
	const { id } = params
	const messages = await getMessages(id);

	return json({ messages })

}

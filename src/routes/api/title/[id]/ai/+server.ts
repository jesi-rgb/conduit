import { generateTitle } from "$lib/server/ai";

import type { Message } from '$lib/types';
import { json } from "@sveltejs/kit";


export const POST = async ({ request, params, fetch }) => {
	const { id } = params
	const { messages, model, endpoint, bearerToken } = await request.json();

	const prunedMessages = messages.map((msg: Message) => {
		return {
			role: msg.role,
			content: msg.content
		}
	})

	const title = await generateTitle(prunedMessages, {
		model: model,
		endpoint: endpoint,
		bearerToken: bearerToken

	})

	await fetch(`/api/title/${id}`, {
		method: 'POST',
		body: JSON.stringify({ title })
	})


	return json({ status: 200 })
}

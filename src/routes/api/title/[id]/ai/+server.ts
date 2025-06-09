import { generateTitle } from "$lib/server/ai";

import type { Message } from '$lib/types';
import { json } from "@sveltejs/kit";


export const POST = async ({ request, params, fetch }) => {
	const { id } = params
	const { messages } = await request.json();

	const prunedMessages = messages.map((msg: Message) => {
		return {
			role: msg.role,
			content: msg.content
		}
	})

	const titleData = await generateTitle(prunedMessages)
	const title = JSON.parse(titleData)['choices'][0]['message']['content']

	await fetch(`/api/title/${id}`, {
		method: 'POST',
		body: JSON.stringify({ title })
	})


	return json({ status: 200 })
}

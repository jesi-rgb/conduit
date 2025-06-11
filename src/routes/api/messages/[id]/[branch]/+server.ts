

import { getBranch } from "$lib/server/branches";
import { createMessage, getMessages } from "$lib/server/messages";
import { json } from "@sveltejs/kit";

export async function GET({ params, request }: { request: Request }) {
	const { id, branch } = params
	const branchData = await getMessages(branch);
	return json({ branch: branchData })
}


export async function POST({ params, request }: { request: Request }) {
	const { id, branch } = params
	const { message: msg } = (await request.json());

	const message = await createMessage({
		id: msg.id, conversationId: branch,
		role: msg.role,
		content: msg.content
	})

	// return the newly created messge
	return json({ message })
}



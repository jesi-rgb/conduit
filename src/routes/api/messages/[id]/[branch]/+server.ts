

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
	const msgText = (await request.json());
	await createMessage({ id: msgText.id, conversationId: branch, role: msgText.role, content: msgText.content })

	// return 200 OK

	return json({ status: 200 })
}



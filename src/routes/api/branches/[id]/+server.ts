import { createBranch, getBranches } from "$lib/server/branches";
import type { Branch } from "$lib/types";
import { json } from "@sveltejs/kit";

export async function GET({ params, request }: { request: Request }) {
	const { id } = params
	const branches = await getBranches(id);

	return json({ branches })
}

export async function POST({ params, request }: { request: Request }) {
	const branchData: Branch = await request.json()
	await createBranch({
		messageId: branchData.branch_from_message_id,
		parentId: branchData.parent_conversation_id,
		branchName: branchData.branch_name
	})

	return json({ status: 200 })
}

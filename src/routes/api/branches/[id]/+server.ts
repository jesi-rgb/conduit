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
	console.log(branchData)

	const branch = await createBranch({
		messageId: branchData.branch_from_message_id,
		parentId: branchData.parent_conversation_id,
		title: branchData.selected_text ? branchData.selected_text : "New Branch",
		userId: branchData.user_id,
		selected_text: branchData.selected_text,
		selection_end_offset: branchData.selection_end_offset,
		selection_start_offset: branchData.selection_start_offset,
		selection_node_index: branchData.selection_node_index,
		selection_node_type: branchData.selection_node_type
	})

	return json({ branch })
}

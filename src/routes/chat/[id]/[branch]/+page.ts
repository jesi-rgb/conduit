import { fetchWithAuth } from "$lib/client/auth";
import { globalState } from "../../../../stores/stores.svelte";
import { ChatStateClass } from "../ChatState.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch, parent }) => {

	const { chatState } = await parent()

	chatState.fetchMessages = async () => {
		const response = await fetchWithAuth({ url: `/api/messages/${params.id}/${params.branch}`, svelteFetch: fetch });
		const branchMsgs = (await response.json()).branch;
		chatState.currentBranch = branchMsgs
	}

	chatState.fetchMessages()

	return { chatState };

}

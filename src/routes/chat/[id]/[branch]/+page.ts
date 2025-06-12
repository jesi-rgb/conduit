import { fetchWithAuth } from "$lib/client/auth";
import { globalState } from "../../../../stores/stores.svelte";
import { ChatStateClass } from "../ChatState.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params, fetch }) => {

	const chatState = new ChatStateClass(params.id);

	chatState.fetchMessages = async () => {
		const response = await fetchWithAuth({ url: `/api/messages/${params.id}/${params.branch}`, svelteFetch: fetch });
		const branchMsgs = (await response.json()).branch;
		chatState.messages = branchMsgs
		globalState.currentMessages = chatState.messages
	}

	chatState.fetchMessages()

	return { chatState };

}

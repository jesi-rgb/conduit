
import { fetchWithAuth } from "$lib/client/auth";
import { globalState } from "../../../stores/stores.svelte";
import type { PageLoad } from "./$types";
import { ChatStateClass } from "./ChatState.svelte";

export const load: PageLoad = ({ params, fetch }) => {

	const chatState = new ChatStateClass(params.id);

	chatState.fetchMessages = async () => {
		const response = await fetchWithAuth({ url: `/api/messages/${chatState.conversation_id}`, svelteFetch: fetch })
		const msgs = (await response.json()).messages;
		chatState.messages = msgs
		globalState.currentMessages = chatState.messages
	}
	chatState.fetchMessages()

	chatState.saveMainConvo = async () => {
		const response = await fetchWithAuth({ url: `/api/messages/${params.id}`, svelteFetch: fetch });
		const convo = await response.json();
		chatState.mainConversation = convo.messages
	}
	chatState.saveMainConvo()


	globalState.fetchBranches = async () => {
		const response = await fetchWithAuth({ url: `/api/branches/${chatState.conversation_id}`, svelteFetch: fetch })
		const branches = (await response.json()).branches;
		globalState.currentBranches = branches
	}

	globalState.fetchBranches()

	return { chatState };

}

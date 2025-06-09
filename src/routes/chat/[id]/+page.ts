import { fetchWithAuth } from "$lib/client/auth";
import { globalState } from "../../../stores/stores.svelte";
import type { PageLoad } from "./$types";
import { ChatStateClass } from "./ChatState.svelte";

export const load: PageLoad = ({ params, fetch }) => {

	const chatState = new ChatStateClass(params.id);


	chatState.fetchMessages = async () => {
		const response = await fetchWithAuth(`/api/messages/${chatState.conversation_id}`, fetch)
		const msgs = (await response.json()).messages;
		chatState.messages = msgs
		globalState.currentMessages = chatState.messages
	}

	chatState.fetchMessages()

	return { chatState };

}

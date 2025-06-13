import { get } from 'svelte/store'; // ➜ Import get
import { activeChatState } from '../../../stores/chatStore.svelte'; // ➜ Import the store
import { fetchWithAuth } from "$lib/client/auth";
import { globalState } from "../../../stores/stores.svelte";
import type { PageLoad } from "./$types";
import { ChatStateClass } from "./ChatState.svelte";

export const load: PageLoad = ({ params, fetch }) => {

	const existingState = get(activeChatState);

	let chatState: ChatStateClass;

	// ❗️ If a state exists in the store and its ID matches the URL, use it.
	// This is the state that survived the navigation from `/chat`.
	if (existingState && existingState.conversation_id === params.id) {
		chatState = existingState;
	} else {
		// Otherwise, this is a direct load/refresh. Create a new state.
		chatState = new ChatStateClass(params.id);
		activeChatState.set(chatState); // ➜ Put the new instance in the store

		// Fetch existing messages for this conversation
		chatState.saveMainConvo = async () => {
			const response = await fetchWithAuth({ url: `/api/messages/${params.id}`, svelteFetch: fetch });
			const convo = await response.json();
			chatState.mainConversation = convo.messages;
			chatState.messages = convo.messages; // Also populate the main messages array
		};
		chatState.saveMainConvo();
	}

	// These can be defined outside the if/else block
	globalState.fetchBranches = async () => {
		const response = await fetchWithAuth({
			url: `/api/messages/${chatState.conversation_id}`,
			svelteFetch: fetch
		});
		const messages = (await response.json()).messages;
		globalState.currentMessages = messages;
	};
	globalState.fetchBranches();

	return { chatState };
}

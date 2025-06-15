import { get } from 'svelte/store'; // ➜ Import get
import { activeChatState } from '../../../stores/chatStore.svelte'; // ➜ Import the store
import { fetchWithAuth } from "$lib/client/auth";
import { globalState } from "../../../stores/stores.svelte";
import type { PageLoad } from "./$types";
import { ChatStateClass } from "./ChatState.svelte";

export const load: PageLoad = ({ params, fetch }) => {

	const existingState = get(activeChatState);

	let chatState: ChatStateClass;

	globalState.fetchBranches = async () => {
		const response = await fetchWithAuth({
			url: `/api/branches/${params.id}`,
			svelteFetch: fetch
		});
		const branches = (await response.json()).branches;
		globalState.currentBranches = branches;
	};

	globalState.fetchCurrentMessages = async () => {
		const response = await fetchWithAuth({
			url: `/api/messages/${params.id}`,
			svelteFetch: fetch
		});
		const msg = (await response.json()).messages;
		globalState.currentMessages = msg;
	}

	if (existingState && existingState.conversation_id === params.id) {
		chatState = existingState;
		globalState.fetchCurrentMessages()
	} else {
		chatState = new ChatStateClass(params.id);
		activeChatState.set(chatState);

		chatState.saveMainConvo = async () => {
			const response = await fetchWithAuth({ url: `/api/messages/${params.id}`, svelteFetch: fetch });
			const convo = await response.json();
			chatState.mainConversation = convo.messages;
			chatState.messages = convo.messages;
		};
		chatState.saveMainConvo();
		globalState.fetchCurrentMessages()
	}

	globalState.fetchCurrentMessages();
	globalState.fetchBranches();


	return { chatState };
}

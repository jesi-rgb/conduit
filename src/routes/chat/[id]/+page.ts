import { ChatStateClass } from "./ChatState.svelte";


export async function load({ params, fetch }) {

	const chatState = new ChatStateClass(params.id);

	chatState.fetchMessages = async () => {
		const response = await fetch(`/api/messages/${chatState.conversation_id}`)
		const msgs = (await response.json()).messages;
		chatState.messages = msgs
	}

	chatState.fetchMessages()
	return { chatState };

}

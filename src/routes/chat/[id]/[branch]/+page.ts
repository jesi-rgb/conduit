import { fetchWithAuth } from "$lib/client/auth";
import { globalState } from "../../../../stores/stores.svelte";
import { ChatStateClass } from "../ChatState.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params, fetch }) => {

	const chatState = new ChatStateClass(params.id);

	chatState.fetchMessages = async () => {
		const response = await fetch(`/api/messages/${params.id}/${params.branch}`)
		const branchMsgs = (await response.json()).branch;
		chatState.messages = branchMsgs
		globalState.currentMessages = chatState.messages
	}


	chatState.streamResponse = async () => {
		chatState.isStreaming = true

		// Create initial streaming message
		chatState.streamingMessage = {
			id: crypto.randomUUID(),
			role: 'assistant',
			content: '',
			created_at: new Date(),
			conversation_id: chatState.conversation_id
		};

		chatState.messages.push(chatState.streamingMessage);


		const response = await fetchWithAuth(`/api/messages/${chatState.conversation_id}/${params.branch}/ai`);
		const reader = response.body?.getReader();
		const decoder = new TextDecoder();

		while (true) {
			const { done, value } = await reader?.read()!;
			if (done) break;

			const chunk = decoder.decode(value);
			const lines = chunk.split('\n').filter((line) => line.trim() !== '');

			for (const line of lines) {
				try {
					const parsedChunk = JSON.parse(line);

					if (parsedChunk.type === 'chunk') {
						// Update streaming message content
						chatState.streamingMessage!.content += parsedChunk.content;
					} else if (parsedChunk.type === 'assistantMessage') {
						// Replace streaming message with final DB message
					}
				} catch (parseError) {
					console.error('Error parsing chunk:', parseError);
				}
			}
			// scrolling behavior is tricky... scrolling as message streams in
			// is a bit dizzying at times, maybe should leave disabled
			// chatState.scrollContainer()
		}

		chatState.isStreaming = false

		if (chatState.messages.length == 2) {
			chatState.editTitle()
		}
	};

	chatState.fetchMessages()

	return { chatState };

}

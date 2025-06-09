import { goto } from '$app/navigation';
import { fetchWithAuth } from '$lib/client/auth';
import type { Message, ChatState, Branch } from '$lib/types';
import { globalState } from '../../../stores/stores.svelte';

export class ChatStateClass implements ChatState {
	#conversation_id = $state('');
	#messages = $state<Message[]>([]);

	title = $derived(globalState.conversations.find(conv => conv.id == this.conversation_id)?.title!);
	isLoading = $state(false);
	isStreaming = $state(false);
	onFinishSend = () => { };
	scrollContainer = () => { };

	#streamingMessage = $state<Message | null>(null);

	// Add getter for UI to access
	get streamingMessage() {
		return this.#streamingMessage;
	}
	set streamingMessage(message: Message | null) {
		this.#streamingMessage = message;
	}

	constructor(conv_id: string) {
		this.conversation_id = conv_id
	}
	get messages() {
		return this.#messages
	}
	set messages(messages: Message[]) {
		this.#messages = messages
	}

	set conversation_id(conv_id: string) {
		this.#conversation_id = conv_id;
	}
	get conversation_id() {
		return this.#conversation_id;
	}

	sendMessage = async (message: string) => {
		this.isLoading = true;

		//here we would send to database?
		const newMsg: Message = {
			id: crypto.randomUUID(),
			role: 'user',
			content: message,
			created_at: new Date(),
			conversation_id: this.conversation_id
		}
		this.#messages.push(newMsg);

		// post msg to database
		await fetchWithAuth({
			url: `/api/messages/${this.conversation_id}`, options: {
				method: 'POST',
				body: JSON.stringify(newMsg)
			}
		})

		this.scrollContainer()

		this.streamResponse()

		this.isLoading = false;
	};

	streamResponse = async () => {
		this.isStreaming = true

		// Create initial streaming message
		this.#streamingMessage = {
			id: crypto.randomUUID(),
			role: 'assistant',
			content: '',
			created_at: new Date(),
			conversation_id: this.conversation_id
		};

		this.messages.push(this.#streamingMessage);


		const response = await fetchWithAuth({ url: `/api/messages/${this.conversation_id}/ai` });
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
						this.#streamingMessage!.content += parsedChunk.content;
					} else if (parsedChunk.type === 'assistantMessage') {
						// Replace streaming message with final DB message
					}
				} catch (parseError) {
					console.error('Error parsing chunk:', parseError);
				}
			}
			// this is tricky... scrolling as message streams in
			// is a bit dizzying at times, maybe should leave disabled
			// this.scrollContainer()
		}

		this.isStreaming = false

		if (this.messages.length == 2) {
			this.editTitle()
		}
	};

	editTitle = async () => {
		await fetchWithAuth({ url: `/api/title/${this.conversation_id}/ai`, options: { method: 'POST', body: JSON.stringify({ messages: this.messages }) } });

		globalState.fetchConversations()

	};

	sendMessageInBranch = async (message: string, branch: string) => {
		this.isLoading = true;

		const newMsg: Message = {
			id: crypto.randomUUID(),
			role: 'user',
			content: message,
			created_at: new Date(),
			conversation_id: branch
		};
		this.messages.push(newMsg);

		const response = await fetchWithAuth({
			url: `/api/messages/${this.conversation_id}/${branch}`, options: {
				method: 'POST',
				body: JSON.stringify(newMsg)
			}
		});
		const lastMessage: Message = (await response.json()).message

		this.streamResponseInBranch(lastMessage, branch)

		this.isLoading = false;
		this.onFinishSend();
	}

	streamResponseInBranch = async (lastMessage: Message, branch: string) => {
		this.isStreaming = true

		// Create initial streaming message
		this.#streamingMessage = {
			id: crypto.randomUUID(),
			role: 'assistant',
			content: '',
			created_at: new Date(),
			conversation_id: this.conversation_id
		};

		this.messages.push(this.#streamingMessage);


		const response = await fetchWithAuth({
			url: `/api/messages/${this.conversation_id}/${branch}/ai`, options: {
				method: 'POST',
				body:
					JSON.stringify(lastMessage)
			}
		});
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
						this.#streamingMessage!.content += parsedChunk.content;
					} else if (parsedChunk.type === 'assistantMessage') {
						// Replace streaming message with final DB message
					}
				} catch (parseError) {
					console.error('Error parsing chunk:', parseError);
				}
			}
		}

		this.isStreaming = false
	};



	fetchMessages = async () => { };

	branchOut = async () => {
		this.isLoading = true;

		this.fetchMessages()

		const message = this.messages[this.messages.length - 1];
		const newBranch: Branch = {
			parent_conversation_id: this.conversation_id,
			branch_from_message_id: message.id!.trim(),
			title: `${this.conversation_id}-${message.id}`,
			user_id: globalState.user!.id
		}

		const branchData = await fetchWithAuth({
			url: `/api/branches/${this.conversation_id}`, options: {
				method: 'POST',
				body: JSON.stringify(newBranch)
			}
		})
		const branchJson = await branchData.json()
		const branchId = branchJson.branch.id

		globalState.fetchBranches()

		goto(`/chat/${this.conversation_id}/${branchId}`)

		this.isLoading = false;
	}
}

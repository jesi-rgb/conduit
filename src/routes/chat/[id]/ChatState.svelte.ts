import { goto } from '$app/navigation';
import { fetchWithAuth } from '$lib/client/auth';
import { type Message, type Branch, CONDUIT_OPEN_ROUTER_KEY } from '$lib/types';
import { globalState } from '../../../stores/stores.svelte';

export interface ChatState {
	messages: Message[];
	conversation_id: string;
	mainConversation: Message[];
	currentBranch: Message[];
	title: string;
	isLoading: boolean;
	isStreaming: boolean;
	controller: AbortController;
	saveMainConvo: () => void;
	sendMessage: (message: string) => void;
	scrollContainer: () => void;
	editTitle: () => void;
	streamResponse: () => void;
	cancelStream: () => void;
	streamResponseInBranch: (lastMessage: Message, branch: string) => void;
	sendMessageInBranch: (message: string, branch: string) => void;
	fetchMessages: () => void;
	onFinishSend: () => void;
	onFinishStream: () => void;
	branchOut: () => void;
	branchFromSelection: (message: Message, selectionData: {
		text: string,
		nodeType: string,
		nodeIndex: number,
		startOffset: number,
		endOffset: number
	}) => Promise<void>;
}

export class ChatStateClass implements ChatState {
	#conversation_id = $state('');
	#messages = $state<Message[]>([]);
	#mainConversation: Message[] = $state([]);
	#currentBranch: Message[] = $state([]);
	#controller: AbortController = new AbortController();

	title = $derived(globalState.conversations.find(conv => conv.id == this.conversation_id)?.title!);
	isLoading = $state(false);
	isStreaming = $state(false);
	onFinishSend = () => { };
	scrollContainer = () => { };
	saveMainConvo = () => { };

	#streamingMessage = $state<Message | null>(null);
	#streamingReasoning = $state<string>('');

	constructor(conv_id?: string) {
		if (conv_id) {
			this.conversation_id = conv_id
		}
	}

	get mainConversation() {
		return this.#mainConversation;
	}
	set mainConversation(messages: Message[]) {
		this.#mainConversation = messages;
	}

	get currentBranch() {
		return this.#currentBranch;
	}
	set currentBranch(messages: Message[]) {
		this.#currentBranch = messages;
	}

	// Add getter for UI to access
	get streamingMessage() {
		return this.#streamingMessage;
	}
	set streamingMessage(message: Message | null) {
		this.#streamingMessage = message;
	}

	get streamingReasoning() {
		return this.#streamingReasoning;
	}
	set streamingReasoning(content: string) {
		this.#streamingReasoning = content;
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
		this.messages.push(newMsg);
		globalState.currentMessages.push(newMsg)

		// post msg to database
		await fetchWithAuth({
			url: `/api/messages/${this.conversation_id}`, options: {
				method: 'POST',
				body: JSON.stringify(newMsg)
			}
		})

		this.streamResponse()

		this.isLoading = false;

		this.scrollContainer()
	};


	cancelStream = async () => {
		this.#controller.abort()

		await fetchWithAuth({
			url: `/api/messages/${this.conversation_id}`, options: {
				method: 'POST',
				body: JSON.stringify(this.#streamingMessage)
			}
		})
		this.isStreaming = false

		if (this.messages.length == 2) {
			this.editTitle()
		}
		globalState.fetchConversations()
	}

	streamResponse = async () => {
		this.isStreaming = true

		// Create initial streaming message
		this.#streamingMessage = {
			id: crypto.randomUUID(),
			role: 'assistant',
			content: '',
			reasoning: '',
			created_at: new Date(),
			conversation_id: this.conversation_id
		};

		this.messages.push(this.#streamingMessage);

		try {
			const response = await fetchWithAuth({
				url: `/api/messages/${this.conversation_id}/ai`,
				options: {
					method: 'POST',
					body:
						JSON.stringify({
							model: globalState.modelIdSelected,
							endpoint: 'https://openrouter.ai/api/v1/chat/completions',
							messages: this.messages,
							bearerToken: localStorage.getItem(CONDUIT_OPEN_ROUTER_KEY)
						}), signal: this.#controller.signal
				}
			});

			this.#processStream(response)

			this.isStreaming = false

			globalState.currentMessages.push(this.#streamingMessage)

			if (this.messages.length == 2) {
				this.editTitle()
			}

			this.onFinishStream()

		} catch (error: any) {
			console.log(error)
			this.messages.push({
				id: crypto.randomUUID(),
				role: 'assistant',
				content: error.message,
				created_at: new Date(),
				conversation_id: this.conversation_id
			})
			this.isLoading = false
			this.isStreaming = false
			return
		}
	};

	editTitle = async () => {
		await fetchWithAuth({
			url: `/api/title/${this.conversation_id}/ai`, options: {
				method: 'POST', body: JSON.stringify({
					messages: this.messages,
					model: 'openai/gpt-4.1-mini',
					endpoint: 'https://openrouter.ai/api/v1/completions',
					bearerToken: localStorage.getItem('conduit-open-router')
				})
			}
		});

		globalState.fetchConversations()

	};

	sendMessageInBranch = async (message: string, branch: string) => {
		this.isLoading = true;

		const newMsg: Message = {
			id: crypto.randomUUID(),
			role: 'user',
			content: message,
			created_at: new Date(),
			conversation_id: this.conversation_id
		}

		this.currentBranch.push(newMsg)

		await fetchWithAuth({
			url: `/api/messages/${this.conversation_id}/${branch}`, options: {
				method: 'POST',
				body: JSON.stringify({
					message: newMsg
				})
			}
		});

		this.streamResponseInBranch(newMsg, branch)

		this.isLoading = false;

		this.onFinishSend();
	}

	streamResponseInBranch = async (lastMessage: Message, branch: string) => {
		this.isStreaming = true

		const response = await fetchWithAuth({
			url: `/api/messages/${this.conversation_id}/${branch}/ai`, options: {
				method: 'POST',
				body:
					JSON.stringify({
						model: globalState.modelIdSelected,
						endpoint: 'https://openrouter.ai/api/v1/chat/completions',
						branchingPointDate: lastMessage.created_at,
						bearerToken: localStorage.getItem('conduit-open-router')
					})
			}
		});

		// Create initial streaming message
		this.#streamingMessage = {
			id: crypto.randomUUID(),
			role: 'assistant',
			content: '',
			reasoning: '',
			created_at: new Date(),
			conversation_id: this.conversation_id
		};

		this.currentBranch.push(this.#streamingMessage);

		this.#processStream(response)

		this.isStreaming = false
	};

	#processStream = async (response: Response) => {
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
						if (parsedChunk.content) {
							this.#streamingMessage!.content += parsedChunk.content;
						} else if (parsedChunk.reasoning) {
							this.#streamingMessage!.reasoning += parsedChunk.reasoning
						}
					}
				} catch (parseError) {
					console.error('Error parsing chunk:', parseError);
				}
			}
		}
	}

	fetchMessages = async () => { };

	onFinishStream = () => { };

	branchOut = async (message: Message) => {
		this.isLoading = true;

		this.fetchMessages()

		console.log('branching from ', message.id)

		const newBranch: Branch = {
			parent_conversation_id: this.conversation_id,
			branch_from_message_id: message.id!.trim(),
			title: 'New Branch',
			user_id: globalState.user!.id,
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

	branchFromSelection = async (message: Message,
		selectionData: {
			text: string,
			nodeType: string,
			nodeIndex: number,
			startOffset: number,
			endOffset: number
		}) => {
		this.isLoading = true

		this.fetchMessages()

		const newBranch: Branch = {
			parent_conversation_id: this.conversation_id,
			branch_from_message_id: message.id!.trim(),
			title: globalState.currentSelectedText,
			user_id: globalState.user!.id,
			selected_text: selectionData.text,
			selection_end_offset: selectionData.endOffset,
			selection_start_offset: selectionData.startOffset,
			selection_node_index: selectionData.nodeIndex,
			selection_node_type: selectionData.nodeType
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

		this.isLoading = false
	}
}

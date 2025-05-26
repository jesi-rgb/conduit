import type { Message, ChatState } from '$lib/types';

export class ChatStateClass implements ChatState {
	#conversation_id = $state('');
	#chat_messages = $state<Message[]>([]);
	isLoading = $state(false);
	fetchMessages = () => { };
	onFinishSend = () => { };

	constructor(conv_id: string) {
		this.conversation_id = conv_id
	}
	get messages() {
		return this.#chat_messages
	}
	set messages(messages: Message[]) {
		this.#chat_messages = messages
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
			role: 'user',
			content: message,
			id: crypto.randomUUID(),
			created_at: new Date(),
			conversation_id: this.conversation_id
		}
		this.#chat_messages.push(newMsg);

		await fetch(`/api/messages/${this.conversation_id}`, {
			method: 'POST',
			body: JSON.stringify(newMsg)
		})

		this.isLoading = false;
		this.onFinishSend()
	};

}

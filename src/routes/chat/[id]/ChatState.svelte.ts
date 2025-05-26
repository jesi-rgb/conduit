import type { Message, ChatState } from '$lib/types';

export class ChatStateClass implements ChatState {
	#conversation_id = $state('');
	#chat_messages = $state<Message[]>([]);
	isLoading = $state(false);
	fetchMessages = async () => { };

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



	sendMessage = (message: string) => {
		this.isLoading = true;

		//here we would send to database?
		this.#chat_messages.push({
			role: 'user',
			content: message,
			id: crypto.randomUUID(),
			created_at: new Date(),
			conversation_id: this.conversation_id
		});

		// TODO: this should be called from api
		// db.insert(messages).values({
		// 	conversation_id: this.chat_messages[this.chat_messages.length - 1].id,
		// 	role: 'user',
		// 	content: message,
		// 	created_at: new Date()
		// });
	};

}

import type { Message, ChatState } from '$lib/types';
import { globalState } from '../../../stores/stores.svelte';

export class ChatStateClass implements ChatState {
	#conversation_id = $state('');
	#messages = $state<Message[]>([]);
	title = $derived(globalState.conversations.find(conv => conv.id == this.conversation_id)?.title!);
	isLoading = $state(false);
	fetchMessages = () => { };
	onFinishSend = () => { };

	constructor(conv_id: string) {
		this.conversation_id = conv_id
		// this.#title = globalState.conversations.filter(conv => conv.id == this.conversation_id)
		console.log('AAAAAAAAAAAAA')
		console.log(globalState.conversations)
		console.log(globalState.conversations.find(conv => conv.id == this.conversation_id))
	}
	get messages() {
		return this.#messages
	}
	set messages(messages: Message[]) {
		this.#messages = messages
	}

	// get title() {
	// 	return this.#title
	// }
	// set title(title: string) {
	// 	this.#title = title
	// }

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
		this.#messages.push(newMsg);

		await fetch(`/api/messages/${this.conversation_id}`, {
			method: 'POST',
			body: JSON.stringify(newMsg)
		})

		this.isLoading = false;
		this.onFinishSend()
	};

}

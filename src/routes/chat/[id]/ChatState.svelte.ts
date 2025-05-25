import type { Message, ChatState } from '$lib/types';

export class ChatStateClass implements ChatState {
	chat_messages = $state<Message[]>([]);
	conversation_id = ''

	constructor(conv_id: string) {
		this.conversation_id = conv_id
		this.chat_messages = [{
			role: 'assistant',
			content: 'Hello! How can I help you today?',
			id: crypto.randomUUID(),
			created_at: new Date(),
			conversation_id: this.conversation_id
		}]
	}

	isLoading = $state(false);

	sendMessage = (message: string) => {
		this.isLoading = true;

		//here we would send to database?
		this.chat_messages.push({
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

	fetchMessages = () => {
		// we would sync the data back ?
		//TODO: this should be called from api
		// db.select().from(messages).where(eq(messages.conversation_id, this.conversation_id))
	};
}

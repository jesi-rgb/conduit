export type User = {
	id: string;
	email: string;
	name: string;
	avatar_url: string;
	created_at: Date;
}

export type Message = {
	id: string;
	conversation_id: string;
	role: 'user' | 'assistant';
	content: string;
	created_at: Date;
}

export interface ChatState {
	messages: Message[];
	conversation_id: string;
	isLoading: boolean;
	sendMessage: (message: string) => void;
	fetchMessages: () => void;
}


export interface GlobalState {
	user: User;
	messages: Message[];
}

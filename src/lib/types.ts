export const CONDUIT_SELECTED_MODEL = 'conduit-selected-model'
export const CONDUIT_PROVIDER = 'conduit-open-router'

export type User = {
	id: string;
	email: string;
	name: string;
	avatar_url: string;
	created_at: Date;
}

export type Conversation = {
	id: string;
	title: string;
	user_id: string;
	created_at: Date;
	updated_at: Date;
}

export type Message = {
	id?: string;
	conversation_id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	created_at: Date;
}


export type Branch = {
	id?: string;
	title: string;
	user_id: string;
	parent_conversation_id: string;
	branch_from_message_id: string;
	created_at?: Date;
	updated_at?: Date;
};

export interface GlobalState {
	user: User;
	messages: Message[];
}

export const CONDUIT_SELECTED_MODEL = 'conduit-selected-model'
export const CONDUIT_PROVIDER = 'conduit-open-router'
export const CONDUIT_OPEN_ROUTER_KEY = 'conduit-open-router'

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
	parent_conversation_id?: string;
	branch_from_message_id?: string;
}

export type Message = {
	id?: string;
	conversation_id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	created_at: Date;
	generated_by?: string;
}


export type Branch = {
	id?: string;
	title: string;
	user_id: string;

	parent_conversation_id: string;
	branch_from_message_id: string;

	selected_text: string;
	selection_node_type: string;
	selection_node_index: number;
	selection_start_offset: number;
	selection_end_offset: number;

	created_at?: Date;
	updated_at?: Date;
};

export interface Highlight {
	branch_id: string;
	conversation_id: string;
	selection_node_type: string;
	selection_node_index: number;
	selection_start_offset: number;
	selection_end_offset: number;
}

export interface GlobalState {
	user: User;
	messages: Message[];
}

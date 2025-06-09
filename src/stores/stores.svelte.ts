import type { User } from '@supabase/supabase-js';
import type { Branch, Conversation, Message } from '$lib/types';
import { fetchWithAuth } from '$lib/client/auth';

interface GlobalStateType {
	user: User | null;
	conversations: Conversation[];
	currentConversation: Conversation | null;
	currentMessages: Message[];
	currentBranches: Branch[];
}

export class GlobalState implements GlobalStateType {
	#user_data: User | null = $state(null)
	#conversations_data: Conversation[] = $state([])
	#currentConversation_data: Conversation | null = $state(null)
	#currentMessages_data: Message[] = $state([])
	#currentBranches_data: Branch[] = $state([])


	fetchConversations = async () => {
		const response = await fetchWithAuth({ url: '/api/conversations' });
		this.#conversations_data = (await response.json()).conversations;
	}

	fetchBranches = async () => { }

	set user(user: User) {
		this.#user_data = user
	}
	get user(): User | null {
		if (this.#user_data)
			return this.#user_data
		else return null
	}

	set conversations(conversations: Conversation[]) {
		this.#conversations_data = conversations
	}
	get conversations(): Conversation[] {
		if (this.#conversations_data)
			return this.#conversations_data
		else return []
	}

	set currentConversation(conversation: Conversation) {
		this.#currentConversation_data = conversation
	}
	get currentConversation(): Conversation | null {
		if (this.#currentConversation_data)
			return this.#currentConversation_data
		else return null
	}

	set currentMessages(messages: Message[]) {
		this.#currentMessages_data = messages
	}
	get currentMessages(): Message[] {
		if (this.#currentMessages_data)
			return this.#currentMessages_data
		else return []
	}

	set currentBranches(branches: Branch[]) {
		this.#currentBranches_data = branches
	}
	get currentBranches(): Branch[] {
		if (this.#currentBranches_data)
			return this.#currentBranches_data
		else return []
	}
}

export const globalState = new GlobalState()

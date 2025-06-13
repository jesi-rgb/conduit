import type { User } from '@supabase/supabase-js';
import type { Branch, Conversation, Message } from '$lib/types';
import { fetchWithAuth } from '$lib/client/auth';
import type { ModelInfo } from '$lib/models';

type Provider = 'conduit-open-router' | 'conduit-openai' | 'conduit-deepseek';

interface GlobalStateType {
	user: User | null;
	modelIdSelected: string;
	conversations: Conversation[];
	currentConversation: Conversation | null;
	currentMessages: Message[];
	currentBranches: Branch[];
	userKeys: Record<Provider, string>;
	updateUserKeys: (provider: Provider, key: string) => void
}

export class GlobalState implements GlobalStateType {
	#user_data: User | null = $state(null);
	#modelIdSelected: string | null = $state(null);
	#conversations_data: Conversation[] = $state([]);
	#currentConversation_data: Conversation | null = $state(null);
	#currentMessages_data: Message[] = $state([]);
	#currentBranches_data: Branch[] = $state([]);
	#userKeys: Record<Provider, string> = $state({
		'conduit-open-router': '',
		'conduit-openai': '',
		'conduit-deepseek': ''
	});


	fetchConversations = async () => {
		const response = await fetchWithAuth({ url: '/api/conversations' });
		this.#conversations_data = (await response.json()).conversations;
	}

	fetchBranches = async () => { }
	fetchCurrentMessages = async () => { }

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

	set userKeys(keys: Record<Provider, string>) {
		this.#userKeys = keys

		Object.entries(keys).forEach(([key, value]) => {
			localStorage.setItem(key, value)
		})
	}
	get userKeys(): Record<Provider, string> {
		if (!this.#userKeys) {
			Object.entries(localStorage).forEach(([key, value]) => {
				if (key.startsWith('conduit-'))
					this.#userKeys[key as Provider] = value
			})
		}
		return this.#userKeys
	}
	updateUserKeys(provider: Provider, key: string) {
		this.#userKeys[provider] = key
		localStorage.setItem(provider, key)
	}

	get modelIdSelected(): string {
		const localStorageModel = localStorage.getItem('conduit-selected-model')
		if (localStorageModel) {
			this.#modelIdSelected = localStorageModel
		}
		return this.#modelIdSelected || 'google/gemini-2.5-flash-preview-05-20';
	}

	set modelIdSelected(model: string) {
		if (localStorage.getItem('conduit-selected-model') !== model)
			localStorage.setItem('conduit-selected-model', model)
		this.#modelIdSelected = model
	}
}

export const globalState = new GlobalState()


// stores/conversation.svelte.js
import { getContext, setContext } from 'svelte';

class ConversationStore {
	mainConversationData = $state(null);

	setMainConversation(data) {
		this.mainConversationData = data;
	}
}

const CONVERSATION_KEY = Symbol('conversation');

export function setConversationStore() {
	console.log('setting convo')
	setContext(CONVERSATION_KEY, new ConversationStore());
}

export function getConversationStore(): ConversationStore {
	return getContext(CONVERSATION_KEY);
}

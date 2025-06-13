// src/stores/chatStore.svelte.ts
import { writable } from 'svelte/store';
import type { ChatStateClass } from '../routes/chat/[id]/ChatState.svelte';

// This store will hold the one and only active chat state instance.
export const activeChatState = writable<ChatStateClass | null>(null);


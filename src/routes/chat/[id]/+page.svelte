<!-- chat/[id]/+page.svelte -->
<script>
	import { page } from '$app/state';
	import ConversationView from '$lib/components/ui/ConversationView.svelte';
	import { onMount } from 'svelte';
	import { globalState } from '../../../stores/stores.svelte.js';

	let { data } = $props();
	let chatState = $derived(data.chatState);

	const conversationId = $derived(page.params.id);
</script>

<svelte:head>
	<title>Conduit — Chat</title>
</svelte:head>

<ConversationView {chatState} {conversationId} />

<!-- chat/[id]/+page.svelte -->
<script>
	import { page } from '$app/state';
	import ConversationView from '$lib/components/ui/ConversationView.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	const conversationId = $derived(page.params.id);

	onMount(() => {
		data.chatState.fetchMessages();
	});
</script>

<ConversationView chatState={data.chatState} {conversationId} />

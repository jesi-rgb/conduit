<!-- chat/[id]/+page.svelte -->
<script>
	import { page } from '$app/state';
	import ConversationView from '$lib/components/ui/ConversationView.svelte';

	let { data } = $props();
	const conversationId = $derived(page.params.id);
</script>

<ConversationView
	chatState={data.chatState}
	mainConversation={data.chatState.mainConversation}
	{conversationId}
/>

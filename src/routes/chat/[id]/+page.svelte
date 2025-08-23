<!-- chat/[id]/+page.svelte -->
<script>
	import { page } from '$app/state';
	import ConversationView from '$lib/components/ui/ConversationView.svelte';

	let { data } = $props();
	let chatState = $derived(data.chatState);

	const conversationId = $derived(page.params.id);
</script>

<ConversationView {chatState} {conversationId} />

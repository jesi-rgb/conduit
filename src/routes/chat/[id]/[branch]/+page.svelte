<script>
	import ConversationView from '$lib/components/ui/ConversationView.svelte';
	import { page } from '$app/state';

	let { data } = $props();
	const conversationId = $derived(page.params.id);
	const branchId = $derived(page.params.branch);
</script>

<ConversationView chatState={data.chatState} {conversationId} {branchId} />

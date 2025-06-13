<script>
	import ConversationView from '$lib/components/ui/ConversationView.svelte';
	import { page } from '$app/state';

	let { data } = $props();

	let chatState = $derived(data.chatState);
	const conversationId = $derived(page.params.id);
	const branchId = $derived(page.params.branch);
</script>

<ConversationView {chatState} {conversationId} {branchId} />

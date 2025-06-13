<!-- chat/[id]/+layout.svelte -->
<script lang="ts">
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import { page } from '$app/state';
	import ConversationView from '$lib/components/ui/ConversationView.svelte';
	import { onMount } from 'svelte';

	const { data, children } = $props();
	const chatState = $derived(data.chatState);

	const conversationId = $derived(page.params.id);
	let isBranch = $derived(!!page.params.branch);
	$inspect(isBranch);

	let mainConversationData = $derived(chatState.mainConversation);

	onMount(() => {
		chatState.saveMainConvo();
	});
</script>

{#if chatState && mainConversationData}
	<div class="h-full">
		<ConversationView {chatState} {conversationId} />
		{#if isBranch}
			mierdon
		{/if}
	</div>
{/if}

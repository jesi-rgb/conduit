<!-- chat/[id]/+layout.svelte -->
<script lang="ts">
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import { page } from '$app/state';
	import ConversationView from '$lib/components/ui/ConversationView.svelte';
	import { onMount } from 'svelte';
	import { globalState } from '../../../stores/stores.svelte.js';

	const { data, children } = $props();

	const chatState = $derived(data.chatState);

	const conversationId = $derived(page.params.id);
	let isBranch = $derived(!!page.params.branch);

	let mainConversationData = $derived(chatState.mainConversation);
	let branchData = $derived(chatState.currentBranch);

	onMount(() => {
		chatState.saveMainConvo();
	});

	const convTitle = globalState.conversations.find(
		(conversation) => conversation.id === conversationId
	);
</script>

<svelte:head>
	<title>Conduit — {convTitle?.title}</title>
</svelte:head>

{#if chatState && (mainConversationData || branchData)}
	<ConversationView {chatState} {conversationId} />
	{#if isBranch}
		<Drawer open={isBranch} {conversationId}>
			{@render children()}
		</Drawer>
	{/if}
{/if}

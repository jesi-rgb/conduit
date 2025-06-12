<!-- chat/[id]/+layout.svelte -->
<script lang="ts">
	import BranchHistory from '$lib/components/ui/BranchHistory.svelte';
	import Sidebar from '$lib/components/ui/Sidebar.svelte';
	import { Pane, PaneGroup, PaneResizer } from 'paneforge';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import { page } from '$app/state';
	import ConversationView from '$lib/components/ui/ConversationView.svelte';
	import { onMount } from 'svelte';

	const { data, children } = $props();
	const chatState = $derived(data.chatState);

	const conversationId = $derived(page.params.id);
	const isBranch = $derived(!!page.params.branch);

	let mainConversationData = $derived(chatState.mainConversation);

	onMount(() => {
		chatState.saveMainConvo();
	});
</script>

{#if chatState && mainConversationData}
	<div class="h-full">
		<ConversationView {chatState} mainConversation={mainConversationData} {conversationId} />
		{#if isBranch}
			<Drawer {conversationId}>
				{@render children()}
			</Drawer>
		{/if}
	</div>
{/if}

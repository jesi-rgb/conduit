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
	<main class="h-[100vh]">
		<PaneGroup direction="horizontal" class="h-full">
			<Sidebar />
			<PaneResizer class="hover:bg-primary z-10 -mx-1.5 w-3 transition-colors"></PaneResizer>
			<Pane>
				<div class="h-full">
					<ConversationView {chatState} mainConversation={mainConversationData} {conversationId} />
				</div>

				{#if isBranch}
					<Drawer {conversationId}>
						{@render children()}
					</Drawer>
				{/if}
			</Pane>
			<PaneResizer class="hover:bg-primary z-10 -mx-1.5 w-3 transition-colors"></PaneResizer>
			<BranchHistory />
		</PaneGroup>
	</main>
{/if}

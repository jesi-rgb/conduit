<script>
	import { Pane } from 'paneforge';
	import { globalState } from '../../../stores/stores.svelte';
</script>

<Pane defaultSize={15}>
	<section
		class="border-base-content/10 bg-base-200 flex h-full flex-col
		justify-between gap-10 border-l p-3
		shadow-lg"
	>
		<div class="border-red flex flex-col gap-6">
			{#each globalState.currentMessages as msg}
				{#if msg.role === 'user'}
					<div class="flex items-center gap-2">
						<div
							class="bg-base-content size-2 shrink-0
							items-center gap-2 rounded-full"
						></div>

						<p class="truncate text-xs">{msg.content}</p>
					</div>
				{/if}
				{#each globalState.currentBranches as branch}
					{#if branch.branch_from_message_id === msg.id}
						<a
							data-sveltekit-preload-data="tap"
							href="/chat/{msg.conversation_id}/{branch.id}"
							class="text-xs">{branch.id?.slice(0, 6)}</a
						>
					{/if}
				{/each}
			{/each}
		</div>
	</section>
</Pane>

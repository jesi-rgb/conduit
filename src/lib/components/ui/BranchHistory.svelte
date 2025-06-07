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
				<div class="relative w-min">
					<div
						class="bg-base-content absolute flex size-4 items-center
						gap-2 rounded-full"
					></div>
					<div
						class="bg-base-200 absolute -top-1/2 -left-1/2 flex
						size-2 translate-x-1/2 translate-y-1/2 items-center gap-2 rounded-full"
					></div>
				</div>
				{#each globalState.currentBranches as branch}
					{#if branch.branch_from_message_id === msg.id}
						<a href="/chat/{msg.conversation_id}/{branch.id}" class="text-xs"
							>{branch.id?.slice(0, 6)}</a
						>
					{/if}
				{/each}
			{/each}
		</div>
	</section>
</Pane>

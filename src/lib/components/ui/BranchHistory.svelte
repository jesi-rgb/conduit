<script lang="ts">
	import { Pane } from 'paneforge';
	import { globalState } from '../../../stores/stores.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const gotoUrl = (msgId: string) => {
		if (page.params.branch) {
			return `/chat/${page.params.id}/${page.params.branch}?message=${msgId}`;
		} else {
			return `/chat/${page.params.id}?message=${msgId}`;
		}
	};
</script>

<Pane defaultSize={15}>
	<section
		class="border-base-content/10 bg-base-200 flex h-full flex-col
		justify-between gap-10 border-l p-3
		shadow-lg"
	>
		<div class="flex flex-col gap-6">
			{#each globalState.currentMessages as msg}
				{#if msg.role === 'user'}
					<button
						class="cursor-pointer py-2"
						onclick={() => {
							goto(gotoUrl(msg.id!));
						}}
					>
						<div class="flex items-center gap-2">
							<div
								class="bg-base-content size-2 shrink-0
							items-center gap-2 rounded-full"
							></div>

							<p class="truncate text-xs">{msg.content}</p>
						</div>
					</button>
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

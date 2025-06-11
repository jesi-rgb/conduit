<script lang="ts">
	import { Pane } from 'paneforge';
	import { globalState } from '../../../stores/stores.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	onMount(async () => {
		globalState.fetchBranches();
	});

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
		class="border-base-content/10 bg-base-200 flex h-full
		flex-col justify-between gap-10 overflow-y-scroll
		border-l p-3 shadow-lg"
	>
		<div class="flex flex-col items-center">
			{#each globalState.currentMessages as msg, i (msg.id)}
				<button
					class="cursor-pointer py-2"
					onclick={() => {
						goto(gotoUrl(msg.id!));
					}}
				>
					<Icon class="text-primary text-2xl" icon="solar:star-shine-bold-duotone" />
				</button>
				<div>{msg.id?.slice(0, 6)}</div>

				{#each globalState.currentBranches as branch}
					{#if branch.branch_from_message_id === msg.id}
						<a
							data-sveltekit-preload-data="tap"
							href="/chat/{page.params.id}/{branch.id}"
							class="text-[8px]"
							>{branch.branch_from_message_id.slice(0, 6)} · {branch.id?.slice(0, 6)}</a
						>
					{/if}
				{/each}
				{#if i < globalState.currentMessages.filter((msg) => msg.role === 'user').length - 1}
					<div class="border-base-content/10 h-6 w-0 border"></div>
				{/if}
			{/each}
		</div>
	</section>
</Pane>

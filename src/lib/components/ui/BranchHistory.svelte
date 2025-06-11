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

<Pane defaultSize={15} class="w-full">
	<section
		class="border-base-content/10 bg-base-200 mx-auto h-full w-full overflow-y-scroll border-l p-3 shadow-lg"
	>
		{#each globalState.currentMessages as msg, i (msg.id)}
			<button
				class="flex w-full cursor-pointer items-center gap-2 py-2"
				onclick={() => {
					goto(gotoUrl(msg.id!));
				}}
			>
				<Icon class="text-primary shrink-0 text-2xl" icon="solar:star-shine-bold-duotone" />
				<div class="text-muted truncate text-xs">{msg.content}</div>
			</button>

			{#each globalState.currentBranches as branch, b (branch.id)}
				{#if branch.branch_from_message_id === msg.id}
					<a
						data-sveltekit-preload-data="tap"
						class="ml-5 flex w-full cursor-pointer items-center gap-2 py-2"
						href="/chat/{page.params.id}/{branch.id}"
					>
						<Icon class="text-primary shrink-0 text-2xl" icon="solar:star-shine-bold-duotone" />
						<div class="text-muted truncate text-xs">Branch {i + 1}</div>
					</a>
				{/if}
			{/each}
			{#if i < globalState.currentMessages.length - 1}
				<div class="border-base-content/10 ml-[11px] h-4 w-0 border"></div>
			{/if}
		{/each}
	</section>
</Pane>

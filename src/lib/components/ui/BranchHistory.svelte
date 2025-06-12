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
		class="border-base-content/10 bg-base-200 mx-auto flex h-full
		w-full flex-col overflow-x-clip overflow-y-scroll border-l p-3 shadow-lg"
	>
		{#each globalState.currentMessages as msg, i (msg.id)}
			{@const lastMessage = i === globalState.currentMessages.length - 1}
			<button
				class="flex w-full cursor-pointer items-center gap-2 py-2"
				onclick={() => {
					goto(gotoUrl(msg.id!));
				}}
			>
				<Icon
					class={`shrink-0 text-2xl ${msg.role === 'user' ? 'text-primary' : 'text-secondary'}`}
					icon="solar:star-shine-bold-duotone"
				/>
				<div
					class={`truncate text-xs ${
						msg.role === 'user' ? 'text-base-content font-semibold' : 'text-muted'
					}`}
				>
					{msg.content}
				</div>
			</button>

			{#each globalState.currentBranches as branch, b (branch.id)}
				{@const thereAreBranches = globalState.currentBranches.find(
					(branch) => branch.branch_from_message_id === msg.id
				)}

				{#if thereAreBranches}
					{#if branch.branch_from_message_id === msg.id}
						<a
							data-sveltekit-preload-data="tap"
							class="relative ml-2 flex w-full cursor-pointer
						items-center gap-2 py-1"
							href="/chat/{page.params.id}/{branch.id}"
						>
							<div
								class="border-subtle absolute left-[3px] h-full
								w-0 border"
							></div>
							<Icon class="text-subtle shrink-0 text-2xl" icon="solar:forward-2-bold" />
							<Icon class="text-muted shrink-0 text-2xl" icon="solar:login-3-bold-duotone" />
							<p class="text-muted text-xs">Branch {b + 1}</p>
						</a>
					{/if}
				{/if}
			{/each}
			{#if !lastMessage}
				<div class="border-subtle ml-[11px] h-2 w-0 border"></div>
			{/if}
		{/each}
	</section>
</Pane>

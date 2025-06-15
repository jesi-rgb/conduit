<script lang="ts">
	import { Pane } from 'paneforge';
	import { globalState } from '../../../stores/stores.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { fly, slide } from 'svelte/transition';

	const gotoUrl = (msgId: string) => {
		if (page.params.branch) {
			return `/chat/${page.params.id}/${page.params.branch}?message=${msgId}`;
		} else {
			return `/chat/${page.params.id}?message=${msgId}`;
		}
	};
</script>

<Pane defaultSize={20} class="w-full">
	<section
		class="border-base-content/10 bg-base-200 mx-auto flex h-full
		w-full flex-col overflow-x-clip overflow-y-scroll border-l p-3 shadow-lg"
	>
		{#each globalState.currentMessages as msg, i}
			{@const lastMessage = i === globalState.currentMessages.length - 1}
			{@const msgBranches = globalState.currentBranches.filter(
				(b) => msg.id === b.branch_from_message_id
			)}
			{#key globalState.currentMessages}
				<button
					class="flex w-full cursor-pointer items-center gap-2 py-2"
					in:fly={{ x: -10, delay: i * 30.9 }}
					out:fly={{ duration: 0 }}
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
			{/key}
			{#each msgBranches as branch, b}
				{@const lastBranch = b === msgBranches.length - 1}
				{#if branch.branch_from_message_id === msg.id}
					{#key globalState.currentBranches}
						<a
							in:fly={{ x: -10, delay: b * 30.5 }}
							out:fly={{ duration: 0 }}
							data-sveltekit-preload-data="tap"
							class="group relative -my-[1px] ml-2 flex
						w-full cursor-pointer items-center gap-2 py-1"
							href="/chat/{page.params.id}/{branch.id}"
						>
							{#if lastBranch}
								<div
									class="border-subtle absolute top-0
								left-[3.4px] h-[13px] w-0 self-center rounded-full border"
								></div>
							{:else}
								<div
									class="border-subtle absolute left-[3.4px]
								h-full w-0 self-center rounded-full border"
								></div>
							{/if}
							<Icon class="text-subtle  shrink-0 text-2xl" icon="solar:forward-2-bold" />
							<Icon
								class="text-muted group-hover:text-accent
							shrink-0 text-xl transition-all duration-300 group-hover:rotate-6"
								icon="solar:star-ring-bold-duotone"
							/>
							<p class="text-muted truncate text-xs italic">{branch.title}</p>
						</a>
					{/key}
				{/if}
			{/each}
		{/each}
	</section>
</Pane>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Pane } from 'paneforge';
	import { globalState } from '../../../stores/stores.svelte';
	import { supabase } from '$lib/client/supabase';
	import { goto } from '$app/navigation';
	import { fetchWithAuth } from '$lib/client/auth';
	import { onMount } from 'svelte';

	import type { Conversation } from '$lib/types';
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import TooltipExplain from './TooltipExplain.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const convId = $derived(page.params.id);

	let conversations: Conversation[] = $derived(
		globalState.conversations.filter((conv: Conversation) => !conv.parent_conversation_id)
	);

	const groupConversationsByDate = $derived.by(() => {
		return conversations.reduce(
			(acc, conv) => {
				const date = new Date(conv.created_at).toDateString();
				acc[date] = acc[date] || [];
				acc[date].push(conv);
				return acc;
			},
			{} as Record<string, Conversation[]>
		);
	});

	const user = $derived(globalState.user);

	let mounted = $state(false);
	onMount(async () => {
		mounted = true;
		globalState.fetchConversations();
	});

	async function logout() {
		await supabase.auth.signOut();
		globalState.user = null;
		goto('/');
	}

	async function deleteConversation(convId: string) {
		await fetchWithAuth({
			url: `/api/conversation/${convId}`,
			options: {
				method: 'DELETE'
			}
		});
		conversations = conversations.filter((conv) => conv.id !== convId);
		globalState.currentMessages = [];
		goto('/chat');
	}
</script>

<Pane minSize={10} defaultSize={20}>
	<section
		class="bg-base-200/50 border-base-content/10 flex h-full flex-col
		justify-between gap-10 border-r bg-gradient-to-r
		p-2 py-4 shadow-lg"
	>
		<div class="relative flex min-h-0 w-full shrink flex-col gap-5">
			<a
				href="/chat"
				class="text-primary headline mx-auto flex w-min items-center gap-3
				text-xl font-bold"
			>
				<span>Conduit</span>
				<Icon icon="solar:star-rings-line-duotone" class="text-2xl" />
			</a>
			<a
				href="/chat"
				class="btn btn-primary btn-outline group from-primary/5
				to-primary/30
				hover:to-primary-content/30 w-full rounded-full
				bg-gradient-to-b from-20% to-150% hover:bg-gradient-to-t
				hover:to-90% dark:to-280%"
				>New Conversation <Icon
					icon="solar:chat-line-bold-duotone"
					class="text-primary group-hover:text-primary-content"
				/></a
			>

			<div
				class="conversation-list flex w-full flex-grow flex-col
				items-center gap-2 overflow-y-auto py-2"
			>
				{#if conversations.length === 0}
					<div class="mx-auto flex items-center gap-2 opacity-40">
						<span class="text-primary">No conversations, yet</span>
					</div>
				{/if}
				{#each Object.entries(groupConversationsByDate) as [date, conversations], g}
					<div class="mt-3 w-full px-3">
						<span class="text-muted text-xs"
							>{date} ·
							{conversations.length} convos</span
						>
					</div>
					{#each conversations as conv (conv.id)}
						<a
							id={conv.id}
							transition:slide={{ duration: 310 }}
							data-sveltekit-preload-data="tap"
							href="/chat/{conv.id}"
							class:border-primary={conv.id === convId}
							class="btn btn-ghost btn-sm border-base-content/10 bg-base-100/50
							group convo w-full justify-between rounded-full border
							pr-1 font-[500]"
						>
							<span class="truncate">
								{conv.title}
							</span>

							<button
								class="hover:btn-error btn
								btn-xs btn-ghost rounded-full opacity-0
								transition-colors group-hover:opacity-100"
								onclick={(e) => {
									e.preventDefault();
									deleteConversation(conv.id);
								}}
							>
								<Icon icon="solar:trash-bin-trash-bold-duotone" class="" />
							</button>
						</a>
					{/each}
				{/each}
			</div>
		</div>

		<div class="flex shrink-0 items-center justify-between px-3 text-xs">
			<div>{user?.user_metadata.full_name}</div>

			<div>
				<ThemeToggle />
				<TooltipExplain>
					<a
						href="/settings"
						class="btn btn-xs text-base-content/20 border-subtle hover:text-info text-base transition-colors"
					>
						<Icon icon="solar:settings-bold-duotone" />
					</a>

					{#snippet content()}
						Settings
					{/snippet}
				</TooltipExplain>

				<TooltipExplain>
					<div>
						<button
							onclick={logout}
							class="btn btn-xs text-base-content/20 hover:text-error border-subtle text-base transition-colors"
						>
							<Icon icon="solar:logout-2-bold-duotone" />
						</button>
					</div>
					{#snippet content()}
						Logout
					{/snippet}
				</TooltipExplain>
			</div>
		</div>
	</section>
</Pane>

<style>
	:global(.conv-active) {
		background-color: var(--color-base-300);
	}
	.headline {
		font-variation-settings:
			'wght' 900,
			'opsz' 70;
	}
	.convo {
		font-variation-settings: 'opsz' 12;
	}
	.conversation-list {
		scrollbar-gutter: auto;
	}
</style>

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
	import { fly, slide } from 'svelte/transition';

	const convId = $derived(page.params.id);

	let conversations: Conversation[] = $derived(
		globalState.conversations.filter((conv: Conversation) => !conv.parent_conversation_id)
	);

	const user = $derived(globalState.user);

	onMount(async () => {
		globalState.fetchConversations();
	});

	async function logout() {
		await supabase.auth.signOut();
		globalState.user = null;
		goto('/');
	}

	async function handleGoogleLogin() {
		const { data } = await supabase.auth.getUser();

		if (data.user) {
			goto('/chat');
		}

		try {
			const { error: authError } = await supabase.auth.signInWithOAuth({
				provider: 'google'
			});

			if (authError) throw authError;

			// No need to redirect, as Supabase OAuth will handle it
		} catch (e) {
			console.error('Google login error:', e);
		}
	}

	async function deleteConversation(convId: string) {
		await fetchWithAuth({
			url: `/api/conversation/${convId}`,
			options: {
				method: 'DELETE'
			}
		});
		conversations = conversations.filter((conv) => conv.id !== convId);
		goto('/chat');
	}

	async function newConversation() {
		const nextConv = conversations.length + 1;
		const data = await fetchWithAuth({
			url: `/api/conversations/`,
			options: {
				method: 'POST',
				body: JSON.stringify({ title: `Chat ${nextConv}` })
			}
		});
		const convData = await data.json();
		goto(`/chat/${convData.conversation.id}`);
		globalState.fetchConversations();
	}
</script>

<Pane minSize={10} defaultSize={20}>
	<section
		class="border-base-content/10 from-base-100 to-base-200 flex h-full flex-col justify-between
		gap-10 border-r bg-gradient-to-r
		p-2 py-4 shadow-lg"
	>
		<div class="flex flex-col gap-5">
			<a
				href="/chat"
				class="text-primary dark:text-primary-content headline mx-auto flex w-min items-center gap-3
				text-3xl font-bold"
			>
				<span>Conduit</span>
				<Icon icon="solar:star-angle-bold-duotone" class="text-4xl" />
			</a>
			<a
				href="/chat"
				class="btn btn-primary btn-outline group from-primary/5
				to-primary/30 hover:to-primary-content/30 w-full
				bg-gradient-to-b from-20% to-150% hover:bg-gradient-to-t
				hover:to-90% dark:to-280%"
				>New Conversation <Icon
					icon="solar:chat-line-bold-duotone"
					class="text-primary group-hover:text-primary-content"
				/></a
			>
			<div class="flex flex-col gap-2">
				{#each conversations as conv (conv.id)}
					<a
						id={conv.id}
						transition:slide={{ duration: 310 }}
						data-sveltekit-preload-data="tap"
						href="/chat/{conv.id}"
						class:border-primary={conv.id === convId}
						class="btn btn-ghost border-base-content/10
						bg-base-100/50 group justify-between rounded-full border pr-1"
					>
						<span class="truncate">
							{conv.title}
						</span>

						<button
							class="hover:btn-error btn
							btn-sm btn-ghost rounded-full opacity-0
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
			</div>
		</div>

		<div class="flex items-center justify-between px-3 text-xs">
			<div>
				{#if user?.is_anonymous}
					<button class="btn btn-xs" onclick={handleGoogleLogin}>Anonymous</button>
				{:else}
					<div>{user?.user_metadata.full_name}</div>
				{/if}
			</div>

			<div>
				<a
					href="/settings"
					class="btn btn-xs text-base-content/20 hover:text-info text-base transition-colors"
				>
					<Icon icon="solar:settings-bold-duotone" />
				</a>

				<button
					onclick={logout}
					class="btn btn-xs text-base-content/20 hover:text-error text-base transition-colors"
				>
					<Icon icon="solar:logout-2-bold-duotone" />
				</button>
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
</style>

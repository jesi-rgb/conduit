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
		globalState.conversations.filter((conv) => !conv.parent_conversation_id)
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
		await fetchWithAuth(`/api/conversation/${convId}`, {
			method: 'DELETE'
		});
		conversations = conversations.filter((conv) => conv.id !== convId);
	}

	async function newConversation() {
		const nextConv = conversations.length + 1;
		await fetchWithAuth(`/api/conversations/`, {
			method: 'POST',
			body: JSON.stringify({ title: `Chat ${nextConv}` })
		});
		globalState.fetchConversations();
	}
</script>

<Pane minSize={10} defaultSize={20}>
	<section
		class="border-base-content/10 bg-base-200 flex h-full flex-col
		justify-between gap-10 border-r
		p-2 shadow-lg"
	>
		<div class="border-red flex flex-col gap-2">
			<button onclick={newConversation} class="btn group hover:btn-primary w-full"
				><Icon
					icon="solar:add-square-bold-duotone"
					class="text-primary group-hover:text-primary-content text-2xl"
				/></button
			>
			{#each conversations as conv}
				<a
					data-sveltekit-preload-data="tap"
					transition:slide={{ axis: 'x' }}
					href="/chat/{conv.id}"
					class:border-primary={conv.id === convId}
					class="btn justify-between rounded-full pr-1"
				>
					<span class="truncate">
						{conv.title}
					</span>

					<button
						class="text-base-content/20 hover:btn-error group
						btn btn-sm btn-ghost rounded-full transition-colors"
						onclick={() => deleteConversation(conv.id)}
					>
						<Icon
							icon="solar:trash-bin-trash-bold-duotone"
							class="group-hover:text-error-content text-base"
						/>
					</button>
				</a>
			{/each}
		</div>

		<div class="flex items-center justify-between text-xs">
			<div>
				{#if user?.is_anonymous}
					<button class="btn btn-xs" onclick={handleGoogleLogin}>Anonymous</button>
				{:else}
					<div>{user?.user_metadata.full_name}</div>
				{/if}
			</div>

			<div>
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
</style>

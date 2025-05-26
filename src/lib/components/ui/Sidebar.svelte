<script>
	import Icon from '@iconify/svelte';
	import { Pane } from 'paneforge';
	import { globalState } from '../../../stores/stores.svelte';
	import { supabase } from '$lib/client/supabase';
	import { goto } from '$app/navigation';
	import { fetchWithAuth } from '$lib/client/auth';
	import { onMount } from 'svelte';

	let conversations = $state([]);

	const user = $derived(globalState.user);

	onMount(async () => {
		const response = await fetchWithAuth('/api/conversations');
		conversations = (await response.json()).conversations;
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
</script>

<Pane defaultSize={15}>
	<section
		class="border-base-content/10 bg-base-200 flex h-full flex-col justify-between gap-10 border p-3
		shadow-lg"
	>
		<div class="border-red flex flex-col gap-2">
			{#each conversations as conv}
				<div class="flex items-center justify-between gap-3">
					<a href="/chat/{conv.id}" class="truncate">
						{conv.title}
					</a>
					<Icon
						icon="solar:trash-bin-trash-bold-duotone"
						class="text-base-content/20 hover:text-error
						btn btn-circle btn-xs btn-ghost transition-colors"
					/>
				</div>
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

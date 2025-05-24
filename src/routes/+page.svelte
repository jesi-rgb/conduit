<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/client/supabase';
	import type { User } from '@supabase/supabase-js';
	import { globalState } from '../stores/stores.svelte';

	let user: User | null = $state(null);
	let loading = $state(false);

	let error = $state();

	async function checkUser() {
		const { data } = await supabase.auth.getUser();
		if (data.user) globalState.user = data.user;
		loading = false;
		if (user) goto('/chat');
	}

	async function handleAnonymousLogin() {
		loading = true;

		try {
			const { error } = await supabase.auth.signInAnonymously();

			if (error) throw error;

			goto('/chat');
		} catch (e) {
			console.error('Anonymous login error:', e);
			goto('/chat');
		}
	}

	async function handleGoogleLogin() {
		loading = true;
		error = '';

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
			error = e.message || 'Failed to log in with Google';
			loading = false; // Only set loading false on error, otherwise we're redirecting
		}
	}

	onMount(() => {
		checkUser();
	});
</script>

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Conduit</h1>

			{#if loading}
				<span class="loading loading-spinner loading-lg"></span>
			{:else if user}
				<!-- User is already logged in -->
				<button class="btn" onclick={() => goto('/chat')}
					>Continue Chatting, {user.user_metadata.full_name}</button
				>
			{:else}
				<!-- User is not logged in -->
				<div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
					<button class="btn" onclick={handleAnonymousLogin}>Try as Guest</button>
					<button class="btn" onclick={handleGoogleLogin}>Sign In</button>
				</div>

				<p class="mt-6 text-sm opacity-75">
					No account needed - try it instantly as a guest or sign in to save your chats.
				</p>
			{/if}
		</div>
	</div>
</div>

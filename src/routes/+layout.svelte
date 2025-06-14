<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/client/supabase';
	import { onMount } from 'svelte';
	import '../app.css';
	import { globalState } from '../stores/stores.svelte';
	import { page } from '$app/state';
	import { redirect } from '@sveltejs/kit';
	import ConversationView from '$lib/components/ui/ConversationView.svelte';

	import { RenderScan } from 'svelte-render-scan';
	import { dev } from '$app/environment';

	let { children } = $props();

	async function checkUser() {
		// Check if we have a session in localStorage first to avoid unnecessary API calls
		const localSession = localStorage.getItem('supabase.auth.token');

		if (localSession) {
			try {
				// Try to parse the stored session
				const sessionData = JSON.parse(localSession);
				const expiresAt = sessionData?.expiresAt;

				// Check if the session is still valid
				if (expiresAt && new Date(expiresAt * 1000) > new Date()) {
					// Get user from Supabase without making an API call if possible
					const { data } = await supabase.auth.getUser();
					if (data.user) {
						globalState.user = data.user;
						if (page.route.id === '/') {
							goto('/chat');
						}
						return; // Exit early if we have a valid user
					}
				}
			} catch (error) {
				console.error('Error parsing stored session:', error);
				// If there's an error, we'll fall back to the normal auth flow
			}
		}

		// Fall back to normal auth flow if no valid session was found
		const { data } = await supabase.auth.getUser();

		if (data.user) {
			globalState.user = data.user;
			if (page.route.id === '/') {
				goto('/chat');
			}
		} else {
			console.log('user not logged in, redirecting');
			goto('/');
		}
	}

	onMount(() => {
		checkUser();
	});
</script>

{#if dev}
	<RenderScan duration={500} />
{/if}

<main class="selection:bg-primary selection:text-primary-content h-[100vh]">
	{@render children()}
</main>

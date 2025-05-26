<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/client/supabase';
	import { onMount } from 'svelte';
	import '../app.css';
	import { globalState } from '../stores/stores.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	async function checkUser() {
		const { data } = await supabase.auth.getUser();
		if (data.user) {
			globalState.user = data.user;
			if (page.route.id === '/') {
				goto('/chat');
			}
		}
	}

	onMount(() => {
		checkUser();
	});
</script>

{@render children()}

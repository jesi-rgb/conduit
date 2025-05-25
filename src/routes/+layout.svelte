<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/client/supabase';
	import { onMount } from 'svelte';
	import '../app.css';
	import { globalState } from '../stores/stores.svelte';

	let { children } = $props();

	async function checkUser() {
		const { data } = await supabase.auth.getUser();
		if (data.user) {
			globalState.user = data.user;
			goto('/chat');
		}
	}

	onMount(() => {
		checkUser();
	});
</script>

{@render children()}

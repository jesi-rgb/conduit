<script lang="ts">
	import { fetchWithAuth } from '$lib/client/auth';
	import { globalState } from '../../stores/stores.svelte';

	async function createConversation() {
		const response = await fetchWithAuth('/api/conversations', { method: 'POST' });
		console.log(response);
		globalState.fetchConversations();
	}

	async function test() {
		const response = await fetchWithAuth('/api/conversations');
		const json = await response.json();
	}
</script>

<main class="mx-auto my-20 w-fit">
	<div>Select a conversation</div>
	<button class="btn btn-primary" onclick={createConversation}>Create a new one</button>
	<button class="btn btn-secondary" onclick={test}>test</button>
</main>

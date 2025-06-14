<script>
	import InputKey from '$lib/components/ui/InputKey.svelte';
	import { onMount } from 'svelte';
	import { globalState } from '../../stores/stores.svelte';
	import TooltipExplain from '$lib/components/ui/TooltipExplain.svelte';

	let openRouterKey = $state('');
	let openAIKey = $state('');
	onMount(() => {
		const lsOrKey = localStorage.getItem('conduit-open-router');
		if (lsOrKey) openRouterKey = lsOrKey;
	});

	$effect(() => {
		if (openRouterKey) globalState.updateUserKeys('conduit-open-router', openRouterKey);
		if (openAIKey) globalState.updateUserKeys('conduit-openai', openAIKey);
	});
</script>

<main class="mx-auto my-20 max-w-2xl">
	<a class="btn btn-ghost" href="/chat">← Back</a>
	<h1 class="mb-10 text-3xl font-bold">Settings</h1>

	<section class="keys border-subtle flex flex-col gap-4">
		<div class="mb-2 flex flex-col gap-1">
			<h2 class="text-2xl font-semibold">Keys</h2>
			<p class="text-muted">
				Input your keys here. They won't be sent to DB, just in local storage.
			</p>
		</div>
		<InputKey
			bind:keyInput={openRouterKey}
			label="Open Router Key"
			icon="solar:branching-paths-up-bold"
		/>
		<TooltipExplain>
			<InputKey
				disabled={true}
				bind:keyInput={openAIKey}
				label="Open AI Key"
				icon="ri:openai-line"
			/>
			{#snippet content()}
				OpenAI will be supported soon. Sorry for now!
			{/snippet}
		</TooltipExplain>
	</section>
</main>

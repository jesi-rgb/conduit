<script lang="ts">
	import { globalState } from '../../stores/stores.svelte';
	import TextBox from '$lib/components/ui/TextBox.svelte';
	import { page } from '$app/state';

	$effect.pre(() => {
		globalState.currentBranches = [];
		globalState.currentMessages = [];
		globalState.currentSelectedText = null;
	});
	$effect(() => {
		globalState.inputTextBox?.focus();
	});
</script>

<svelte:head>
	<title>Conduit</title>
</svelte:head>

<div class="sticky top-[100vh] h-fit">
	<TextBox />
</div>

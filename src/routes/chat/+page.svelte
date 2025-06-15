<script lang="ts">
	import { globalState } from '../../stores/stores.svelte';
	import TextBox from '$lib/components/ui/TextBox.svelte';

	$effect.pre(() => {
		globalState.currentBranches = [];
		globalState.currentMessages = [];
	});
</script>

<div class="sticky top-[100vh] h-fit">
	<TextBox />
</div>

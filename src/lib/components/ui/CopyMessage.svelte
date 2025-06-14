<script>
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';

	const { message } = $props();
	let copied = $state(false);
</script>

<button
	onclick={() => {
		navigator.clipboard.writeText(message.content);
		copied = true;
		setTimeout(() => (copied = false), 1000);
	}}
	class="btn btn-xs btn-ghost btn-primary btn-circle relative size-7
											opacity-100"
>
	{#if copied}
		<span in:fade={{ duration: 200 }} out:fade={{ duration: 400 }}>
			<Icon
				icon="solar:clipboard-check-bold-duotone"
				class="absolute top-1/2
														left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg"
			/>
		</span>
	{:else}
		<span in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
			<Icon
				icon="solar:notes-bold-duotone"
				class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg"
			/>
		</span>
	{/if}
</button>

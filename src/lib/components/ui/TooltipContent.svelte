<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Tooltip, type WithoutChildrenOrChild } from 'bits-ui';

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithoutChildrenOrChild<Tooltip.ContentProps> & {
		children?: Snippet;
	} = $props();
</script>

<Tooltip.Content sideOffset={10} bind:ref {...restProps} forceMount={true}>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div
					class="bg-base-200 to-primary-content border-subtle rounded-box max-w-sm border p-3 text-xs shadow-lg"
					{...props}
					transition:fly={{ y: 10, duration: 200 }}
				>
					{@render children?.()}
				</div>
			</div>
		{/if}
	{/snippet}
</Tooltip.Content>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import TooltipContent from './TooltipContent.svelte';
	import { Tooltip } from 'bits-ui';

	interface Props {
		children: Snippet;
		content: Snippet;
		disabled?: boolean;
		restProps?: Record<string, any>;
		open?: boolean;
	}
	const { children, content, disabled, open = false, ...restProps }: Props = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root {disabled} delayDuration={0} {open}>
		<Tooltip.Trigger {...restProps}>
			{@render children()}
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<TooltipContent>
				{@render content()}
			</TooltipContent>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>

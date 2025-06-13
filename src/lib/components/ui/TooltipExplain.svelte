<script>
	import TooltipContent from './TooltipContent.svelte';
	import { Tooltip } from 'bits-ui';

	const { children, content, disabled, ...restProps } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root {disabled} delayDuration={0}>
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

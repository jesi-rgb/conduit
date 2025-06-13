<script lang="ts">
	import { Drawer as DrawerPrimitive } from 'vaul-svelte';
	import DrawerOverlay from './drawer-overlay.svelte';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		portalProps,
		children,
		...restProps
	}: DrawerPrimitive.ContentProps & {
		portalProps?: DrawerPrimitive.PortalProps;
	} = $props();
</script>

<DrawerPrimitive.Portal {...portalProps}>
	<DrawerPrimitive.Content
		bind:ref
		data-slot="drawer-content"
		class={cn(
			'group/drawer-content bg-background fixed z-50 flex h-auto flex-col',
			'data-[vaul-drawer-direction=right]:border-subtle data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-1/3 data-[vaul-drawer-direction=right]:border-l',
			className
		)}
		{...restProps}
	>
		<div data-vaul-no-drag class="pointer-events-auto">
			{@render children?.()}
		</div>
	</DrawerPrimitive.Content>
</DrawerPrimitive.Portal>

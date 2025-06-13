<script>
	import { Drawer } from 'vaul-svelte';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	let { children, conversationId, open } = $props();

	function closeBranch() {
		goto(`/chat/${conversationId}`);
	}
</script>

<Drawer.Root onClose={closeBranch} direction="right" bind:open>
	<Drawer.Portal>
		<Drawer.Content
			class="from-base-100 to-base-200 pointer-events-auto fixed top-0 right-0 bottom-0 z-30
			flex h-full w-1/3 flex-col bg-gradient-to-l
            data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 
			"
		>
			<div class="flex h-full flex-col">
				<div
					class="border-subtle flex items-center
					justify-between border-b px-2 py-[7.4px]"
				>
					<button onclick={closeBranch} class="btn btn-error btn-circle btn-xs">
						<Icon icon="solar:close-circle-linear" class="text-xl" />
					</button>
				</div>
				<div
					class="selection:bg-primary selection:text-primary-content pointer-events-auto flex-1
					overflow-auto select-text"
					data-vaul-no-drag
				>
					{@render children()}
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>

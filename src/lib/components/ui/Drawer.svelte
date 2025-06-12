<script>
	import { Drawer } from 'vaul-svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	let { children, conversationId } = $props();

	let isBranch = $derived(page.params.branch !== undefined);

	function closeBranch() {
		goto(`/chat/${conversationId}`);
	}
</script>

<Drawer.Root onClose={closeBranch} direction="right" bind:open={isBranch}>
	<Drawer.Portal>
		<Drawer.Content
			class="from-base-100
			to-base-200 data-[state=open]:animate-in
			data-[state=closed]:animate-out
			data-[state=closed]:slide-out-to-right 
			data-[state=open]:slide-in-from-right fixed top-0 right-0 h-full w-full
			max-w-2xl bg-gradient-to-l
			to-210% shadow-xl 
			data-[state=closed]:duration-200 data-[state=open]:duration-300
			"
		>
			<div class="flex h-full flex-col">
				<div
					class="border-subtle flex items-center
					justify-between border-b p-2"
				>
					<button onclick={closeBranch} class="btn btn-ghost btn-xs btn-circle">
						<Icon icon="solar:arrow-left-bold-duotone" />
					</button>
				</div>
				<div class="flex-1 overflow-auto">
					{@render children()}
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>

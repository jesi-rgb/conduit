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
			class="from-base-100 to-base-200 w-!/3 fixed top-0 right-0 bottom-0
			z-30 flex h-full flex-col bg-gradient-to-l p-2"
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

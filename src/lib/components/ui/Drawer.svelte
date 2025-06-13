<script>
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	let { children, conversationId, open = $bindable(false) } = $props();

	let isBranch = $derived(page.params.branch !== undefined);

	function closeBranch() {
		goto(`/chat/${conversationId}`);
	}
</script>

<Drawer.Root>
	<Drawer.Trigger>Open</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Are you sure absolutely sure?</Drawer.Title>
			<Drawer.Description>This action cannot be undone.</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

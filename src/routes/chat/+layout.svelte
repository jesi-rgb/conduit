<script>
	import BranchHistory from '$lib/components/ui/BranchHistory.svelte';
	import Sidebar from '$lib/components/ui/Sidebar.svelte';
	import { PaneGroup, PaneResizer, Pane } from 'paneforge';

	const { children } = $props();
</script>

<main class="h-[100vh]">
	<PaneGroup direction="horizontal" class="h-full">
		<Sidebar />
		<PaneResizer class="hover:bg-primary z-10 -mx-1.5 w-3 transition-colors"></PaneResizer>
		<Pane>
			{@render children()}
		</Pane>
		<PaneResizer class="hover:bg-primary z-10 -mx-1.5 w-3 transition-colors"></PaneResizer>
		<BranchHistory />
	</PaneGroup>
</main>

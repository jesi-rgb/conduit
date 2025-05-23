<script>
	import Icon from '@iconify/svelte';
	import { Pane, PaneResizer } from 'paneforge';

	const conversations = [];
</script>

<Pane defaultSize={15}>
	<section
		class="border-base-content/10 bg-base-200 flex h-full flex-col justify-between gap-10 border p-3
		shadow-lg"
	>
		<div class="border-red flex flex-col gap-2">
			{#each conversations as conv}
				<div class="flex items-center justify-between gap-3">
					<p>
						Conversation {conv}
					</p>
					<Icon icon="solar:trash-bin-trash-bold-duotone" class="text-error" />
				</div>
			{/each}
		</div>

		<div>Username</div>
	</section>
</Pane>

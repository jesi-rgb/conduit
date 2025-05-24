<script>
	import Icon from '@iconify/svelte';
	import { Pane } from 'paneforge';
	import { globalState } from '../../../stores/stores.svelte';

	const conversations = ['1'];

	const user = $derived(globalState.user);
	$inspect(user);
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
					<Icon
						icon="solar:trash-bin-trash-bold-duotone"
						class="text-base-content/20 hover:text-error
						btn btn-circle btn-xs btn-ghost transition-colors"
					/>
				</div>
			{/each}
		</div>

		<div>{user?.user_metadata.full_name}</div>
	</section>
</Pane>

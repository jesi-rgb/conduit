<script>
	import BranchHistory from '$lib/components/ui/BranchHistory.svelte';
	import Sidebar from '$lib/components/ui/Sidebar.svelte';
	import { Pane, PaneGroup, PaneResizer } from 'paneforge';
	import { ChatStateClass } from './ChatState.svelte';
	import Icon from '@iconify/svelte';

	const chatState = new ChatStateClass();

	let message = $state('');
	const fakeConvs = Array.from({ length: 20 }, (_, i) => i + 1);
</script>

<section class="flex h-full">
	<PaneGroup direction="horizontal" class="h-full">
		<Sidebar />

		<PaneResizer class="hover:bg-primary -mx-1.5 w-3 transition-colors"></PaneResizer>

		<Pane>
			<section id="convo-view " class="flex h-full w-full flex-col">
				<div class="h-10 p-3 shadow-sm">title</div>
				<div class="mx-auto flex w-full grow flex-col justify-between p-3">
					<div class="grow">
						{#each chatState.messages as message}
							{#if message.role === 'user'}
								<div class="chat chat-end">
									<div class="chat-bubble">
										{message.content}
									</div>
								</div>
							{:else if message.role === 'assistant'}
								<div class="chat chat-start">
									<div class="p-3">
										{message.content}
									</div>
								</div>
							{/if}
						{/each}
					</div>

					<form
						class="flex justify-between gap-3"
						onsubmit={(e) => {
							e.preventDefault();
							chatState.sendMessage(message);
							message = '';
						}}
					>
						<input
							type="text"
							bind:value={message}
							placeholder="Type your message..."
							class="input input-border w-full"
						/>
						<button class="btn" type="submit">
							{chatState.isLoading ? 'Loading...' : 'Send'}
						</button>
					</form>
				</div>
			</section>
		</Pane>

		<PaneResizer class="hover:bg-info z-10 -mx-1.5 w-3 transition-colors"></PaneResizer>

		<BranchHistory />
	</PaneGroup>
</section>

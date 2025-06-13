<script>
	import { onMount } from 'svelte';
	import { globalState } from '../../stores/stores.svelte';

	let mounted = false;
	onMount(() => {
		mounted = true;

		globalState.currentBranches = [];
		globalState.currentMessages = [];
	});
</script>

{#if mounted}
	<form
		class="flex justify-between gap-1 pt-1"
		onsubmit={(e) => {
			e.preventDefault();
			if (message) {
				if (isBranch) {
					chatState.sendMessageInBranch(message, branchId);
				} else {
					chatState.sendMessage(message);
				}
				message = '';
			}
		}}
	>
		<ModelSelector />

		<Tooltip.Provider disabled={localStorage.getItem(CONDUIT_PROVIDER) != undefined}>
			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger class="flex w-full gap-1">
					<input
						type="text"
						bind:this={inputMessage}
						bind:value={message}
						placeholder="Type your message..."
						class="input input-border focus:border-primary w-full min-w-60 focus:outline-none"
						disabled={chatState.isLoading ||
							chatState.isStreaming ||
							!localStorage.getItem(CONDUIT_PROVIDER)}
					/>
					<button
						class="btn"
						type="submit"
						disabled={chatState.isLoading ||
							chatState.isStreaming ||
							!localStorage.getItem(CONDUIT_PROVIDER)}
					>
						<Icon icon="solar:star-rainbow-bold-duotone" class="text-xl" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<TooltipContent>
						<div
							class="bg-base-200 to-primary-content
										border-subtle rounded-box max-w-sm border
										 p-3 shadow-lg backdrop-blur-xl"
						>
							<p>Looks like you didn't setup an API key.</p>

							<p>
								Head to <a
									class="text-primary font-bold
												underline"
									href="/settings">Settings</a
								>
								to start chatting!
							</p>
						</div>
					</TooltipContent>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	</form>
{/if}

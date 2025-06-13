<script lang="ts">
	import { onMount } from 'svelte';
	import { globalState } from '../../stores/stores.svelte';
	import { CONDUIT_PROVIDER } from '$lib/types';
	import Icon from '@iconify/svelte';
	import TooltipContent from '$lib/components/ui/TooltipContent.svelte';
	import { Tooltip } from 'bits-ui';
	import ModelSelector from '$lib/components/ui/ModelSelector.svelte';
	import { ChatStateClass } from './[id]/ChatState.svelte';
	import { goto } from '$app/navigation';
	import { fetchWithAuth } from '$lib/client/auth';

	import type { Conversation } from '$lib/types';

	let mounted = $state(false);
	let message = $state('');
	let inputMessage: HTMLInputElement = $state();
	let chatState = new ChatStateClass();

	onMount(() => {
		mounted = true;

		globalState.currentBranches = [];
		globalState.currentMessages = [];
	});

	let noKey = localStorage.getItem(CONDUIT_PROVIDER) == undefined;

	async function newConversation(): Promise<Conversation> {
		const data = await fetchWithAuth({
			url: `/api/conversations/`,
			options: {
				method: 'POST',
				body: JSON.stringify({ title: 'New Chat' })
			}
		});
		const convData = (await data.json()).conversation;

		chatState.conversation_id = convData.id;

		chatState.sendMessage(message);

		globalState.fetchConversations();

		return convData;
	}
</script>

<div class="mx-auto my-auto flex h-full max-w-[70%] flex-col justify-center">
	{#if mounted}
		<div class="">
			<ModelSelector />
		</div>
		<form
			class="flex justify-between gap-1 pt-1"
			onsubmit={async (e) => {
				e.preventDefault();
				// here we both create a convo and send messages
				const newConvo: Conversation = await newConversation();

				goto(`/chat/${newConvo.id}`);
			}}
		>
			<Tooltip.Provider disabled={localStorage.getItem(CONDUIT_PROVIDER) != undefined}>
				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger class="flex w-full gap-1">
						<input
							type="text"
							bind:this={inputMessage}
							bind:value={message}
							placeholder="Type your message..."
							class="input input-border focus:border-primary w-full min-w-60 focus:outline-none"
							disabled={noKey}
						/>
						<button class="btn" type="submit" disabled={noKey}>
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
</div>

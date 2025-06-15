<script lang="ts">
	import { onMount } from 'svelte';
	import { globalState } from '../../stores/stores.svelte';
	import { CONDUIT_PROVIDER } from '$lib/types';
	import Icon from '@iconify/svelte';
	import ModelSelector from '$lib/components/ui/ModelSelector.svelte';
	import { ChatStateClass } from './[id]/ChatState.svelte';
	import { goto } from '$app/navigation';
	import { fetchWithAuth } from '$lib/client/auth';
	import TooltipExplain from '$lib/components/ui/TooltipExplain.svelte';
	import { activeChatState } from '../../stores/chatStore.svelte';

	let mounted = $state(false);
	let message = $state('');
	let inputMessage: HTMLTextAreaElement | null = $state(null);
	let noKey = $state(true);

	let focusedTA = $state(false);

	onMount(() => {
		mounted = true;

		noKey = localStorage.getItem(CONDUIT_PROVIDER) == undefined;

		inputMessage?.focus();

		activeChatState.set(null); // ➜ Clear any previous state when visiting the home page
	});

	$effect(() => {
		inputMessage?.focus();
	});
	$effect.pre(() => {
		globalState.currentBranches = [];
		globalState.currentMessages = [];
	});

	async function newConversation() {
		const data = await fetchWithAuth({
			url: `/api/conversations/`,
			options: {
				method: 'POST',
				body: JSON.stringify({ title: 'New Chat' })
			}
		});
		const convData = (await data.json()).conversation;

		const newChatState = new ChatStateClass(convData.id);

		newChatState!.sendMessage(message);

		activeChatState.set(newChatState);
		goto(`/chat/${convData.id}`, { replaceState: false });
	}
</script>

<div
	class:focusedTA
	class="from-base-100 to-base-200 hover:ring-subtle shadow-base-200
	focus:ring-primary sticky top-[200vh] mx-auto flex w-[90%] max-w-[70%] flex-col justify-center rounded-2xl rounded-br-none
	rounded-bl-none bg-gradient-to-b p-2 shadow-xl hover:ring"
>
	{#if mounted}
		<form
			class=" w-full gap-1 rounded-xl p-1"
			onsubmit={async (e) => {
				e.preventDefault();
			}}
		>
			<TooltipExplain class="w-full" disabled={!noKey}>
				<textarea
					onkeydown={(e) => {
						if (e.shiftKey && e.key === 'Enter') {
							e.preventDefault();
							return;
						}
						if (e.key === 'Enter') {
							e.preventDefault();
							newConversation();
						}
					}}
					bind:this={inputMessage}
					bind:value={message}
					bind:focused={focusedTA}
					placeholder="Type your message..."
					class="textarea textarea-ghost focus:border-primary focus:ring-none
					h-30 w-full min-w-60
					rounded-br-none rounded-bl-none border-b-0
					align-baseline focus:bg-transparent focus:outline-none disabled:bg-transparent"
					disabled={noKey}
				>
					<div class="z-20">yeah</div>
				</textarea>

				{#snippet content()}
					<div class="text-base">
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
				{/snippet}
			</TooltipExplain>

			<div class="flex justify-between">
				<ModelSelector />
				<button class="btn" type="submit" disabled={noKey}>
					<Icon icon="solar:star-rainbow-bold-duotone" class="text-xl" />
				</button>
			</div>
		</form>
	{/if}
</div>

<style>
	::placeholder {
		vertical-align: baseline;
	}

	textarea {
		resize: none;
		border: none;
	}
	textarea:focus {
		outline: none;
		box-shadow: none; /* For some browsers like Firefox */
	}
	.focusedTA {
		box-shadow:
			inset 0 1px 0 0 var(--color-primary),
			inset 1px 0 0 0 var(--color-primary),
			inset -1px 0 0 0 var(--color-primary);
	}
</style>

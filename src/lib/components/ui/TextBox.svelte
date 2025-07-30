<script lang="ts">
	import { onMount } from 'svelte';
	import TooltipExplain from './TooltipExplain.svelte';
	import { activeChatState } from '../../../stores/chatStore.svelte';
	import { CONDUIT_OPEN_ROUTER_KEY } from '$lib/types';
	import { ChatStateClass } from '../../../routes/chat/[id]/ChatState.svelte';
	import { fetchWithAuth } from '$lib/client/auth';
	import { goto } from '$app/navigation';
	import ModelSelector from './ModelSelector.svelte';
	import Icon from '@iconify/svelte';
	import { globalState } from '../../../stores/stores.svelte';

	let noKey = $state(false); // Changed default to false since we have fallback
	let focusedTA = $state(false);
	let mounted = $state(false);
	let message = $state('');

	const { selectedQuestion }: { selectedQuestion: string } = $props();

	let inputMessage: HTMLTextAreaElement | null = $state(null);
	onMount(() => {
		mounted = true;

		// No longer block users without API key since we have fallback
		noKey = false;

		activeChatState.set(null);

		globalState.inputTextBox = inputMessage;
		inputMessage?.focus();
	});

	$effect(() => {
		inputMessage?.focus();
		selectedQuestion ? (message = selectedQuestion) : (message = '');
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

		// Immediately add the new conversation to the global state in correct chronological position
		const conversations = [...globalState.conversations];
		const insertIndex = conversations.findIndex(
			(conv) => new Date(conv.created_at) < new Date(convData.created_at)
		);
		if (insertIndex === -1) {
			conversations.push(convData);
		} else {
			conversations.splice(insertIndex, 0, convData);
		}
		globalState.conversations = conversations;

		const newChatState = new ChatStateClass(convData.id);

		newChatState!.sendMessage(message);

		activeChatState.set(newChatState);
		goto(`/chat/${convData.id}`, { replaceState: false });
	}
</script>

<div
	class:focusedTA
	class="from-base-100 to-base-200 hover:ring-subtle shadow-base-200
	focus:ring-primary mx-auto flex min-h-40 w-full flex-col justify-center rounded-2xl
	rounded-br-none rounded-bl-none bg-gradient-to-b p-2 shadow-xl hover:ring"
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
					rows="10"
					onkeydown={(e) => {
						if (e.shiftKey && e.key === 'Enter') {
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
					placeholder={localStorage?.getItem(CONDUIT_OPEN_ROUTER_KEY)
						? 'Type your message...'
						: 'Type your message (using free Kimi model)...'}
					class="textarea textarea-ghost focus:border-primary focus:ring-none
					mb-3 h-30 w-full
					min-w-60 rounded-br-none rounded-bl-none
					border-b-0 align-baseline focus:bg-transparent
					focus:outline-none disabled:bg-transparent"
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
				<button class="btn" type="submit" onclick={newConversation} disabled={noKey}>
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
		field-sizing: normal;
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

<script lang="ts">
	import { onMount } from 'svelte';
	import { globalState } from '../../../stores/stores.svelte.js';
	import { page } from '$app/state';
	import { fetchWithAuth } from '$lib/client/auth.js';
	import Icon from '@iconify/svelte';
	import ModelSelector from '$lib/components/ui/ModelSelector.svelte';
	import { CONDUIT_OPEN_ROUTER_KEY } from '$lib/types.js';
	import { Tooltip } from 'bits-ui';
	import TooltipContent from '$lib/components/ui/TooltipContent.svelte';
	import type { ChatStateClass } from '../../../routes/chat/[id]/ChatState.svelte.js';
	import Message from './Message.svelte';
	import TooltipExplain from './TooltipExplain.svelte';

	interface Props {
		chatState: ChatStateClass;
		conversationId: string;
		branchId?: string | undefined;
	}

	let { chatState, conversationId, branchId = undefined }: Props = $props();

	let isBranch = $derived(!!branchId);

	let messageInUrl = $derived(page.url.searchParams.get('message'));
	let inputMessage: HTMLInputElement | null = $state(null);

	let message = $derived.by(() => {
		if (isBranch && globalState.currentSelectedText != null) {
			return `> ${globalState.currentSelectedText}

`;
		} else {
			return '';
		}
	});
	let chatContainer: HTMLDivElement | null = $state(null);
	let mounted = $state(false);

	onMount(async () => {
		globalState.fetchBranches = async () => {
			const response = await fetchWithAuth({ url: `/api/branches/${conversationId}` });
			globalState.currentBranches = (await response.json()).branches;
		};
		globalState.fetchBranches();

		mounted = true;

		chatState.scrollContainer = () => {
			console.log('yea');
			chatContainer.scrollTop = chatContainer.scrollHeight;
		};
	});

	$effect(() => {
		document.getElementById(messageInUrl!)?.scrollIntoView({ behavior: 'smooth' });

		if (!chatState.isStreaming && mounted) {
			inputMessage?.focus();
		}
	});

	let messagesToDisplay = $derived(branchId ? chatState.currentBranch : chatState.messages);
</script>

{#if messagesToDisplay}
	<section id="convo-view" class="flex h-full w-full flex-col">
		{#if !isBranch}
			<div class="border-base-300 h-10 border-b p-2 pl-6 font-bold">{chatState.title}</div>
		{/if}
		<div class="mx-auto flex w-full grow flex-col justify-between p-3 pt-1">
			<div
				bind:this={chatContainer}
				class="h-20 grow overflow-y-scroll
				pt-2"
			>
				{#each messagesToDisplay as message, i (message.id)}
					<Message {message} {chatState} />
				{/each}
			</div>

			{#if mounted}
				<form
					class="flex justify-between gap-1 pt-1"
					onsubmit={(e) => {
						e.preventDefault();
						if (message) {
							if (isBranch && branchId) {
								chatState.sendMessageInBranch(message, branchId);
							} else {
								chatState.sendMessage(message);
							}
							message = '';
						}
					}}
				>
					<ModelSelector />

					<TooltipExplain
						class="flex w-full gap-1"
						disabled={!!localStorage.getItem(CONDUIT_OPEN_ROUTER_KEY)}
					>
						<input
							type="text"
							bind:this={inputMessage}
							bind:value={message}
							placeholder="Type your message..."
							class="input input-border focus:border-primary w-full min-w-60 focus:outline-none"
							disabled={chatState.isLoading ||
								chatState.isStreaming ||
								!localStorage.getItem(CONDUIT_OPEN_ROUTER_KEY)}
						/>
						{#if chatState.isStreaming}
							<button class="btn btn-error" onclick={() => chatState.cancelStream()}>
								<Icon icon="solar:stop-bold" class="text-xl" />
							</button>
						{:else}
							<button
								class="btn"
								type="submit"
								disabled={chatState.isLoading ||
									chatState.isStreaming ||
									!localStorage.getItem(CONDUIT_OPEN_ROUTER_KEY)}
							>
								<Icon icon="solar:star-rainbow-bold-duotone" class="text-xl" />
							</button>
						{/if}
						{#snippet content()}
							<p>Looks like you didn't setup an API key.</p>

							<p>
								Head to <a
									class="text-primary font-bold
								underline"
									href="/settings">Settings</a
								>
								to start chatting!
							</p>
						{/snippet}
					</TooltipExplain>
				</form>
			{/if}
		</div>
	</section>
{/if}

<style>
	:global(.code-block-wrapper) {
		position: relative;
	}

	:global(.code-lang-badge) {
		position: absolute;
		top: 8px;
		right: 8px;
		background: var(--color-primary);
		color: var(--color-primary-content);
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 12px;
		font-family: monospace;
		z-index: 1;
	}
	:global(.shiki) {
		background-color: color-mix(in oklch, var(--color-base-200), transparent 40%) !important;
	}
</style>

<!-- $lib/components/ConversationView.svelte -->
<script lang="ts">
	import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async';
	import { onMount } from 'svelte';
	import { globalState } from '../../../stores/stores.svelte.js';
	import MarkdownItAsync from 'markdown-it-async';
	import { codeToHtml } from 'shiki';
	import { page } from '$app/state';
	import { fetchWithAuth } from '$lib/client/auth.js';
	import Icon from '@iconify/svelte';
	import ModelSelector from '$lib/components/ui/ModelSelector.svelte';
	import { CONDUIT_PROVIDER, type Conversation } from '$lib/types.js';
	import { Tooltip } from 'bits-ui';
	import TooltipContent from '$lib/components/ui/TooltipContent.svelte';
	import type { ChatStateClass } from '../../../routes/chat/[id]/ChatState.svelte.js';
	import TooltipExplain from './TooltipExplain.svelte';
	import CopyMessage from './CopyMessage.svelte';

	interface Props {
		chatState: ChatStateClass;
		conversationId: string;
		branchId?: string | undefined;
	}

	let { chatState, conversationId, branchId = undefined }: Props = $props();

	let isBranch = $derived(!!branchId);

	const md = MarkdownItAsync();
	const mdStreaming = MarkdownItAsync();

	let messageInUrl = $derived(page.url.searchParams.get('message'));
	let inputMessage: HTMLInputElement | null = $state(null);

	let message = $state('');
	let chatContainer: HTMLDivElement | null = $state(null);
	let mounted = $state(false);

	onMount(async () => {
		md.use(
			fromAsyncCodeToHtml(codeToHtml, {
				themes: {
					light: 'vitesse-light',
					dark: 'vesper'
				}
			})
		);

		const defaultFenceRenderer =
			md.renderer.rules.fence ||
			function (tokens, idx, options, env, renderer) {
				return renderer.renderToken(tokens, idx, options);
			};

		md.renderer.rules.fence = function (tokens, idx, options, env, renderer) {
			const token = tokens[idx];
			const langName = token.info.trim().split(/\s+/g)[0];
			const langBadge = langName ? `<div class="code-lang-badge">${langName}</div>` : '';
			const originalCode = defaultFenceRenderer(tokens, idx, options, env, renderer);
			return `<div class="code-block-wrapper">${langBadge}${originalCode}</div>`;
		};

		globalState.fetchBranches = async () => {
			const response = await fetchWithAuth({ url: `/api/branches/${conversationId}` });
			globalState.currentBranches = (await response.json()).branches;
		};
		globalState.fetchBranches();

		mounted = true;
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
				{#each messagesToDisplay as message}
					<div id={message.id} class="group">
						{#if message.role === 'user'}
							<div class="chat chat-end">
								<p
									class="bg-primary/15 border-primary/30 self-end
									rounded-2xl rounded-br-xs border px-4 py-2"
								>
									{message.content}
								</p>
								<div
									class="chat-footer font-mono opacity-0
									transition-opacity duration-100
									group-hover:opacity-50"
								>
									{new Date(message.created_at).toLocaleString('es-ES')}
								</div>
							</div>
						{:else if message.role === 'assistant'}
							<div class="chat chat-start">
								<div class="flex flex-col p-3">
									{#if chatState.isStreaming && chatState.streamingMessage?.id === message.id && chatState.streamingMessage?.content === ''}
										<div><span class="loading-dots loading"></span></div>
									{:else}
										<div class="prose prose-code:px-0">
											{#await (chatState.isStreaming && chatState.streamingMessage?.id === message.id ? mdStreaming : md).renderAsync(message.content) then markdown}
												{@html markdown}
											{/await}
										</div>

										<div
											class="mt-3 flex h-max items-center gap-4 place-self-start font-mono
										text-xs opacity-0
										transition-opacity duration-100
										group-hover:opacity-100"
										>
											<span class="opacity-50">
												{new Date(message.created_at).toLocaleString('es-ES')}
											</span>
											<CopyMessage {message} />
											{#if !isBranch}
												<TooltipExplain>
													<button
														class="btn btn-xs btn-ghost btn-primary btn-circle size-7 opacity-100"
														onclick={() => chatState.branchOut(message)}
													>
														<Icon class="text-lg" icon="solar:chat-square-arrow-bold-duotone" />
													</button>

													{#snippet content()}
														<div>Branch out</div>
													{/snippet}
												</TooltipExplain>
											{/if}

											{#each globalState.currentBranches as branch, b (branch.id)}
												{#if branch.branch_from_message_id === message.id}
													<TooltipExplain>
														<a
															href="/chat/{message.conversation_id}/{branch.id}"
															class="btn btn-xs btn-ghost btn-primary btn-circle size-7"
														>
															<Icon class="text-lg" icon="solar:login-3-line-duotone" />
														</a>

														{#snippet content()}
															Branch {b + 1}
														{/snippet}
													</TooltipExplain>
												{/if}
											{/each}
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
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

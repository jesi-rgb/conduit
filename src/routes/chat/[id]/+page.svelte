<script lang="ts">
	import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async';
	import { onMount } from 'svelte';
	import { ChatStateClass } from './ChatState.svelte.js';
	import { globalState } from '../../../stores/stores.svelte.js';
	import MarkdownItAsync from 'markdown-it-async';
	import { codeToHtml } from 'shiki';
	import { page } from '$app/state';
	import { fetchWithAuth } from '$lib/client/auth.js';
	import Icon from '@iconify/svelte';
	import { blur, fade, fly } from 'svelte/transition';
	import ModelSelector from '$lib/components/ui/ModelSelector.svelte';
	import { CONDUIT_PROVIDER } from '$lib/types.js';
	import { Tooltip } from 'bits-ui';
	import TooltipContent from '$lib/components/ui/TooltipContent.svelte';

	const md = MarkdownItAsync();

	let { data } = $props();

	let messageInUrl = $derived(page.url.searchParams.get('message'));

	let inputMessage: HTMLInputElement | null = $state(null);

	let chatState: ChatStateClass | null = $derived(data.chatState);

	const scrollToBottom = (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	let message = $state('');
	let chatContainer: HTMLDivElement | null = $state(null);

	let copied = $state(false);

	let mounted = $state(false);
	onMount(async () => {
		md.use(
			fromAsyncCodeToHtml(
				// Pass the codeToHtml function
				codeToHtml,
				{
					themes: {
						light: 'vitesse-light',
						dark: 'vesper'
					}
				}
			)
		);

		// Override the fence renderer to add language badges
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
			const response = await fetchWithAuth({ url: `/api/branches/${page.params.id}` });
			globalState.currentBranches = (await response.json()).branches;
		};
		globalState.fetchBranches();

		document.getElementById(messageInUrl!)?.scrollIntoView({ behavior: 'smooth' });
		mounted = true;
	});

	$effect(() => {
		document.getElementById(messageInUrl!)?.scrollIntoView({ behavior: 'smooth' });

		chatState.scrollContainer = () => {
			scrollToBottom(chatContainer!);
		};

		if (!chatState.isStreaming && mounted) {
			inputMessage?.focus();
		}
	});
</script>

{#if chatState?.messages}
	<section id="convo-view" class="flex h-full w-full flex-col">
		<div class="border-base-300 h-10 border-b p-2 pl-6 font-bold">{chatState.title}</div>
		<div class="mx-auto flex w-full grow flex-col justify-between p-3 pt-1">
			<div
				bind:this={chatContainer}
				class="h-20 grow overflow-y-scroll
				pt-2"
			>
				{#each chatState.messages as message}
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
									{#if chatState.isStreaming && message.id === chatState.streamingMessage?.id}
										<div><span class="loading-dots loading"></span></div>
									{:else}
										<div style="contain: content;" class="prose prose-code:px-0">
											{#await md.renderAsync(message.content) then markdown}
												{@html markdown}
											{/await}
										</div>

										<div
											class="mt-3 flex h-max items-center gap-3 place-self-start font-mono
										text-xs opacity-0
										transition-opacity duration-100
										group-hover:opacity-100"
										>
											<span class="opacity-50">
												{new Date(message.created_at).toLocaleString('es-ES')}
											</span>
											<button
												onclick={() => {
													navigator.clipboard.writeText(message.content);
													copied = true;
													setTimeout(() => (copied = false), 1000);
												}}
												class="btn btn-xs btn-ghost btn-primary btn-circle relative size-7
											opacity-100"
											>
												{#if copied}
													<span in:fade={{ duration: 200 }} out:fade={{ duration: 400 }}>
														<Icon
															icon="solar:clipboard-check-bold-duotone"
															class="absolute top-1/2
														left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg"
														/>
													</span>
												{:else}
													<span in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
														<Icon
															icon="solar:notes-bold-duotone"
															class="absolute left-1/2
														-translate-x-1/2 -translate-y-1/2 text-lg"
														/>
													</span>
												{/if}
											</button>
											<button
												class="btn btn-xs btn-ghost
											btn-primary btn-circle relative
											size-7
											opacity-100"
												onclick={() => chatState.branchOut()}
											>
												<Icon class="text-lg" icon="solar:chat-square-arrow-bold-duotone" />
											</button>

											{#each globalState.currentBranches as branch}
												{#if branch.branch_from_message_id === message.id}
													<a
														data-sveltekit-preload-data="tap"
														href="/chat/{message.conversation_id}/{branch.id}"
														class="place-self-end self-end text-right text-xs"
													>
														<div class="my-auto flex h-full items-center gap-3">
															<span> Branch </span>
															<Icon
																class="text-primary"
																icon="solar:chat-square-arrow-bold-duotone"
															/>
														</div>
													</a>
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
							chatState.sendMessage(message);
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
									class="input input-border focus:border-primary w-full focus:outline-none"
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

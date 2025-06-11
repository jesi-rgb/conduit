<script lang="ts">
	import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async';
	import { onMount } from 'svelte';
	import MarkdownItAsync from 'markdown-it-async';
	import { codeToHtml } from 'shiki';
	import { page } from '$app/state';
	import { fetchWithAuth } from '$lib/client/auth.js';
	import Icon from '@iconify/svelte';
	import { blur, fade, fly } from 'svelte/transition';
	import { ChatStateClass } from '../ChatState.svelte.js';
	import { globalState } from '../../../../stores/stores.svelte.js';
	import ModelSelector from '$lib/components/ui/ModelSelector.svelte';

	const md = MarkdownItAsync();

	let { data } = $props();

	let messageInUrl = $derived(page.url.searchParams.get('message'));

	let chatState: ChatStateClass | null = $derived(data.chatState);

	let message = $state('');
	let chatContainer: HTMLDivElement | null = $state(null);

	let copied = $state(false);

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
	});

	let inputMessage: HTMLInputElement | null = $state(null);

	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
	$effect(() => {
		document.getElementById(messageInUrl!)?.scrollIntoView({ behavior: 'smooth' });

		if (!chatState.isStreaming && mounted) {
			inputMessage?.focus();
		}
	});
</script>

{#if chatState?.messages}
	<section id="convo-view" class="flex h-full w-full shrink flex-col">
		<div
			class="border-base-300 flex h-10 items-center gap-3 border-b p-3
			pl-6"
		>
			<div class="breadcrumbs text-sm">
				<ul>
					<li>
						<a data-sveltekit-preload-data="tap" href="/chat/{page.params.id}">{chatState.title}</a>
					</li>
					<li>Branch {page.params.branch}</li>
				</ul>
			</div>
		</div>
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
									<p class="prose prose-code:px-0">
										{#await md.renderAsync(message.content) then markdown}
											{@html markdown}
										{/await}
									</p>

									<div
										class="mt-3 flex items-center
										gap-3 place-self-start
										font-mono text-xs
										opacity-0 transition-opacity
										duration-100 group-hover:opacity-100"
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
											class="btn btn-xs btn-ghost
											btn-primary btn-circle relative
											size-7
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
														icon="solar:copy-bold-duotone"
														class="absolute left-1/2
														-translate-x-1/2 -translate-y-1/2 text-lg"
													/>
												</span>
											{/if}
										</button>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
			<form
				class="flex justify-between gap-1 pt-1"
				onsubmit={(e) => {
					e.preventDefault();
					if (message) {
						chatState.sendMessageInBranch(message, page.params.branch);
						message = '';
						chatState.onFinishSend();
					}
				}}
			>
				<ModelSelector />
				<input
					type="text"
					bind:this={inputMessage}
					bind:value={message}
					placeholder="Type your message..."
					disabled={chatState.isLoading || chatState.isStreaming}
					class="input input-border focus:border-primary w-full focus:outline-none"
				/>
				<button class="btn" type="submit" disabled={chatState.isLoading || chatState.isStreaming}>
					<Icon icon="solar:star-rainbow-bold-duotone" class="text-xl" />
				</button>
			</form>
		</div>
	</section>
{/if}

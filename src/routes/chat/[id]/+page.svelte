<script lang="ts">
	import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async';
	import { onMount } from 'svelte';
	import { ChatStateClass } from './ChatState.svelte.js';
	import { globalState } from '../../../stores/stores.svelte.js';
	import MarkdownItAsync from 'markdown-it-async';
	import { codeToHtml } from 'shiki';
	import { page } from '$app/state';
	import { fetchWithAuth } from '$lib/client/auth.js';

	const messageNavigation = $derived(page.url.searchParams.get('message'));

	const md = MarkdownItAsync();

	let { data } = $props();

	let chatState: ChatStateClass | null = $derived(data.chatState);

	const scrollToBottom = (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	let message = $state('');
	let chatContainer: HTMLDivElement | null = $state(null);

	onMount(async () => {
		chatState.scrollContainer = () => {
			scrollToBottom(chatContainer!);
		};

		md.use(
			fromAsyncCodeToHtml(
				// Pass the codeToHtml function
				codeToHtml,
				{
					themes: {
						light: 'catppuccin-latte',
						dark: 'vitesse-dark'
					}
				}
			)
		);

		globalState.fetchBranches = async () => {
			const response = await fetchWithAuth('/api/branches/' + page.params.id);
			globalState.currentBranches = (await response.json()).branches;
		};
		globalState.fetchBranches();
	});

	$effect(() => {
		if (messageNavigation) {
			console.log(document.getElementById(messageNavigation));
			document.getElementById(messageNavigation)?.scrollIntoView({ behavior: 'smooth' });
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
								<p class="chat-bubble">
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
										class="place-self-start font-mono text-xs opacity-0
										transition-opacity duration-100
										group-hover:opacity-50"
									>
										{new Date(message.created_at).toLocaleString('es-ES')}
									</div>
								</div>
							</div>
						{/if}
					</div>
					{#each globalState.currentBranches as branch}
						{#if branch.branch_from_message_id === message.id}
							<a
								data-sveltekit-preload-data="tap"
								href="/chat/{message.conversation_id}/{branch.id}"
								class="place-self-end self-end text-right text-xs"
							>
								<p class="bg-base-200 py-3 text-xl">→</p>
							</a>
						{/if}
					{/each}
				{/each}
			</div>

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
				<input
					type="text"
					bind:value={message}
					placeholder="Type your message..."
					class="input input-border w-full"
					disabled={chatState.isLoading || chatState.isStreaming}
				/>
				<button class="btn" type="submit" disabled={chatState.isLoading || chatState.isStreaming}>
					{chatState.isLoading ? 'Loading...' : 'Send'}
				</button>
				<button
					class="btn"
					onclick={() => chatState.branchOut()}
					disabled={chatState.isLoading || chatState.isStreaming}
				>
					{chatState.isLoading ? 'Loading...' : 'Branch'}
				</button>
			</form>
		</div>
	</section>
{/if}

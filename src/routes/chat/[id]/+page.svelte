<script lang="ts">
	import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import { ChatStateClass } from './ChatState.svelte.js';
	import { globalState } from '../../../stores/stores.svelte.js';

	import Shiki from '@shikijs/markdown-it';
	import MarkdownItAsync from 'markdown-it-async';
	import { codeToHtml } from 'shiki';

	const md = MarkdownItAsync();

	let { data } = $props();

	let chatState: ChatStateClass | null = $derived(data.chatState);

	const scrollToBottom = (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	let message = $state('');
	let chatContainer: HTMLDivElement | null = $state(null);
	onMount(async () => {
		chatState.onFinishSend = () => {
			scrollToBottom(chatContainer!);
		};

		globalState.fetchBranches = async () => {
			const response = await fetch(`/api/branches/${chatState.conversation_id}`);
			const branches = (await response.json()).branches;
			globalState.currentBranches = branches;
		};
		globalState.fetchBranches();

		md.use(
			fromAsyncCodeToHtml(
				// Pass the codeToHtml function
				codeToHtml,
				{
					themes: {
						light: 'vitesse-light',
						dark: 'vitesse-dark'
					}
				}
			)
		);
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
					<div id="msg-{message.id}" class="group">
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
									<p class="prose">
										{#await md.renderAsync(message.content) then value}
											{@html value}
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
								<p class="text-xs">→</p>
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
						chatState.onFinishSend();
					}
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
				<button class="btn" onclick={() => chatState.branchOut()}>
					{chatState.isLoading ? 'Loading...' : 'Branch'}
				</button>
			</form>
		</div>
	</section>
{/if}

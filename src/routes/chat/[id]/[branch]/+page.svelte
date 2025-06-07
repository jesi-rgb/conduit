<script lang="ts">
	import { page } from '$app/state';

	import { onMount } from 'svelte';
	import { globalState } from '../../../../stores/stores.svelte.js';

	const { data } = $props();

	const chatState = $derived(data.chatState);

	const scrollToBottom = (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	let message = $state('');
	let chatContainer: HTMLDivElement | null = $state(null);
	onMount(async () => {
		chatState.onFinishSend = () => {
			scrollToBottom(chatContainer!);
		};
	});
</script>

{#if chatState?.messages}
	<section id="convo-view" class="flex h-full w-full shrink flex-col">
		<div
			class="border-base-300 flex h-10 items-center gap-3 border-b p-3
			pl-6"
		>
			<p class="font-bold">
				{chatState.title}
			</p>

			<div class="breadcrumbs text-sm">
				<ul>
					<li><a href="/chat">Home</a></li>
					<li><a href="/chat/{page.params.id}">Chat</a></li>
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
									<p class="">
										{message.content}
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
						chatState.sendMessageInBranch(message, page.params.branch);
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
			</form>
		</div>
	</section>
{/if}

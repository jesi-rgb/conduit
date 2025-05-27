<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { ChatStateClass } from './ChatState.svelte.js';

	let { data } = $props();

	let chatState: ChatStateClass | null = $derived(data.chatState);

	const scrollToBottom = (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	let message = $state('');
	let chatContainer: HTMLDivElement | null = $state(null);
	onMount(() => {
		chatState.onFinishSend = () => {
			scrollToBottom(chatContainer!);
		};
		console.log(chatState.onFinishSend);
	});
</script>

{#if chatState?.messages}
	<section id="convo-view " class="flex h-full w-full flex-col">
		<div class="h-10 p-2 pl-6 font-bold shadow-md">{chatState.title}</div>
		<div class="mx-auto flex w-full grow flex-col justify-between p-3 pt-1">
			<div bind:this={chatContainer} class="h-20 grow overflow-y-scroll">
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
				{/each}
			</div>

			<form
				class="flex justify-between gap-3 pt-3
			"
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
			</form>
		</div>
	</section>
{/if}

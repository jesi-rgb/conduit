<script lang="ts">
	import { ChatStateClass } from './ChatState.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { ChatState } from '$lib/types';

	let { data } = $props();

	let chatState: ChatState | null = $derived(data.chatState);

	let message = $state('');
</script>

{#if chatState?.messages}
	<section id="convo-view " class="flex h-full w-full flex-col">
		<div class="h-10 p-2 pl-6 font-bold shadow-sm">{page.params.id}</div>
		<div class="mx-auto flex w-full grow flex-col justify-between p-3 pt-0">
			<div class="h-20 grow overflow-y-scroll">
				{#each chatState.messages as message}
					{#if message.role === 'user'}
						<div class="chat chat-end">
							<div class="chat-bubble">
								{message.content}
							</div>
						</div>
					{:else if message.role === 'assistant'}
						<div class="chat chat-start">
							<div class="p-3">
								{message.content}
							</div>
						</div>
					{/if}
				{/each}
			</div>

			<form
				class="flex justify-between gap-3 pt-3
			"
				onsubmit={(e) => {
					e.preventDefault();
					chatState.sendMessage(message);
					message = '';
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

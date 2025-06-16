<script lang="ts">
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import { globalState } from '../../../stores/stores.svelte';
	import CopyMessage from './CopyMessage.svelte';
	import TooltipExplain from './TooltipExplain.svelte';
	import { onMount } from 'svelte';
	import MarkdownItAsync from 'markdown-it-async';
	import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async';
	import { codeToHtml } from 'shiki';
	import type { ChatStateClass } from '../../../routes/chat/[id]/ChatState.svelte';
	import type { Branch, Message, Highlight } from '$lib/types';
	import { Popover } from 'bits-ui';
	import { fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { createHighlighterPlugin } from '$lib/markdown/highlights'; // Adjust path

	const { message, chatState }: { message: Message; chatState: ChatStateClass } = $props();
	const isBranch = $derived(!!page.params.branch);

	const md = MarkdownItAsync();
	const mdStreaming = MarkdownItAsync();

	let messageContainer: HTMLDivElement | null = $state(null);

	let isBranchPopupOpen = $state(false);

	let selectionRect: DOMRect | null = $state(null);
	let selection: Selection | null = $state(null);
	// State for the new selection data
	let selectionData = $state({
		text: null as string | null,
		nodeType: null as string | null,
		nodeIndex: null as number | null,
		startOffset: null as number | null,
		endOffset: null as number | null
	});

	const virtualAnchor = $derived({
		getBoundingClientRect: () => {
			return selectionRect || new DOMRect(0, 0, 0, 0);
		}
	});

	async function handleSelection() {
		selection = window.getSelection();
		if (!selection || selection.isCollapsed || !messageContainer || isBranch) {
			isBranchPopupOpen = false;
			return;
		}

		const range = selection.getRangeAt(0);
		if (!messageContainer.contains(range.commonAncestorContainer)) {
			return;
		}

		let blockElement = range.commonAncestorContainer;
		if (blockElement.nodeType === Node.TEXT_NODE) {
			blockElement = blockElement.parentElement!;
		}
		while (
			blockElement &&
			!['P', 'LI', 'CODE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(blockElement.tagName)
		) {
			blockElement = blockElement.parentElement!;
		}

		if (!blockElement || !messageContainer.contains(blockElement)) {
			isBranchPopupOpen = false;
			return;
		}

		const nodeType = blockElement.tagName;
		const allNodesOfType = Array.from(messageContainer.querySelectorAll(nodeType));
		const nodeIndex = allNodesOfType.indexOf(blockElement as HTMLElement);

		const textRange = document.createRange();
		textRange.selectNodeContents(blockElement);
		textRange.setEnd(range.startContainer, range.startOffset);
		const startOffset = textRange.toString().length;
		const endOffset = startOffset + range.toString().length;

		selectionData = {
			text: selection.toString(),
			nodeType,
			nodeIndex,
			startOffset,
			endOffset
		};

		const rectRange = range.cloneRange();
		rectRange.collapse(false);
		selectionRect = rectRange.getBoundingClientRect();
		isBranchPopupOpen = true;
	}

	const highlights = $derived.by(() => {
		const branches = globalState.currentBranches;

		return branches
			.filter((branch) => {
				return branch.branch_from_message_id === message.id && branch.selected_text != null;
			})
			.map(
				(branch: Branch): Highlight => ({
					branch_id: branch.id!, // Pass the branch ID for linking
					conversation_id: page.params.id,
					selection_node_type: branch.selection_node_type!,
					selection_node_index: branch.selection_node_index!,
					selection_start_offset: branch.selection_start_offset!,
					selection_end_offset: branch.selection_end_offset!
				})
			);
	});

	const mdInstance = $derived.by(() => {
		const md = MarkdownItAsync();

		// Apply your existing Shiki/code block configuration
		md.use(
			fromAsyncCodeToHtml(codeToHtml, {
				themes: { light: 'vitesse-light', dark: 'vesper' }
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

		// Apply our new highlighter plugin with the specific highlights for this message
		md.use(createHighlighterPlugin(highlights));

		return md;
	});

	$effect(() => {
		if (!selectionData.text) return;
		globalState.currentSelectedText = selectionData.text;
	});

	onMount(() => {
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
	});

	function branchFromSelection() {
		isBranchPopupOpen = false;
		if (!selectionData.text) return;

		chatState.branchFromSelection(message, selectionData);
	}
</script>

<Popover.Root bind:open={isBranchPopupOpen}>
	<Popover.Content
		forceMount
		customAnchor={virtualAnchor}
		side="bottom"
		align="center"
		sideOffset={8}
		onOpenAutoFocus={(e) => e.preventDefault()}
		onInteractOutside={(e) => e.preventDefault()}
	>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						class="z-50"
						transition:fly={{ y: -5, duration: 100, easing: cubicInOut }}
					>
						<button
							class="btn btn-sm btn-primary hover:text-primary-content backdrop-blur-2xl"
							onclick={branchFromSelection}
						>
							<Icon icon="solar:chat-square-arrow-bold-duotone" />
							Ask & Branch from here
						</button>
					</div>
				</div>
			{/if}
		{/snippet}
	</Popover.Content>
</Popover.Root>

<div
	id={message.id}
	class="group"
	bind:this={messageContainer}
	onmouseup={handleSelection}
	onmousedown={() => {
		isBranchPopupOpen = false;
	}}
	role="presentation"
>
	{#if message.role === 'user'}
		<div class="chat chat-end">
			<p
				class="bg-primary/15 border-primary/30 prose max-w-3/4
									self-end rounded-2xl rounded-br-xs border px-4
				py-2"
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
		<div class="chat chat-start message">
			<div class="flex flex-col p-3">
				{#if chatState.isStreaming && chatState.streamingMessage?.id === message.id && chatState.streamingMessage?.content === ''}
					<div><span class="loading-dots loading"></span></div>
				{:else}
					<div
						role="presentation"
						class="prose prose-code:px-0
						prose-a:no-underline"
					>
						{#await (chatState.isStreaming && chatState.streamingMessage?.id === message.id ? mdStreaming : mdInstance).renderAsync(message.content) then markdown}
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
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	:global(mark) {
		border: 1px solid var(--color-primary);
		padding: 1px 2px;
		background-color: color-mix(in oklch, var(--color-primary), transparent 95%);

		border-left-width: 0px;
		border-right-width: 0px;

		color: var(--color-primary);
		transition: all 0.1s ease-in-out;
	}

	:global(mark):hover {
		border: 1px solid var(--color-primary);

		border-left-width: 0px;
		border-right-width: 0px;

		background-color: var(--color-primary);
		color: var(--color-primary-content);
	}
</style>

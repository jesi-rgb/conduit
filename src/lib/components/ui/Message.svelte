<script lang="ts">
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import { globalState } from '../../../stores/stores.svelte';
	import CopyMessage from './CopyMessage.svelte';
	import TooltipExplain from './TooltipExplain.svelte';
	import { onMount, tick } from 'svelte';
	import MarkdownItAsync from 'markdown-it-async';
	import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async';
	import { codeToHtml } from 'shiki';
	import type { ChatStateClass } from '../../../routes/chat/[id]/ChatState.svelte';
	import type { Branch, Message, Highlight } from '$lib/types';
	import { Collapsible, Popover } from 'bits-ui';
	import { fade, fly, slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { createHighlighterPlugin } from '$lib/markdown/highlights'; // Adjust path
	import { popularModels } from '$lib/models';
	import { getShikiHighlighter } from '$lib/shiki/highlighter'; // <-- IMPORT OUR NEW MODULE
	import type { Highlighter } from 'shiki'; // <-- Import the type
	import ConversationView from './ConversationView.svelte';

	const { message, chatState }: { message: Message; chatState: ChatStateClass } = $props();
	const isBranch = $derived(!!page.params.branch);

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

	let shiki: Highlighter | null = $state(null);
	// --- THE KEY: A REACTIVE MAP FOR HIGHLIGHTED CODE ---
	let highlightedCodeBlocks = $state(new Map<string, string>());

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

	const md = MarkdownItAsync({
		// Ensure links are opened in a new tab
		linkify: true,
		html: true // Allow HTML tags in source
	});

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

	function branchFromSelection() {
		isBranchPopupOpen = false;
		if (!selectionData.text) return;

		chatState.branchFromSelection(message, selectionData);
	}

	let wasStreamingMessage = $state(false);

	// --- HELPER FUNCTION TO POPULATE THE MAP ---
	async function highlightAllBlocks() {
		if (!shiki || !messageContainer) return;

		const blocksToHighlight = messageContainer.querySelectorAll(
			'div[data-highlight-pending="true"]'
		);
		if (blocksToHighlight.length === 0) return;

		const newHighlights = new Map(highlightedCodeBlocks);

		for (const wrapper of blocksToHighlight) {
			const pre = wrapper.querySelector('pre');
			const rawCode = pre?.textContent || '';
			const lang = (wrapper as HTMLElement).dataset.language || 'text';

			// Avoid re-highlighting if we already have it
			if (!rawCode || newHighlights.has(rawCode)) continue;

			try {
				const highlightedHtml = shiki.codeToHtml(rawCode, {
					lang,
					themes: { light: 'vitesse-light', dark: 'vesper' }
				});
				newHighlights.set(rawCode, highlightedHtml);
			} catch (e) {
				console.error(`Shiki highlighting failed for lang "${lang}":`, e);
				// Store the plain version so we don't try again
				newHighlights.set(
					rawCode,
					`<pre><code>${shiki.codeToHtml(rawCode, { lang: 'text' })}</code></pre>`
				);
			}
		}
		highlightedCodeBlocks = newHighlights;
	}

	const mdInstance = $derived.by(() => {
		md.use(
			fromAsyncCodeToHtml(codeToHtml, {
				themes: { light: 'vitesse-light', dark: 'vesper' }
			})
		);

		md.use(createHighlighterPlugin(highlights));

		md.renderer.rules.fence = (tokens, idx) => {
			const token = tokens[idx];
			const rawCode = token.content;
			const lang = token.info.trim().split(/\s+/g)[0] || 'text';
			const langBadge = lang !== 'text' ? `<div class="code-lang-badge">${lang}</div>` : '';

			// Check if we ALREADY have the highlighted version in our map
			const highlighted = highlightedCodeBlocks.get(rawCode);
			if (highlighted) {
				// If yes, render it directly!
				return `<div class="code-block-wrapper">${langBadge}${highlighted}</div>`;
			}

			// If not, render a placeholder. The key is the `data-highlight-pending` attribute
			// and the raw code inside the pre tag.
			const escapedCode = md.utils.escapeHtml(rawCode);
			return `<div class="code-block-wrapper" data-highlight-pending="true" data-language="${lang}">${langBadge}<pre><code>${escapedCode}</code></pre></div>`;
		};
		return md;
	});

	onMount(async () => {
		shiki = await getShikiHighlighter();
		if (!chatState.isStreaming || chatState.streamingMessage?.id !== message.id) {
			await highlightAllBlocks();
		}
	});

	$effect(() => {
		if (!selectionData.text) return;
		globalState.currentSelectedText = selectionData.text;
	});

	$effect(() => {
		const isCurrentlyStreamingThisMessage =
			chatState.isStreaming && chatState.streamingMessage?.id === message.id;

		if (wasStreamingMessage && !isCurrentlyStreamingThisMessage) {
			// Use tick() to wait for the DOM to be updated with the final streaming content
			highlightAllBlocks();
		}

		wasStreamingMessage = isCurrentlyStreamingThisMessage;
	});
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
				self-end rounded-2xl rounded-br-xs border px-4 py-2"
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
					{#if message.reasoning}
						<Collapsible.Root class="mb-3 space-y-3">
							<Collapsible.Trigger
								class="btn btn-outline btn-xs btn-primary flex cursor-pointer
								items-center gap-4
								"
							>
								<h4 class="">Thoughts</h4>
								<Icon icon="solar:list-arrow-down-minimalistic-line-duotone" />
							</Collapsible.Trigger>

							<Collapsible.Content
								forceMount
								class="border-subtle prose 
								prose-sm mb-5 rounded-xl border px-3 py-2"
							>
								{#snippet child({ props, open })}
									{#if open}
										<div
											{...props}
											in:fly={{ y: -10, duration: 200 }}
											out:slide={{ duration: 150 }}
										>
											{#await mdInstance.renderAsync(message.reasoning) then markdown}
												{@html markdown}
											{/await}
										</div>
									{/if}
								{/snippet}
							</Collapsible.Content>
						</Collapsible.Root>
					{/if}

					<div role="presentation" class="prose prose-code:px-0">
						{#await mdInstance.renderAsync( message.content, { isStreaming: chatState.isStreaming && chatState.streamingMessage?.id === message.id } ) then markdown}
							{@html markdown}
						{/await}
					</div>

					<div
						class="mt-3 flex h-max items-center gap-4 place-self-start font-mono
										text-xs opacity-0
										transition-opacity duration-100
										group-hover:opacity-100"
					>
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
						<span class="opacity-50">
							{new Date(message.created_at).toLocaleString('es-ES')}
							· {popularModels.find((model) => model.id === message.generated_by)?.name ||
								message.generated_by}
						</span>
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

	:global(a:has(mark)) {
		text-decoration: none;
	}

	:global(#convo-view a:not(:has(mark)))::after {
		text-decoration: none;

		content: ' ↗';
	}

	:global(mark):hover {
		border: 1px solid var(--color-primary);

		border-left-width: 0px;
		border-right-width: 0px;

		background-color: var(--color-primary);
		color: var(--color-primary-content);
	}
	:global(.prose :where(pre.shiki)) {
		color: var(--shiki-light);
		background-color: var(--shiki-light-bg);
		padding: 1em; /* Or whatever padding you prefer */
		margin-top: 1.6em;
		margin-bottom: 1.6em;
		border-radius: 0.5rem; /* Example: match your theme */
		overflow-x: auto;
	}
	:global(.code-lang-badge) {
		font-family: var(--font-mono) !important;
	}
</style>

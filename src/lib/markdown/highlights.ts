import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token';

export interface Highlight {
	branch_id: string;
	conversation_id: string;
	selection_node_type: string;
	selection_node_index: number;
	selection_start_offset: number;
	selection_end_offset: number;
}


const tokenTypeMap: Record<string, string> = {
	paragraph_open: 'P',
	list_item_open: 'LI',
	heading_open: 'H'
};

export function createHighlighterPlugin(highlights: Highlight[]): MarkdownIt.PluginSimple {
	return function(md: MarkdownIt) {

		md.renderer.rules.link_highlight_open = (tokens, idx) => {
			const token = tokens[idx];
			const conversationId = token.attrGet('data-conversation-id');
			const branchId = token.attrGet('data-branch-id');
			const href = `/chat/${conversationId}/${branchId}`;
			return `<a href="${href}" class="highlight-link" data-sveltekit-preload-data="tap">`;
		};
		md.renderer.rules.link_highlight_close = () => '</a>';

		md.renderer.rules.mark_highlight_open = (tokens, idx) => {
			const branchId = tokens[idx].attrGet('data-branch-id');
			return `<mark class="text-selection-highlight" data-highlight-id="${branchId}">`;
		};
		md.renderer.rules.mark_highlight_close = () => '</mark>';


		md.core.ruler.push('node_highlighter', (state) => {
			if (highlights.length === 0) return;

			const nodeCounters: Record<string, number> = {};
			let isInsideList = false;

			for (let i = 0; i < state.tokens.length; i++) {
				const token = state.tokens[i];

				if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') {
					isInsideList = true;
					continue;
				}
				if (token.type === 'bullet_list_close' || token.type === 'ordered_list_close') {
					isInsideList = false;
					continue;
				}

				if (token.type === 'paragraph_open' && isInsideList) {
					continue;
				}

				const nodeType = tokenTypeMap[token.type];
				if (!nodeType) continue;

				const finalNodeType = nodeType === 'H' ? token.tag.toUpperCase() : nodeType;
				nodeCounters[finalNodeType] = (nodeCounters[finalNodeType] || 0) + 1;
				const currentNodeIndex = nodeCounters[finalNodeType] - 1;

				const relevantHighlights = highlights
					.filter(
						(h) =>
							h.selection_node_type === finalNodeType && h.selection_node_index === currentNodeIndex
					)
					.sort((a, b) => a.selection_start_offset - b.selection_start_offset);

				if (relevantHighlights.length === 0) continue;

				let inlineToken: Token | undefined;
				if (token.type === 'list_item_open') {
					inlineToken = state.tokens[i + 2];
				} else {
					inlineToken = state.tokens[i + 1];
				}

				if (inlineToken?.type !== 'inline' || !inlineToken.children) continue;

				let charOffset = 0;
				const newChildren: Token[] = [];

				for (const child of inlineToken.children) {
					const tokenStart = charOffset;
					const tokenEnd = tokenStart + child.content.length;

					if (child.type !== 'text' || child.content.length === 0) {
						newChildren.push(child);
						charOffset = tokenEnd;
						continue;
					}

					let lastIndex = 0;
					for (const highlight of relevantHighlights) {
						const hStart = highlight.selection_start_offset;
						const hEnd = highlight.selection_end_offset;

						if (hEnd <= tokenStart || hStart >= tokenEnd) continue;

						const startInToken = Math.max(0, hStart - tokenStart);
						const endInToken = Math.min(child.content.length, hEnd - tokenStart);

						if (startInToken > lastIndex) {
							const t = new state.Token('text', '', 0);
							t.content = child.content.slice(lastIndex, startInToken);
							newChildren.push(t);
						}

						const linkOpen = new state.Token('link_highlight_open', 'a', 1);
						linkOpen.attrSet('data-conversation-id', highlight.conversation_id);
						linkOpen.attrSet('data-branch-id', highlight.branch_id);
						newChildren.push(linkOpen);

						const markOpen = new state.Token('mark_highlight_open', 'mark', 1);
						markOpen.attrSet('data-branch-id', highlight.branch_id);
						newChildren.push(markOpen);

						const hText = new state.Token('text', '', 0);
						hText.content = child.content.slice(startInToken, endInToken);
						newChildren.push(hText);

						newChildren.push(new state.Token('mark_highlight_close', 'mark', -1));
						newChildren.push(new state.Token('link_highlight_close', 'a', -1));

						lastIndex = endInToken;
					}

					if (lastIndex < child.content.length) {
						const t = new state.Token('text', '', 0);
						t.content = child.content.slice(lastIndex);
						newChildren.push(t);
					}
					charOffset = tokenEnd;
				}
				inlineToken.children = newChildren;
			}
		});

	};
}

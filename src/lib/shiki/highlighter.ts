
// src/lib/highlighter.ts
import { createHighlighter } from 'shiki';
import type { Highlighter } from 'shiki';

// We use a promise here so that we can start the loading process immediately,
// and other parts of the app can await this promise without triggering
// the loading process again.
let highlighterPromise: Promise<Highlighter>;

export async function getShikiHighlighter(): Promise<Highlighter> {
	if (highlighterPromise) {
		return highlighterPromise;
	}

	// Lock the promise so that concurrent calls will wait for the first one to complete.
	highlighterPromise = createHighlighter({
		// Specify the themes and languages you need.
		// This is more efficient than loading all of them.
		themes: ['vitesse-light', 'vesper'],
		langs: [
			'javascript',
			'typescript',
			'html',
			'css',
			'svelte',
			'python',
			'bash',
			'json',
			'markdown', 'rust', 'elixir', 'prisma', 'sql', 'sparql', 'powerquery', 'powershell',
			// Add any other languages you expect to see
		]
	});

	console.log('[Highlighter] Shiki instance is ready.');
	return highlighterPromise;
}

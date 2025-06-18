<script lang="ts">
	import { globalState } from '../../stores/stores.svelte';
	import TextBox from '$lib/components/ui/TextBox.svelte';
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	$effect.pre(() => {
		globalState.currentBranches = [];
		globalState.currentMessages = [];
		globalState.currentSelectedText = null;
	});
	$effect(() => {
		globalState.inputTextBox?.focus();
	});

	const defaultQuestions = [
		{
			question: 'Explain photosynthesis simply.',
			topic: 'science'
		},
		{
			question: 'Who was Marie Skłodowska-Curie?',
			topic: 'science'
		},
		{
			question: 'What is Impressionism?',
			topic: 'art'
		},
		{
			question: 'How does recursion work in programming?',
			topic: 'coding'
		},
		{
			question: 'Summarize the causes of World War I.',
			topic: 'history'
		},
		{
			question: 'Describe the Big Bang theory.',
			topic: 'science'
		},
		{
			question: 'What are the primary colors in art?',
			topic: 'art'
		},
		{
			question: "Give an example of a Python 'for' loop.",
			topic: 'coding'
		},
		{
			question: 'What was the Silk Road?',
			topic: 'history'
		},
		{
			question: 'How do vaccines work?',
			topic: 'science'
		},
		{
			question: 'Who painted the Mona Lisa?',
			topic: 'art'
		},
		{
			question: 'What is an API?',
			topic: 'coding'
		},
		{
			question: 'Briefly explain plate tectonics.',
			topic: 'science'
		},
		{
			question: 'What is Baroque art?',
			topic: 'art'
		},
		{
			question: "What's the purpose of HTML?",
			topic: 'coding'
		},
		{
			question: 'Who invented the light bulb?',
			topic: 'history'
		},
		{
			question: 'What is a black hole?',
			topic: 'science'
		},
		{
			question: 'Define Renaissance art.',
			topic: 'art'
		},
		{
			question: 'What is version control?',
			topic: 'coding'
		},
		{
			question: 'When did the Roman Empire fall?',
			topic: 'history'
		}
	];
	let randomQuestions = $derived.by(() => {
		return defaultQuestions.sort(() => Math.random() - 0.5).slice(0, 7);
	});
	let selectedQuestion = $state('');
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	const user = $derived(globalState.user);
</script>

<svelte:head>
	<title>Conduit</title>
</svelte:head>

<div class="mx-auto flex h-full w-[90%] max-w-[70%] flex-col justify-end gap-10">
	<img
		src="/media/sidebar-empty.webp"
		class="pointer-events-none mx-auto mb-auto max-w-[80%] [mask-image:radial-gradient(ellipse,black,transparent)] pt-10
		opacity-20 invert dark:invert-0"
		alt=""
	/>
	<h1
		class="flex max-w-[70%] shrink items-center gap-3
		justify-self-start px-3 text-xl font-semibold"
	>
		Welcome back, {user?.user_metadata.full_name}

		<Icon icon="solar:star-angle-bold-duotone" class="text-2xl" />
	</h1>
	<div
		class="mx-auto flex h-fit shrink flex-wrap
			justify-start gap-2"
	>
		{#each randomQuestions as question, i}
			<div class="w-fit">
				{#if true}
					<button
						onclick={() => (selectedQuestion = question.question)}
						transition:fly={{ x: -20, duration: 300, delay: i * 2 }}
						data-topic={question.topic}
						class="btn btn-sm btn-ghost data-[topic=science]:btn-primary data-[topic=art]:btn-secondary
							data-[topic=coding]:btn-info data-[topic=history]:btn-accent
							w-fit"
					>
						{question.question}
					</button>
				{/if}
			</div>
		{/each}
	</div>
	<div in:fly={{ y: 20, duration: 200 }}>
		<TextBox {selectedQuestion} />
	</div>
</div>

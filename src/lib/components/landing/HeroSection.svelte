<script lang="ts">
	import { createBlurFade, createWordsFadeIn } from './animations.js';
	import Icon from '@iconify/svelte';

	interface Props {
		loading: boolean;
		user: any;
		onGoogleLogin: () => void;
		onContinueChat: () => void;
	}

	let { loading, user, onGoogleLogin, onContinueChat }: Props = $props();
</script>

<!-- Hero Section -->

<div class="hero bg-base-100 relative min-h-screen overflow-hidden">
	<img
		class="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse,black,transparent)] object-cover
		opacity-80 mix-blend-overlay blur-[2px]"
		src="/media/sidebar-empty.webp"
		alt=""
	/>
	<!-- Subtle animated dots background -->
	<div class="absolute inset-0 opacity-30">
		<div class="dots-pattern"></div>
	</div>

	<div class="hero-content z-10 max-w-5xl">
		<div class="max-w-4xl">
			<!-- Open Source Badge -->
			<div use:createBlurFade={{ delay: 0.1 }} class="mb-8">
				<div
					class="border-primary/20 bg-base-100 inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-medium"
				>
					<Icon icon="solar:code-bold" class="text-primary mr-2" />
					<span class="text-base-content">Free & Open Source</span>
					<span class="text-base-content/30 mx-2">•</span>
					<Icon icon="solar:star-bold" class="text-accent mr-1" />
					<span class="text-base-content">50+ AI Models</span>
				</div>
			</div>

			<!-- Main Heading -->
			<div class="mb-8">
				<h1 use:createBlurFade={{ delay: 0.2 }} class="text-primary mb-4 text-7xl font-bold">
					Conduit
				</h1>
				<div use:createBlurFade={{ delay: 0.4 }}>
					<h2 class="text-base-content mb-6 text-4xl font-medium">
						Chat with AI.
						<span class="font-semibold"><mark>Branch</mark> your conversations.</span>
					</h2>
				</div>
			</div>

			<!-- Description -->
			<div use:createBlurFade={{ delay: 0.6 }}>
				<p class="text-base-content/80 mx-auto mb-12 max-w-3xl text-xl leading-relaxed">
					The first AI chat app that lets you <strong
						><mark>highlight text</mark> to create conversation branches</strong
					>. Explore tangents without losing context. Access 50+ models via OpenRouter with your own
					API key.
				</p>
			</div>

			<!-- CTA Buttons -->
			<div
				use:createBlurFade={{ delay: 0.8 }}
				class="mb-16 flex flex-col justify-start gap-4 sm:flex-row"
			>
				{#if loading}
					<button class="btn btn-primary btn-lg">
						<span class="loading loading-spinner loading-sm"></span>
						Starting your journey...
					</button>
				{:else if user}
					<button class="btn btn-primary btn-lg" onclick={onContinueChat}>
						<Icon icon="solar:chat-round-bold" class="mr-2" />
						Continue Chatting
					</button>
				{:else}
					<button class="btn btn-primary btn-lg" onclick={onGoogleLogin}>
						<Icon icon="solar:login-3-bold" class="mr-2" />
						Start with Google
					</button>
				{/if}
				<button class="btn btn-outline btn-lg border-subtle">
					<Icon icon="solar:book-bookmark-bold-duotone" class="mr-2" />
					View on GitHub
				</button>
			</div>

			<!-- Key Stats -->
			<div
				use:createBlurFade={{ delay: 1 }}
				class="mx-auto grid
				grid-cols-1 gap-6 md:grid-cols-3"
			>
				<div class="stats-item">
					<div class="text-primary text-2xl font-bold">Free</div>
					<div class="text-base-content/70 text-sm">Open Source Forever</div>
				</div>
				<div class="stats-item">
					<div class="text-primary text-2xl font-bold">50+</div>
					<div class="text-base-content/70 text-sm">AI Models Available</div>
				</div>
				<div class="stats-item">
					<div class="text-primary text-2xl font-bold">∞</div>
					<div class="text-base-content/70 text-sm">Conversation Branches</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.dots-pattern {
		background-image: radial-gradient(circle, hsl(var(--p) / 0.1) 1px, transparent 1px);
		background-size: 30px 30px;
		width: 100%;
		height: 100%;
		animation: drift 20s ease-in-out infinite;
	}

	@keyframes drift {
		0%,
		100% {
			transform: translate(0, 0);
		}
		33% {
			transform: translate(10px, -10px);
		}
		66% {
			transform: translate(-10px, 10px);
		}
	}

	.stats-item {
		text-align: center;
		padding: 1rem;
		border-radius: 0.75rem;
		background-color: hsl(var(--b1));
		border: 1px solid hsl(var(--b3));
	}

	mark {
		border: 1px solid var(--color-primary);
		padding: 1px 2px;
		background-color: color-mix(in oklch, var(--color-primary), transparent 95%);

		border-left-width: 0px;
		border-right-width: 0px;

		color: var(--color-primary);
		transition: all 0.1s ease-in-out;
	}
</style>


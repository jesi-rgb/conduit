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

<!-- Final CTA Section -->
<section class="py-20 bg-primary text-primary-content relative overflow-hidden">
	<!-- Subtle animated background -->
	<div class="absolute inset-0 opacity-10">
		<div class="cta-pattern"></div>
	</div>

	<div class="relative z-10 container mx-auto max-w-4xl px-4 text-center">
		<div use:createBlurFade={{ delay: 0.1 }}>
			<h2 use:createWordsFadeIn={{ words: 'Ready to branch your conversations?', delay: 0.1 }} class="text-4xl md:text-5xl font-bold mb-6"></h2>
		</div>
		
		<div use:createBlurFade={{ delay: 0.4 }}>
			<p class="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
				Join thousands of developers, researchers, and curious minds who've discovered the power of branching conversations.
			</p>
		</div>

		<div use:createBlurFade={{ delay: 0.6 }} class="flex flex-col sm:flex-row justify-center gap-6 mb-12">
			{#if loading}
				<button class="btn btn-lg btn-neutral">
					<span class="loading loading-spinner loading-sm"></span>
					Starting your journey...
				</button>
			{:else if user}
				<button class="btn btn-lg btn-neutral" onclick={onContinueChat}>
					<Icon icon="solar:chat-round-bold" class="mr-2" />
					Continue Your Journey
				</button>
			{:else}
				<button class="btn btn-lg btn-neutral" onclick={onGoogleLogin}>
					<Icon icon="solar:login-3-bold" class="mr-2" />
					Start with Google
				</button>
			{/if}
			<button class="btn btn-lg btn-outline btn-neutral">
				<Icon icon="solar:code-bold" class="mr-2" />
				View on GitHub
			</button>
		</div>

		<div use:createBlurFade={{ delay: 0.8 }} class="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg opacity-90">
			<div class="flex items-center justify-center gap-2">
				<Icon icon="solar:star-bold" class="text-accent" />
				<span>No credit card required</span>
			</div>
			<div class="flex items-center justify-center gap-2">
				<Icon icon="solar:key-bold" class="text-accent" />
				<span>Bring your own API key</span>
			</div>
			<div class="flex items-center justify-center gap-2">
				<Icon icon="solar:rocket-bold" class="text-accent" />
				<span>Start branching in seconds</span>
			</div>
		</div>
	</div>
</section>

<style>
	.cta-pattern {
		background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
		background-size: 40px 40px;
		width: 100%;
		height: 100%;
		animation: float 15s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		50% { transform: translateY(-10px) rotate(1deg); }
	}
</style>
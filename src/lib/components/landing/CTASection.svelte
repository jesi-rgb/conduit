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
<section class="bg-primary text-primary-content relative overflow-hidden py-10">
	<!-- Subtle animated background -->

	<div class="mx-auto max-w-4xl px-4 text-center">
		<div use:createBlurFade={{ delay: 0.1 }}>
			<h2
				use:createWordsFadeIn={{ words: 'Ready to branch your conversations?', delay: 0.1 }}
				class="mb-6 text-3xl font-bold"
			></h2>
		</div>

		<div use:createBlurFade={{ delay: 0.6 }} class="flex flex-col justify-center gap-6 sm:flex-row">
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
			<a
				href="https://github.com/jesi-rgb/conduit"
				target="_blank"
				class="btn btn-lg btn-outline border-primary-content/30"
			>
				<Icon icon="solar:code-bold" class="mr-2" />
				View on GitHub
			</a>
		</div>
	</div>
</section>

<style>
	.cta-pattern {
		background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
		background-size: 40px 40px;
		width: 100%;
		height: 100%;
		animation: float 15s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		50% {
			transform: translateY(-10px) rotate(1deg);
		}
	}
</style>


<script lang="ts">
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/client/supabase';
	import type { User } from '@supabase/supabase-js';
	import { globalState } from '../stores/stores.svelte';
	import Icon from '@iconify/svelte';

	let user: User | null = $state(null);
	let loading = $state(false);
	let error = $state();

	async function checkUser() {
		const { data } = await supabase.auth.getUser();
		if (data.user) {
			globalState.user = data.user;
			user = data.user;
		}
		loading = false;
		if (user) goto('/chat');
	}

	async function handleGoogleLogin() {
		loading = true;
		error = '';

		const { data: userData } = await supabase.auth.getUser();
		if (userData.user) {
			goto('/chat');
		}

		try {
			const { error: authError } = await supabase.auth.signInWithOAuth({
				provider: 'google'
			});
			if (authError) throw authError;
		} catch (e: any) {
			console.error('Google login error:', e);
			error = e.message || 'Failed to log in with Google';
			loading = false;
		}
	}

	// Words Fade In Component
	function createWordsFadeIn(node: HTMLElement, { words = '', delay = 0.15 } = {}) {
		const wordElements = words.split(' ').map((word, i) => {
			const span = document.createElement('span');
			span.textContent = word + ' ';
			span.style.opacity = '0';
			span.style.transform = 'translateY(10px)';
			span.style.filter = 'blur(4px)';
			span.style.transition = `all 0.4s ease`;
			span.style.transitionDelay = `${i * delay}s`;
			return span;
		});

		node.innerHTML = '';
		wordElements.forEach((span) => node.appendChild(span));

		setTimeout(() => {
			wordElements.forEach((span) => {
				span.style.opacity = '1';
				span.style.transform = 'translateY(0)';
				span.style.filter = 'blur(0)';
			});
		}, 100);

		return {
			destroy() {
				// cleanup if needed
			}
		};
	}

	// Blur Fade Component
	function createBlurFade(node: HTMLElement, { delay = 0, duration = 0.4 } = {}) {
		node.style.opacity = '0';
		node.style.transform = 'translateY(20px)';
		node.style.filter = 'blur(6px)';
		node.style.transition = `all ${duration}s ease`;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setTimeout(() => {
							node.style.opacity = '1';
							node.style.transform = 'translateY(0)';
							node.style.filter = 'blur(0)';
						}, delay * 1000);
					}
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	onMount(() => {
		checkUser();
	});
</script>

<MetaTags
	title="Conduit | AI conversations and branches"
	titleTemplate="%s | Conduit"
	description="Experience AI conversations like never before. Branch your chats, explore ideas without losing context, and keep your conversations organized."
	canonical="https://conduitchat.app/"
	openGraph={{
		url: 'https://conduitchat.app/',
		title: 'Conduit | Non-Linear AI Conversations',
		description:
			'Experience AI conversations like never before. Branch your chats, explore ideas without losing context, and keep your conversations organized.',
		images: [
			{
				url: 'https://conduitchat.app/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'Conduit - Non-Linear AI Chat App'
			}
		],
		siteName: 'Conduit'
	}}
	twitter={{
		creator: '@jesi_rgb',
		cardType: 'summary_large_image',
		title: 'Conduit | Non-Linear AI Conversations',
		description:
			'Experience AI conversations like never before. Branch your chats, explore ideas without losing context, and keep your conversations organized.'
	}}
/>

<!-- Hero Section with Meteors -->
<div class="hero bg-base-200 bg-boxes relative min-h-screen overflow-hidden">
	<!-- Meteors Background -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="meteor"></div>
		<div class="meteor"></div>
		<div class="meteor"></div>
		<div class="meteor"></div>
		<div class="meteor"></div>
		<div class="meteor"></div>
		<div class="meteor"></div>
		<div class="meteor"></div>
		<div class="meteor"></div>
	</div>

	<!-- Grid Pattern Overlay -->
	<div class="grid-pattern absolute inset-0 opacity-30"></div>

	<div class="hero-content z-10 max-w-4xl text-center">
		<div class="max-w-4xl">
			<!-- Announcement Badge with Shine -->
			<div use:createBlurFade={{ delay: 0.1 }} class="mb-6">
				<div
					class="border-primary/20 shine-bg text-primary inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium"
				>
					<Icon icon="tabler:sparkles" class="mr-2" />
					Now with 50+ AI Models via OpenRouter
				</div>
			</div>

			<!-- Main Heading with Words Fade In -->
			<h1
				use:createWordsFadeIn={{ words: 'Conduit', delay: 0.2 }}
				class="text-primary mb-6 text-7xl font-bold"
			></h1>

			<div use:createBlurFade={{ delay: 0.4 }}>
				<h2 class="text-base-content mb-8 text-3xl font-medium">
					AI conversations that branch like
					<span class="text-primary font-semibold">Git</span>
				</h2>
			</div>

			<div use:createBlurFade={{ delay: 0.6 }}>
				<p class="text-base-content/70 mx-auto mb-12 max-w-2xl text-xl leading-relaxed">
					Select any text to create conversation branches. Explore tangent topics without losing
					your main thread. Keep your AI discussions organized and context-clean.
				</p>
			</div>

			<!-- CTA Buttons -->
			<div
				use:createBlurFade={{ delay: 0.8 }}
				class="mb-12 flex flex-col justify-center gap-4 sm:flex-row"
			>
				{#if loading}
					<button class="btn btn-primary btn-lg loading shimmer"> Starting your journey... </button>
				{:else if user}
					<button class="btn btn-primary btn-lg shimmer" onclick={() => goto('/chat')}>
						<Icon icon="tabler:message-circle" class="mr-2" />
						Continue Chatting
					</button>
				{:else}
					<button class="btn btn-primary btn-lg shimmer" onclick={handleGoogleLogin}>
						<Icon icon="simple-icons:google" class="mr-2" />
						Start with Google
					</button>
				{/if}
				<button class="btn btn-outline btn-lg">
					<Icon icon="tabler:play" class="mr-2" />
					Watch Demo
				</button>
			</div>

			<!-- Stats -->
			<div use:createBlurFade={{ delay: 1 }} class="stats stats-horizontal bg-base-100 shadow-2xl">
				<div class="stat">
					<div class="stat-title">AI Models</div>
					<div class="stat-value text-primary">50+</div>
					<div class="stat-desc">Via OpenRouter</div>
				</div>
				<div class="stat">
					<div class="stat-title">Branches</div>
					<div class="stat-value text-primary">∞</div>
					<div class="stat-desc">Unlimited depth</div>
				</div>
				<div class="stat">
					<div class="stat-title">Context</div>
					<div class="stat-value text-primary">Clean</div>
					<div class="stat-desc">Always organized</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Features Bento Grid -->
<section class="bg-base-100 py-20">
	<div class="container mx-auto max-w-7xl px-4">
		<div class="mb-16 text-center">
			<div
				use:createBlurFade={{ delay: 0.1 }}
				class="border-primary/20 shine-bg text-primary mb-4 inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium"
			>
				FEATURES
			</div>
			<div use:createBlurFade={{ delay: 0.2 }}>
				<h2
					use:createWordsFadeIn={{ words: 'Think like Git, chat like magic', delay: 0.1 }}
					class="mb-6 text-5xl font-bold"
				></h2>
			</div>
			<div use:createBlurFade={{ delay: 0.4 }}>
				<p class="text-base-content/70 mx-auto max-w-3xl text-xl">
					Revolutionary branching technology that transforms how you interact with AI
				</p>
			</div>
		</div>

		<!-- Bento Grid Layout -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			<!-- Large Feature Card -->
			<div
				use:createBlurFade={{ delay: 0.1 }}
				class="card bg-base-200 border-primary/20 float border shadow-xl transition-all duration-300 hover:shadow-2xl lg:col-span-2 lg:row-span-2"
			>
				<div class="card-body">
					<Icon icon="tabler:git-branch" class="text-primary mb-4 text-4xl" />
					<h3 class="mb-4 text-2xl font-bold">Text Selection Branching</h3>
					<p class="text-base-content/70 mb-6">
						Select any text in any message to create a new conversation branch. Explore tangent
						topics without losing your main thread.
					</p>
					<div class="mockup-code bg-base-300">
						<pre data-prefix=">" class="text-primary"><code>Select: "quantum computing"</code></pre>
						<pre data-prefix="→" class="text-primary"><code>Branch created → New context</code
							></pre>
						<pre data-prefix="✓" class="text-accent"><code>Main chat stays clean</code></pre>
					</div>
				</div>
			</div>

			<!-- Timeline Feature -->
			<div
				use:createBlurFade={{ delay: 0.2 }}
				class="card bg-base-200 border-primary/10 hover:border-primary/30 border shadow-xl transition-all duration-300 hover:shadow-2xl"
			>
				<div class="card-body">
					<Icon icon="tabler:timeline" class="text-primary mb-4 text-3xl" />
					<h3 class="mb-2 text-xl font-bold">Visual History</h3>
					<p class="text-base-content/70">Beautiful timeline view of your conversation branches.</p>
				</div>
			</div>

			<!-- Clean Context -->
			<div
				use:createBlurFade={{ delay: 0.3 }}
				class="card bg-base-200 border-primary/10 hover:border-primary/30 border shadow-xl transition-all duration-300 hover:shadow-2xl"
			>
				<div class="card-body">
					<Icon icon="tabler:shield-check" class="text-primary mb-4 text-3xl" />
					<h3 class="mb-2 text-xl font-bold">Clean Context</h3>
					<p class="text-base-content/70">
						Each branch maintains its own context, preventing pollution.
					</p>
				</div>
			</div>

			<!-- OpenRouter Integration -->
			<div
				use:createBlurFade={{ delay: 0.4 }}
				class="card bg-base-200 border-primary/20 border shadow-xl transition-all duration-300 hover:shadow-2xl lg:col-span-2"
			>
				<div class="card-body">
					<Icon icon="tabler:api" class="text-primary mb-4 text-3xl" />
					<h3 class="mb-4 text-xl font-bold">50+ AI Models via OpenRouter</h3>
					<p class="text-base-content/70 mb-4">
						Access the latest AI models: GPT-4, Claude, Gemini, and more. Bring your own API key.
					</p>
					<div class="flex flex-wrap gap-2">
						<div
							class="border-primary/20 shine-bg text-primary inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium"
						>
							GPT-4
						</div>
						<div class="badge badge-primary badge-outline">Claude</div>
						<div class="badge badge-primary badge-outline">Gemini</div>
						<div class="badge badge-primary badge-outline">Llama</div>
						<div class="badge badge-neutral">+46 more</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Simple Cards Section -->
<section class="bg-base-200 py-20">
	<div class="container mx-auto max-w-6xl px-4">
		<div class="mb-16 text-center">
			<div use:createBlurFade={{ delay: 0.1 }}>
				<h2 class="mb-6 text-4xl font-bold">Why developers and researchers love Conduit</h2>
				<p class="text-base-content/70 text-xl">
					Join thousands who've revolutionized their AI conversations
				</p>
			</div>
		</div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			<div
				use:createBlurFade={{ delay: 0.1 }}
				class="card bg-base-100 border-primary/10 hover:border-primary/30 border shadow-xl transition-all duration-300 hover:shadow-2xl"
			>
				<div class="card-body">
					<Icon icon="tabler:brain" class="text-primary mb-4 text-3xl" />
					<h3 class="mb-2 text-xl font-bold">Better Problem Solving</h3>
					<p class="text-base-content/70">
						Explore edge cases and alternatives without derailing your main solution path.
					</p>
				</div>
			</div>

			<div
				use:createBlurFade={{ delay: 0.2 }}
				class="card bg-base-100 border-primary/10 hover:border-primary/30 border shadow-xl transition-all duration-300 hover:shadow-2xl"
			>
				<div class="card-body">
					<Icon icon="tabler:bulb" class="text-primary mb-4 text-3xl" />
					<h3 class="mb-2 text-xl font-bold">Enhanced Learning</h3>
					<p class="text-base-content/70">
						Follow curiosity threads while maintaining structured learning progress.
					</p>
				</div>
			</div>

			<div
				use:createBlurFade={{ delay: 0.3 }}
				class="card bg-base-100 border-primary/10 hover:border-primary/30 border shadow-xl transition-all duration-300 hover:shadow-2xl"
			>
				<div class="card-body">
					<Icon icon="tabler:organization" class="text-primary mb-4 text-3xl" />
					<h3 class="mb-2 text-xl font-bold">Research Organization</h3>
					<p class="text-base-content/70">
						Keep your research conversations organized and easily navigable for future reference.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Testimonials Marquee -->
<section class="bg-base-100 overflow-hidden py-20">
	<div class="container mx-auto mb-12 max-w-6xl px-4 text-center">
		<div use:createBlurFade={{ delay: 0.1 }}>
			<h2 class="mb-6 text-4xl font-bold">Loved by developers and researchers</h2>
			<p class="text-base-content/70 text-xl">
				Join thousands who've revolutionized their AI conversations
			</p>
		</div>
	</div>

	<!-- Marquee Container -->
	<div class="relative overflow-hidden">
		<div class="animate-marquee flex whitespace-nowrap">
			<!-- First set of testimonials -->
			<div class="card bg-base-200 border-primary/10 mx-4 w-80 flex-shrink-0 border shadow-xl">
				<div class="card-body">
					<div class="mb-4 flex items-center gap-3">
						<div class="avatar">
							<div class="w-10 rounded-full">
								<img src="https://avatar.vercel.sh/sarah" alt="Sarah" />
							</div>
						</div>
						<div>
							<div class="font-semibold">Sarah Chen</div>
							<div class="text-primary text-sm">@sarahdev</div>
						</div>
					</div>
					<p>"Conduit changed how I research with AI. The branching feature is genius!"</p>
				</div>
			</div>

			<div class="card bg-base-200 border-primary/10 mx-4 w-80 flex-shrink-0 border shadow-xl">
				<div class="card-body">
					<div class="mb-4 flex items-center gap-3">
						<div class="avatar">
							<div class="w-10 rounded-full">
								<img src="https://avatar.vercel.sh/alex" alt="Alex" />
							</div>
						</div>
						<div>
							<div class="font-semibold">Alex Kumar</div>
							<div class="text-primary text-sm">@alexk</div>
						</div>
					</div>
					<p>"Finally, an AI chat that doesn't get confused by my tangent questions!"</p>
				</div>
			</div>

			<div class="card bg-base-200 border-primary/10 mx-4 w-80 flex-shrink-0 border shadow-xl">
				<div class="card-body">
					<div class="mb-4 flex items-center gap-3">
						<div class="avatar">
							<div class="w-10 rounded-full">
								<img src="https://avatar.vercel.sh/maria" alt="Maria" />
							</div>
						</div>
						<div>
							<div class="font-semibold">Maria Garcia</div>
							<div class="text-primary text-sm">@mariag</div>
						</div>
					</div>
					<p>"The visual timeline makes it so easy to navigate complex conversations."</p>
				</div>
			</div>

			<div class="card bg-base-200 border-primary/10 mx-4 w-80 flex-shrink-0 border shadow-xl">
				<div class="card-body">
					<div class="mb-4 flex items-center gap-3">
						<div class="avatar">
							<div class="w-10 rounded-full">
								<img src="https://avatar.vercel.sh/james" alt="James" />
							</div>
						</div>
						<div>
							<div class="font-semibold">James Wilson</div>
							<div class="text-primary text-sm">@jameswdev</div>
						</div>
					</div>
					<p>"Love the Git-like branching concept. Perfect for my development workflow!"</p>
				</div>
			</div>

			<!-- Duplicate for seamless loop -->
			<div class="card bg-base-200 border-primary/10 mx-4 w-80 flex-shrink-0 border shadow-xl">
				<div class="card-body">
					<div class="mb-4 flex items-center gap-3">
						<div class="avatar">
							<div class="w-10 rounded-full">
								<img src="https://avatar.vercel.sh/sarah" alt="Sarah" />
							</div>
						</div>
						<div>
							<div class="font-semibold">Sarah Chen</div>
							<div class="text-primary text-sm">@sarahdev</div>
						</div>
					</div>
					<p>"Conduit changed how I research with AI. The branching feature is genius!"</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- How It Works -->
<section class="bg-base-200 py-20">
	<div class="container mx-auto max-w-6xl px-4">
		<div class="mb-16 text-center">
			<div use:createBlurFade={{ delay: 0.1 }}>
				<h2 class="mb-6 text-4xl font-bold">How conversation branching works</h2>
				<p class="text-base-content/70 text-xl">
					Three simple steps to revolutionize your AI conversations
				</p>
			</div>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			<div use:createBlurFade={{ delay: 0.1 }} class="group text-center">
				<div
					class="bg-primary text-primary-content shimmer mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold transition-transform duration-300 group-hover:scale-110"
				>
					1
				</div>
				<h3 class="mb-4 text-xl font-semibold">Select Text</h3>
				<p class="text-base-content/70">
					Highlight any text in the AI's response that sparks your curiosity or needs deeper
					exploration.
				</p>
			</div>

			<div use:createBlurFade={{ delay: 0.2 }} class="group text-center">
				<div
					class="bg-primary text-primary-content shimmer mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold transition-transform duration-300 group-hover:scale-110"
				>
					2
				</div>
				<h3 class="mb-4 text-xl font-semibold">Create Branch</h3>
				<p class="text-base-content/70">
					Click the branch button to start a new conversation thread with that selected text as
					context.
				</p>
			</div>

			<div use:createBlurFade={{ delay: 0.3 }} class="group text-center">
				<div
					class="bg-primary text-primary-content shimmer mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold transition-transform duration-300 group-hover:scale-110"
				>
					3
				</div>
				<h3 class="mb-4 text-xl font-semibold">Explore Freely</h3>
				<p class="text-base-content/70">
					Dive deep into tangent topics while keeping your original conversation clean and
					accessible.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Final CTA -->
<section class="bg-primary text-primary-content relative overflow-hidden py-20">
	<!-- Animated background elements -->
	<div class="absolute inset-0">
		<div class="absolute top-1/4 left-1/4 h-4 w-4 animate-ping rounded-full bg-white/20"></div>
		<div class="absolute top-3/4 right-1/4 h-6 w-6 animate-pulse rounded-full bg-white/10"></div>
		<div class="absolute bottom-1/4 left-1/2 h-3 w-3 animate-bounce rounded-full bg-white/30"></div>
	</div>

	<div class="relative z-10 container mx-auto max-w-4xl px-4 text-center">
		<div use:createBlurFade={{ delay: 0.1 }}>
			<h2
				use:createWordsFadeIn={{
					words: 'Ready to revolutionize your AI conversations?',
					delay: 0.1
				}}
				class="mb-6 text-5xl font-bold"
			></h2>
		</div>
		<div use:createBlurFade={{ delay: 0.4 }}>
			<p class="mb-12 text-xl opacity-90">
				Join thousands of developers, researchers, and curious minds who've discovered the power of
				branching conversations.
			</p>
		</div>

		<div
			use:createBlurFade={{ delay: 0.6 }}
			class="mx-auto flex max-w-md flex-col justify-center gap-6 sm:flex-row"
		>
			{#if loading}
				<button class="btn btn-lg btn-neutral loading shimmer"> Starting your journey... </button>
			{:else if user}
				<button class="btn btn-lg btn-neutral shimmer" onclick={() => goto('/chat')}>
					<Icon icon="tabler:message-circle" class="mr-2" />
					Continue Your Journey
				</button>
			{:else}
				<button class="btn btn-lg btn-neutral shimmer" onclick={handleGoogleLogin}>
					<Icon icon="simple-icons:google" class="mr-2" />
					Start with Google
				</button>
			{/if}
		</div>

		<div use:createBlurFade={{ delay: 0.8 }} class="mt-12 text-lg opacity-75">
			✨ No credit card required • 🔑 Bring your own API key • 🚀 Start branching in seconds
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="footer footer-center bg-base-200 text-base-content p-10">
	<aside>
		<h3 class="text-primary text-2xl font-bold">Conduit</h3>
		<p class="max-w-md">
			Experience AI conversations like never before with branching technology that keeps your
			discussions organized and your context clean.
		</p>
		<p class="text-sm opacity-70">© 2025 Conduit. Built with 💜 for better conversations.</p>
	</aside>
	<nav>
		<div class="grid grid-flow-col gap-4">
			<a
				href="https://twitter.com/jesi_rgb"
				class="link link-hover hover:text-primary transition-colors"
			>
				<Icon icon="simple-icons:twitter" class="text-xl" />
			</a>
			<a href="https://github.com" class="link link-hover hover:text-primary transition-colors">
				<Icon icon="simple-icons:github" class="text-xl" />
			</a>
			<a
				href="mailto:hello@conduitchat.app"
				class="link link-hover hover:text-primary transition-colors"
			>
				<Icon icon="tabler:mail" class="text-xl" />
			</a>
		</div>
	</nav>
</footer>

<style>
	/* Meteors animation */
	@keyframes meteor {
		0% {
			transform: translateY(-100vh) translateX(-50px);
			opacity: 1;
		}
		100% {
			transform: translateY(100vh) translateX(50px);
			opacity: 0;
		}
	}

	.meteor {
		position: absolute;
		width: 2px;
		height: 80px;
		background: linear-gradient(to bottom, transparent, hsl(var(--p)), transparent);
		animation: meteor 3s linear infinite;
		opacity: 0.6;
	}

	.meteor:nth-child(1) {
		left: 10%;
		animation-delay: 0s;
	}
	.meteor:nth-child(2) {
		left: 20%;
		animation-delay: 0.5s;
	}
	.meteor:nth-child(3) {
		left: 30%;
		animation-delay: 1s;
	}
	.meteor:nth-child(4) {
		left: 40%;
		animation-delay: 1.5s;
	}
	.meteor:nth-child(5) {
		left: 50%;
		animation-delay: 2s;
	}
	.meteor:nth-child(6) {
		left: 60%;
		animation-delay: 2.5s;
	}
	.meteor:nth-child(7) {
		left: 70%;
		animation-delay: 0.3s;
	}
	.meteor:nth-child(8) {
		left: 80%;
		animation-delay: 0.8s;
	}
	.meteor:nth-child(9) {
		left: 90%;
		animation-delay: 1.3s;
	}

	/* Shimmer effect */
	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.shimmer {
		position: relative;
		overflow: hidden;
	}

	.shimmer::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transform: translateX(-100%);
		animation: shimmer 2s infinite;
	}

	/* Background shine animation */
	@keyframes shine {
		from {
			background-position: 0 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	.shine-bg {
		background: linear-gradient(
			110deg,
			hsl(var(--b1)),
			45%,
			hsl(var(--p) / 0.1),
			55%,
			hsl(var(--b1))
		);
		background-size: 200% 100%;
		animation: shine 2s linear infinite;
	}

	/* Floating animation */
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.float {
		animation: float 3s ease-in-out infinite;
	}

	/* Grid pattern background */
	.grid-pattern {
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
		background-size: 50px 50px;
	}

	/* Marquee animation */
	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-100%);
		}
	}

	.marquee {
		animation: marquee 20s linear infinite;
	}

	/* Background boxes */
	.bg-boxes {
		background-image:
			radial-gradient(circle at 25% 25%, hsl(var(--p) / 0.1) 0%, transparent 50%),
			radial-gradient(circle at 75% 75%, hsl(var(--p) / 0.05) 0%, transparent 50%);
		background-size: 100px 100px;
		background-position:
			0 0,
			50px 50px;
	}
</style>

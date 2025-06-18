<script lang="ts">
	import { createBlurFade } from './animations.js';
	import Icon from '@iconify/svelte';
</script>

<!-- Main Features Section -->
<section class="bg-base-100 py-20">
	<div class="container mx-auto max-w-6xl px-4">
		<!-- Section Header -->
		<div class="mb-16 text-center">
			<div use:createBlurFade={{ delay: 0.2 }}>
				<h2 class="text-base-content mb-6 text-4xl font-bold md:text-5xl">
					Conversations are rarely linear
				</h2>
				<div class="flex flex-col gap-6">
					<p class="text-base-content/80 mx-auto max-w-3xl text-xl">
						Do you need clarificaiton on some topic or term?
					</p>
					<p class="text-2xl">
						Just
						<mark>highlight it</mark> and ask
					</p>
				</div>
			</div>
		</div>

		<!-- Main Features Grid -->
		<div class="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Branching Feature - Large -->
			<div use:createBlurFade={{ delay: 0.1 }} class="lg:col-span-2">
				<div class="card bg-base-100 border-primary/20 border transition-all duration-300">
					<div class="card-body p-8">
						<div class="flex items-start gap-6">
							<div class="flex-shrink-0">
								<div class="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
									<Icon icon="solar:chat-square-arrow-bold-duotone" class="text-primary text-3xl" />
								</div>
							</div>
							<div class="flex-1">
								<h3 class="text-base-content mb-4 text-2xl font-bold">Text Selection Branching</h3>
								<p class="text-base-content/80 mb-6 text-lg leading-relaxed">
									Highlight any text in any message to create a new conversation branch. Explore
									tangent topics without losing your main thread. Each branch maintains its own
									clean context.
								</p>
								<div class="mockup-code bg-base-200 text-sm">
									<pre class="text-primary"><code>█ Select: "quantum computing"</code></pre>
									<pre class="text-primary"><code>→ Branch created</code></pre>
									<pre class="text-accent"><code>✓ Main chat stays clean</code></pre>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- OpenRouter Integration -->
			<div use:createBlurFade={{ delay: 0.2 }}>
				<div
					class="card bg-base-100 border-primary/10 h-full border
					transition-all duration-300"
				>
					<div class="card-body p-6">
						<div class="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
							<Icon icon="solar:server-path-bold" class="text-primary text-2xl" />
						</div>
						<h3 class="text-base-content mb-3 text-xl font-bold">50+ AI Models</h3>
						<p
							class="text-base-content/80 mb-4 leading-relaxed
							text-balance"
						>
							Access the latest AI models through OpenRouter: GPT-4, Claude, Gemini, Llama, and
							more. Bring your own API key for complete control.
						</p>
						<div class="flex flex-wrap gap-2">
							<div class="badge badge-primary badge-outline">GPT-4</div>
							<div class="badge badge-primary badge-outline">Claude</div>
							<div class="badge badge-primary badge-outline">Gemini</div>
							<div class="badge badge-neutral">+47 more</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Open Source -->
			<div use:createBlurFade={{ delay: 0.3 }}>
				<div
					class="card bg-base-100 border-primary/10 h-full border shadow-xl transition-all duration-300 hover:shadow-2xl"
				>
					<div class="card-body p-6">
						<div class="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
							<Icon icon="solar:code-bold" class="text-primary text-2xl" />
						</div>
						<h3 class="text-base-content mb-3 text-xl font-bold">Free & Open Source</h3>
						<p
							class="text-base-content/80 mb-4 leading-relaxed
							text-balance"
						>
							Completely free to use forever. View the source code, contribute features, or
							self-host your own instance. Your data, your control.
						</p>
						<div class="text-base-content/70 flex items-center text-sm">
							<Icon icon="solar:star-bold" class="text-accent mr-1" />
							<span>MIT License</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Additional Features -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<div use:createBlurFade={{ delay: 0.4 }}>
				<div class="bg-base-100 border-primary/10 rounded-xl border p-6 text-center">
					<div
						class="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
					>
						<Icon icon="solar:history-bold" class="text-primary text-xl" />
					</div>
					<h4 class="text-base-content mb-2 font-semibold">Visual Timeline</h4>
					<p class="text-base-content/70 text-sm text-balance">
						Beautiful timeline view of your conversation branches
					</p>
				</div>
			</div>

			<div use:createBlurFade={{ delay: 0.5 }}>
				<div class="bg-base-100 border-primary/10 rounded-xl border p-6 text-center">
					<div
						class="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
					>
						<Icon icon="solar:shield-check-bold" class="text-primary text-xl" />
					</div>
					<h4 class="text-base-content mb-2 font-semibold">Clean Context</h4>
					<p class="text-base-content/70 text-sm text-balance">
						Each branch maintains separate context, preventing context pollution
					</p>
				</div>
			</div>

			<div use:createBlurFade={{ delay: 0.6 }}>
				<div class="bg-base-100 border-primary/10 rounded-xl border p-6 text-center">
					<div
						class="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
					>
						<Icon icon="solar:key-square-bold" class="text-primary text-xl" />
					</div>
					<h4 class="text-base-content mb-2 font-semibold">Your API Key</h4>
					<p class="text-base-content/70 text-sm text-balance">
						Bring your own OpenRouter key and enjoy the myriad of models available
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<script lang="ts">
	import { createBlurFade } from './animations.js';
	import Icon from '@iconify/svelte';
</script>

<!-- How It Works Section -->
<section class="py-20 bg-base-200">
	<div class="container mx-auto max-w-6xl px-4">
		<div class="text-center mb-16">
			<div use:createBlurFade={{ delay: 0.1 }}>
				<h2 class="text-4xl font-bold text-base-content mb-6">
					How conversation branching works
				</h2>
				<p class="text-xl text-base-content/80">
					Three simple steps to revolutionize your AI conversations
				</p>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
			<div use:createBlurFade={{ delay: 0.1 }} class="text-center group">
				<div class="w-20 h-20 rounded-full bg-primary text-primary-content mx-auto mb-6 flex items-center justify-center text-3xl font-bold transition-transform duration-300 group-hover:scale-110">
					1
				</div>
				<h3 class="text-xl font-semibold text-base-content mb-4">Select Text</h3>
				<p class="text-base-content/80">
					Highlight any text in the AI's response that sparks your curiosity or needs deeper exploration.
				</p>
			</div>

			<div use:createBlurFade={{ delay: 0.2 }} class="text-center group">
				<div class="w-20 h-20 rounded-full bg-primary text-primary-content mx-auto mb-6 flex items-center justify-center text-3xl font-bold transition-transform duration-300 group-hover:scale-110">
					2
				</div>
				<h3 class="text-xl font-semibold text-base-content mb-4">Create Branch</h3>
				<p class="text-base-content/80">
					Click the branch button to start a new conversation thread with that selected text as context.
				</p>
			</div>

			<div use:createBlurFade={{ delay: 0.3 }} class="text-center group">
				<div class="w-20 h-20 rounded-full bg-primary text-primary-content mx-auto mb-6 flex items-center justify-center text-3xl font-bold transition-transform duration-300 group-hover:scale-110">
					3
				</div>
				<h3 class="text-xl font-semibold text-base-content mb-4">Explore Freely</h3>
				<p class="text-base-content/80">
					Dive deep into tangent topics while keeping your original conversation clean and accessible.
				</p>
			</div>
		</div>

		<!-- Visual Example -->
		<div use:createBlurFade={{ delay: 0.4 }} class="max-w-4xl mx-auto">
			<div class="card bg-base-100 border border-primary/20 shadow-2xl">
				<div class="card-body p-8">
					<div class="flex items-center gap-3 mb-6">
						<Icon icon="solar:branch-bold" class="text-2xl text-primary" />
						<h3 class="text-xl font-semibold">Example: Research Workflow</h3>
					</div>
					
					<div class="space-y-4">
						<!-- Main conversation -->
						<div class="bg-base-200 rounded-lg p-4">
							<div class="flex items-start gap-3">
								<Icon icon="solar:user-bold" class="text-lg mt-1 text-primary" />
								<div>
									<p class="text-base-content">Explain machine learning algorithms</p>
								</div>
							</div>
						</div>
						
						<div class="bg-primary/5 rounded-lg p-4">
							<div class="flex items-start gap-3">
								<Icon icon="solar:chat-round-bold" class="text-lg mt-1 text-primary" />
								<div>
									<p class="text-base-content">Machine learning uses algorithms like <span class="bg-accent/20 px-1 rounded">neural networks</span>, decision trees, and <span class="bg-accent/20 px-1 rounded">random forests</span> to find patterns in data...</p>
								</div>
							</div>
						</div>

						<!-- Branch indicator -->
						<div class="flex items-center gap-2 text-sm text-primary">
							<Icon icon="solar:arrow-right-up-bold" />
							<span>Selected "neural networks" → New branch created</span>
						</div>
						
						<!-- Branch conversation -->
						<div class="bg-base-200 rounded-lg p-4 ml-8 border-l-4 border-primary">
							<div class="flex items-start gap-3">
								<Icon icon="solar:branch-bold" class="text-lg mt-1 text-primary" />
								<div>
									<p class="text-base-content text-sm">🌿 <strong>Branch:</strong> Tell me more about neural networks specifically</p>
									<p class="text-base-content/70 text-sm mt-2">AI responds with detailed neural network explanation...</p>
								</div>
							</div>
						</div>
					</div>

					<div class="mt-6 text-center text-sm text-base-content/70">
						Main conversation context stays clean while you explore tangents
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
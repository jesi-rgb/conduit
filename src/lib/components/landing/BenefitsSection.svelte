<script lang="ts">
	import { createBlurFade } from './animations.js';
	import Icon from '@iconify/svelte';

	const benefits = [
		{
			icon: 'solar:brain-bold',
			title: 'Better Problem Solving',
			description: 'Explore edge cases and alternatives without derailing your main solution path.'
		},
		{
			icon: 'solar:lightbulb-bold',
			title: 'Enhanced Learning',
			description: 'Follow curiosity threads while maintaining structured learning progress.'
		},
		{
			icon: 'solar:document-text-bold',
			title: 'Research Organization',
			description: 'Keep your research conversations organized and easily navigable for future reference.'
		},
		{
			icon: 'solar:settings-bold',
			title: 'Complete Control',
			description: 'Self-host, customize, or contribute. Open source means you own your experience.'
		},
		{
			icon: 'solar:shield-user-bold',
			title: 'Privacy First',
			description: 'Your API key, your data. We never see your conversations or store your information.'
		},
		{
			icon: 'solar:money-bag-bold',
			title: 'Cost Effective',
			description: 'Pay only for what you use. No subscriptions, no markup. Direct API pricing.'
		}
	];
</script>

<!-- Benefits Section -->
<section class="py-20 bg-base-100">
	<div class="container mx-auto max-w-6xl px-4">
		<div class="text-center mb-16">
			<div use:createBlurFade={{ delay: 0.1 }}>
				<h2 class="text-4xl font-bold text-base-content mb-6">
					Why developers and researchers choose Conduit
				</h2>
				<p class="text-xl text-base-content/80 max-w-3xl mx-auto">
					Join thousands who've revolutionized their AI conversations with branching technology
				</p>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each benefits as benefit, index}
				<div use:createBlurFade={{ delay: 0.1 * (index + 1) }}>
					<div class="card bg-base-200 border border-primary/10 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300 h-full">
						<div class="card-body p-6">
							<div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
								<Icon icon={benefit.icon} class="text-2xl text-primary" />
							</div>
							<h3 class="text-xl font-semibold text-base-content mb-3">
								{benefit.title}
							</h3>
							<p class="text-base-content/80 leading-relaxed">
								{benefit.description}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Stats Row -->
		<div use:createBlurFade={{ delay: 0.8 }} class="mt-16">
			<div class="stats stats-horizontal shadow-xl bg-base-200 w-full">
				<div class="stat text-center">
					<div class="stat-title">Lines of Code</div>
					<div class="stat-value text-primary">Open</div>
					<div class="stat-desc">Fully transparent</div>
				</div>
				<div class="stat text-center">
					<div class="stat-title">Monthly Cost</div>
					<div class="stat-value text-primary">$0</div>
					<div class="stat-desc">Forever free to use</div>
				</div>
				<div class="stat text-center">
					<div class="stat-title">Data Collection</div>
					<div class="stat-value text-primary">None</div>
					<div class="stat-desc">Your privacy matters</div>
				</div>
				<div class="stat text-center">
					<div class="stat-title">API Models</div>
					<div class="stat-value text-primary">50+</div>
					<div class="stat-desc">Via OpenRouter</div>
				</div>
			</div>
		</div>
	</div>
</section>
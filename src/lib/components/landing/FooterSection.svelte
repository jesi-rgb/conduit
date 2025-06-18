<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<!-- Footer -->
<footer class="footer footer-center bg-base-200 text-base-content p-10">
	<aside class="max-w-2xl">
		<div class="flex items-center gap-2 mb-4">
			<Icon icon="solar:branch-bold" class="text-2xl text-primary" />
			<h3 class="text-primary text-2xl font-bold">Conduit</h3>
		</div>
		<p class="text-base-content/80 leading-relaxed">
			The first AI chat app with conversation branching. Explore ideas without losing context, 
			access 50+ AI models, and keep your conversations organized.
		</p>
		<div class="mt-4 text-sm text-base-content/60">
			Free & Open Source • Built with ❤️ for better conversations
		</div>
	</aside>
	
	<nav class="mt-6">
		<div class="grid grid-flow-col gap-6">
			<a href="https://github.com/your-repo" class="link link-hover hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
				<Icon icon="solar:code-bold" class="text-xl" />
				<span class="sr-only">GitHub</span>
			</a>
			<a href="https://twitter.com/jesi_rgb" class="link link-hover hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
				<Icon icon="solar:chat-round-line-bold" class="text-xl" />
				<span class="sr-only">Twitter</span>
			</a>
			<a href="mailto:hello@conduitchat.app" class="link link-hover hover:text-primary transition-colors">
				<Icon icon="solar:letter-bold" class="text-xl" />
				<span class="sr-only">Email</span>
			</a>
		</div>
	</nav>
</footer>
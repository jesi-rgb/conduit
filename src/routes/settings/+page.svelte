<script>
	import InputKey from '$lib/components/ui/InputKey.svelte';
</script>

<main class="mx-auto my-20 max-w-2xl">
	<a class="btn btn-ghost" href="/chat">← Back</a>
	<h1 class="mb-10 text-3xl font-bold">Settings</h1>

	<section class="keys border-subtle flex flex-col gap-4">
		<div class="mb-2 flex flex-col gap-1">
			<h2 class="text-2xl font-semibold">Keys</h2>
			<p class="text-muted">
				Input your OpenRouter keys here. They won't be sent to DB, just in local storage.
			</p>
		</div>
		<InputKey
			validateKey={(key) => {
				console.log(key.startsWith('sk-or'));
				return key.startsWith('sk-or');
			}}
			label="Open Router Key"
			icon="solar:branching-paths-up-bold"
		/>
	</section>
</main>

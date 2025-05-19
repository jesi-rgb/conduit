<script>
	const fakeConvs = Array.from({ length: 20 }, (_, i) => i + 1);

	console.log(fakeConvs);
</script>

{#each fakeConvs as conv}
	<div class="flex items-center gap-2">
		<div>{conv}</div>
	</div>
{/each}

<script>
	const fakeConvs = Array.from({ length: 20 }, (_, i) => i + 1);

	console.log(fakeConvs);
</script>

<section
	class="border-base-content/10 bg-base-200 flex w-1/5 flex-col justify-between gap-10 border p-3
	shadow-lg"
>
	<div class="border-red flex flex-col">
		{#each fakeConvs as conv}
			<div class="flex items-center gap-2">
				<p class="">Branch {conv}</p>
			</div>
		{/each}
	</div>
</section>

<script>
	import { page } from '$app/state';
</script>

<main class="p-3">
	<div class="breadcrumbs text-sm">
		<ul>
			<li><a href="/chat">Home</a></li>
			<li><a href="/chat/{page.params.id}">Chat</a></li>
			<li>Branch {page.params.branch}</li>
		</ul>
	</div>
</main>

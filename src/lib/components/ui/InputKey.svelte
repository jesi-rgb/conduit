<script>
	import Icon from '@iconify/svelte';

	let { label, icon, keyInput = $bindable(''), disabled = false } = $props();
</script>

<div class="w-full">
	<label class="input join-item w-full">
		<Icon class="text-2xl" {icon} />
		<input
			type="password"
			class="w-full"
			placeholder={label}
			{disabled}
			bind:value={keyInput}
			required
		/>
	</label>
	<div class="validator-hint hidden">Enter valid email address</div>
</div>

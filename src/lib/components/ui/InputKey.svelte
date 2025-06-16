<script lang="ts">
	import Icon from '@iconify/svelte';
	import TooltipExplain from './TooltipExplain.svelte';
	import { globalState } from '../../../stores/stores.svelte';
	import { CONDUIT_OPEN_ROUTER_KEY } from '$lib/types';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let {
		label,
		icon,
		keyInput = $bindable(''),
		disabled = false,
		validateKey = () => {
			return false;
		}
	} = $props();

	onMount(() => {
		if (localStorage.getItem(CONDUIT_OPEN_ROUTER_KEY)) {
			keyInput = localStorage.getItem(CONDUIT_OPEN_ROUTER_KEY)!;
		}
	});

	$effect(() => {
		if (keyInput && validateKey(keyInput)) {
			globalState.updateUserKeys(CONDUIT_OPEN_ROUTER_KEY, keyInput);
		} else globalState.updateUserKeys(CONDUIT_OPEN_ROUTER_KEY, '');
	});
</script>

<TooltipExplain disabled={true}>
	<div class="w-full">
		<fieldset class="fieldset">
			<label
				class={'input join-item w-full' +
					(!validateKey(keyInput) ? ' input-error input-dashed' : '')}
			>
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
			<div class="flex w-full justify-between px-3">
				<p class="label">
					Head to <a
						class="text-primary font-semibold underline"
						href="https://openrouter.ai/settings/keys">openrouter/keys</a
					> to generate one!
				</p>
				{#if !validateKey(keyInput) && keyInput != ''}
					{#if !validateKey(keyInput)}
						<p transition:fly={{ x: 5, duration: 200 }} class="text-error label">
							Invalid key. Key must start with <code>sk-or</code>
						</p>
					{/if}
				{:else if validateKey(keyInput)}
					<p class="label text-primary flex items-center gap-1">
						Key set and stored successfully <Icon icon="solar:check-circle-line-duotone" />
					</p>
				{/if}
			</div>
		</fieldset>
	</div>
	{#snippet content()}
		{#if !validateKey(keyInput)}
			<p class="text-error text-base">Invalid key. Key must start with <code>sk-or</code></p>
		{/if}
	{/snippet}
</TooltipExplain>

<style>
	.error {
		border-color: var(--color-error);
	}
</style>

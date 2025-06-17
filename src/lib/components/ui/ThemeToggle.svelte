<script lang="ts">
	import Icon from '@iconify/svelte';
	import TooltipExplain from './TooltipExplain.svelte';
	import { globalState } from '../../../stores/stores.svelte';
	import { onMount } from 'svelte';

	const applyTheme = (newTheme: string) => {
		globalState.theme = newTheme;
		if (newTheme === 'system') {
			const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'barelycookie'
				: 'reallol';
			document.documentElement.setAttribute('data-theme', systemPreference);
		} else {
			document.documentElement.setAttribute('data-theme', newTheme);
		}
	};

	const toggleTheme = () => {
		if (globalState.theme === 'reallol') {
			applyTheme('barelycookie');
		} else {
			applyTheme('reallol');
		}
	};

	onMount(() => {
		if (globalState.theme) {
			applyTheme(globalState.theme);
		}
	});
</script>

<TooltipExplain>
	<label
		class="swap swap-rotate btn btn-xs border-subtle text-base-content/20
		hover:text-primary
		text-lg"
	>
		<input type="checkbox" value="reallol" class="" onclick={toggleTheme} />

		<!-- sun icon -->
		<Icon icon="solar:sun-2-bold-duotone" class="swap-off" />

		<!-- moon icon -->
		<Icon icon="solar:star-fall-bold-duotone" class="swap-on" />
	</label>

	{#snippet content()}
		Toggle Theme
	{/snippet}
</TooltipExplain>

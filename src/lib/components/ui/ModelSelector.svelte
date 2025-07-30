<script lang="ts">
	import { popularModels } from '$lib/models';
	import Icon from '@iconify/svelte';
	import { Combobox } from 'bits-ui';
	import type { ModelInfo } from '$lib/models';
	import { fly } from 'svelte/transition';
	import { globalState } from '../../../stores/stores.svelte';
	import { onMount } from 'svelte';
	import TooltipExplain from './TooltipExplain.svelte';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { CONDUIT_OPEN_ROUTER_KEY, FALLBACK_MODEL } from '$lib/types';

	let searchValue = $state('');
	let inputElement: HTMLInputElement | null = $state(null);

	// Check if user is using fallback model
	const isUsingFallback = $derived(() => {
		const userApiKey = localStorage?.getItem(CONDUIT_OPEN_ROUTER_KEY);
		return !userApiKey;
	});

	let providerIcons = {
		Anthropic: 'simple-icons:anthropic',
		DeepSeek: 'fluent-emoji-high-contrast:whale',
		Google: 'simple-icons:google',
		Meta: 'simple-icons:meta',
		Mistral: 'logos:mistral-ai-icon',
		MoonshotAI: 'solar:moon-bold',
		OpenAI: 'ri:openai-line',
		OpenRouter: 'solar:branching-paths-up-bold',
		'Z.AI': 'solar:cpu-bolt-bold'
	};

	// Group models by provider
	const groupedModels = $derived.by(() => {
		// Get unique providers
		const providers = [...new Set(popularModels.map((model: ModelInfo) => model.provider))].sort();

		// Create grouped structure
		const grouped = providers.map((provider) => ({
			provider,
			models: popularModels.filter((model: ModelInfo) => model.provider === provider)
		}));

		return grouped;
	});

	// Filter models while maintaining the grouping structure
	const filteredGroupedModels = $derived.by(() => {
		if (searchValue === '') {
			return groupedModels;
		}

		return groupedModels
			.map((group: { provider: string; models: ModelInfo[] }) => ({
				provider: group.provider,
				models: group.models.filter(
					(model: ModelInfo) =>
						model.name.toLowerCase().includes(searchValue.toLowerCase()) ||
						model.provider.toLowerCase().includes(searchValue.toLowerCase())
				)
			}))
			.filter((group: { provider: string; models: ModelInfo[] }) => group.models.length > 0);
	});

	let selectedModel: { value: string; label: string } | undefined = $state(undefined);

	onMount(() => {
		const currentModelId = globalState.modelIdSelected;
		const storedModel: ModelInfo = popularModels.find((model) => model.id === currentModelId)!;

		if (storedModel) {
			selectedModel = { value: storedModel.id, label: storedModel.name };
		} else {
			// Fallback to Kimi if model not found
			const model = popularModels.find((model) => model.id === FALLBACK_MODEL)!;
			selectedModel = { value: model.id, label: model.name };
		}
	});
</script>

{#if selectedModel}
	<Combobox.Root
		type="single"
		allowDeselect={false}
		name="model"
		items={popularModels.map((model) => {
			return {
				value: model.id,
				label: model.name,
				disabled: isUsingFallback() && !model.free
			};
		})}
		bind:value={selectedModel!.value}
		onValueChange={(newSelection: string) => {
			globalState.modelIdSelected = newSelection;
		}}
		onOpenChange={(o) => {
			if (!o) searchValue = '';
			inputElement?.select();
		}}
	>
		<div class="relative w-fit">
			{#if isUsingFallback()}
				<div class="absolute -top-2 -left-2 z-10">
					<TooltipExplain>
						<div class="badge badge-primary badge-xs">FREE</div>
						{#snippet content()}
							Using free models. Add your API key to use other models.
						{/snippet}
					</TooltipExplain>
				</div>
			{/if}
			<Combobox.Input
				oninput={(e) => (searchValue = e.currentTarget.value)}
				bind:ref={inputElement}
				class="border-subtle rounded-box h-full min-h-[40px] min-w-60 border px-3 text-xs {isUsingFallback()
					? 'border-primary'
					: ''}"
				placeholder={selectedModel.label}
				aria-label="Select a model"
				defaultValue={selectedModel.label}
			/>
			<Combobox.Trigger class="btn btn-xs absolute top-1/2 right-2 -translate-y-1/2">
				<TooltipExplain>
					<Icon icon="solar:maximize-bold-duotone" />
					{#snippet content()}
						Select a different model
					{/snippet}
				</TooltipExplain>
			</Combobox.Trigger>
		</div>
		<Combobox.Portal>
			<Combobox.Content
				forceMount
				align="start"
				class="border-subtle from-base-100 to-base-200 shadow-popover data-[state=open]:animate-in z-50
			h-96 w-100 rounded-xl border bg-gradient-to-b px-1 py-1
			outline-hidden select-none data-[side=bottom]:translate-y-1
			data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
				sideOffset={10}
			>
				{#snippet child({ wrapperProps, props, open })}
					{#if open}
						<div {...wrapperProps}>
							<div {...props} transition:fly={{ y: 20, duration: 200, easing: cubicOut }}>
								<Combobox.Viewport class="p-1">
									{#each filteredGroupedModels as group}
										<Combobox.Group>
											<!-- Provider group header -->
											<Combobox.GroupHeading
												class="text-muted-foreground mb-1 flex items-center
							gap-2 px-2 py-1 text-sm font-semibold uppercase"
											>
												<Icon class="" icon={providerIcons[group.provider]} />
												{group.provider}
											</Combobox.GroupHeading>

											<!-- Models in this provider group -->
											{#each group.models as model (model.id)}
												{@const isDisabled = isUsingFallback() && !model.free}
												<Combobox.Item
													class="data-highlighted:bg-base-300/30 ring-subtle my-1 flex h-10 w-full
								items-center rounded-xl px-3 py-2 text-sm capitalize outline-hidden
								select-none data-highlighted:shadow-sm data-highlighted:ring dark:data-highlighted:shadow-xl
								{isDisabled ? 'cursor-not-allowed opacity-50' : ''}"
													value={model.id}
													label={model.name}
													disabled={isDisabled}
												>
													{#snippet children({ selected })}
														<div class="flex w-full flex-col">
															<span class="flex items-center gap-2 truncate">
																{model.name}
																{#if model.free}
																	<span class="badge badge-primary badge-xs">FREE</span>
																{:else if isUsingFallback()}
																	<span class="badge badge-ghost badge-xs">API KEY REQUIRED</span>
																{/if}
															</span>
															<span class="text-muted w-11/12 truncate text-xs">
																{model.description}
															</span>
														</div>
														{#if selected}
															<div class="ml-auto">
																<Icon
																	class="text-primary text-2xl"
																	icon="solar:check-circle-bold-duotone"
																/>
															</div>
														{/if}
													{/snippet}
												</Combobox.Item>
											{/each}

											<!-- Add a separator between provider groups -->
											{#if group !== filteredGroupedModels[filteredGroupedModels.length - 1]}
												<div class="divider my-1"></div>
											{/if}
										</Combobox.Group>
									{:else}
										<div
											class="h-full border border-subtle shadow-sm
							shadow-base-300 border-dashed rounded-lg flex flex-col items-center"
										>
											<h3
												class="px-5 py-2 text-muted-foreground
								text-center my-10 w-full text-lg"
											>
												No results found, try again.
											</h3>

											<div class="text-center text-muted text-balance">
												Tip: when searching, you can also write provider names (like <code
													>goog</code
												>
												or
												<code>openai</code>) to filter all the models for that provider
											</div>
										</div>
									{/each}
								</Combobox.Viewport>
							</div>
						</div>
					{/if}
				{/snippet}
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
{/if}

<style>
	:global(input) {
		/* border: none; */
		outline: none;
	}
</style>

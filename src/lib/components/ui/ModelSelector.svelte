<script lang="ts">
	import { popularModels } from '$lib/models';
	import Icon from '@iconify/svelte';
	import { Combobox } from 'bits-ui';
	import type { ModelInfo } from '$lib/models';
	import { fly } from 'svelte/transition';
	import { globalState } from '../../../stores/stores.svelte';
	import { onMount } from 'svelte';

	let searchValue = $state('');

	let providerIcons = {
		Anthropic: 'simple-icons:anthropic',
		DeepSeek: 'fluent-emoji-high-contrast:whale',
		Google: 'simple-icons:google',
		Meta: 'simple-icons:meta',
		Mistral: 'logos:mistral-ai-icon',
		OpenAI: 'ri:openai-line',
		OpenRouter: 'solar:branching-paths-up-bold'
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
		if (globalState.modelIdSelected) {
			const storedModel: ModelInfo = popularModels.find(
				(model) => model.id === globalState.modelIdSelected
			)!;
			selectedModel = { value: storedModel.id, label: storedModel.name };
		} else {
			const model = popularModels.find(
				(model) => model.id === 'google/gemini-2.5-flash-preview-05-20'
			)!;
			globalState.modelIdSelected = model.id;
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
			return { value: model.id, label: model.name, disabled: false };
		})}
		bind:value={selectedModel!.value}
		onValueChange={(newSelection: string) => {
			globalState.modelIdSelected = newSelection;
		}}
		onOpenChange={(o) => {
			if (!o) searchValue = '';
		}}
	>
		<div class="relative">
			<Combobox.Input
				oninput={(e) => (searchValue = e.currentTarget.value)}
				class="border-subtle rounded-box h-full w-60 border px-3 text-xs"
				placeholder={selectedModel.label}
				aria-label="Select a model"
				defaultValue={selectedModel.label}
			/>
			<Combobox.Trigger class="btn btn-xs absolute top-1/2 right-2 -translate-y-1/2">
				<Icon icon="solar:maximize-bold-duotone" />
			</Combobox.Trigger>
		</div>
		<Combobox.Portal>
			<Combobox.Content
				class="border-subtle bg-base-200 shadow-popover data-[state=open]:animate-in
			z-50 h-96 rounded-xl border px-1 py-1
			outline-hidden select-none data-[side=bottom]:translate-y-1
			data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
				sideOffset={10}
			>
				<Combobox.ScrollUpButton class="flex w-full items-center justify-center py-1"
				></Combobox.ScrollUpButton>
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
								<Combobox.Item
									class="text-muted data-highlighted:bg-base-300/30
								ring-subtle flex h-10 w-full
								items-center
								rounded-xl px-2 py-1 text-sm capitalize outline-hidden
								select-none data-highlighted:shadow-sm data-highlighted:ring dark:data-highlighted:shadow-xl"
									value={model.id}
									label={model.name}
								>
									{#snippet children({ selected })}
										<span class="truncate">
											{model.name}
										</span>
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
						<span class="block px-5 py-2 text-sm text-muted-foreground">
							No results found, try again.
						</span>
					{/each}
				</Combobox.Viewport>
				<Combobox.ScrollDownButton class="flex w-full items-center justify-center py-1"
				></Combobox.ScrollDownButton>
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
{/if}

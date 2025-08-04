<script lang="ts">
	import { Plot, Line, BarX, BarY, Cell } from 'svelteplot';
	import { fetchWithAuth } from '$lib/client/auth';
	import { fly } from 'svelte/transition';
	import { backInOut, backOut, bounceInOut, circInOut, cubicInOut } from 'svelte/easing';

	interface AnalyticsData {
		messageVolume: Array<{ date: string; userMessages: number; assistantMessages: number }>;
		modelUsage: Array<{ model: string; provider: string; count: number; cost: number }>;
		calendarData: Array<{ date: string; count: number }>;
		costData: Array<{ date: string; cost: number }>;
		totalMessages: number;
		totalCost: number;
	}

	let data = $state<AnalyticsData | null>(null);
	let loading = $state(true);
	let error = $state('');
	let selectedPeriod = $state('all');
	let hoveredModel = $state();
	let hoveredDay = $state();
	$inspect(hoveredModel);

	const periods = [
		{ label: 'Last Month', value: 'month' },
		{ label: 'All Time', value: 'all' }
	];

	async function fetchAnalytics() {
		loading = true;
		error = '';
		try {
			const response = await fetchWithAuth({
				url: `/api/analytics?period=${selectedPeriod}`
			});
			if (!response.ok) {
				throw new Error('Failed to fetch analytics data');
			}
			data = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	// Refetch when period changes
	$effect(() => {
		if (selectedPeriod) {
			fetchAnalytics();
		}
	});

	// Prepare data for charts
	const messageVolumeData = $derived(
		data?.messageVolume.map((d) => ({
			date: new Date(d.date),
			messages: d.userMessages + d.assistantMessages
		})) || []
	);

	const modelUsageData = $derived(
		data?.modelUsage
			.map((d) => ({
				model: d.model.split('/').pop() || d.model,
				count: d.count,
				provider: d.provider
			}))
			.slice(0, 8) || []
	);

	const costData = $derived(
		data?.costData.map((d) => ({
			date: new Date(d.date),
			cost: d.cost
		})) || []
	);

	// Calendar heatmap data preparation
	const calendarHeatmapData = $derived.by(() => {
		const dataMap = new Map(data?.calendarData?.map((d) => [d.date, d.count]) || []);
		const heatmapData = [];

		// Get current year or use the year from the data
		const currentYear = new Date().getFullYear();

		// Generate all days for the current year
		for (let month = 0; month < 12; month++) {
			const daysInMonth = new Date(currentYear, month + 1, 0).getDate();

			for (let day = 1; day <= daysInMonth; day++) {
				const date = new Date(currentYear, month, day);
				const dateStr = date.toISOString().split('T')[0];
				const count = dataMap.get(dateStr) || 0;

				heatmapData.push({
					date: date,
					day: day,
					month: month,
					count: count
				});
			}
		}

		return heatmapData;
	});

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 4
		}).format(value);
	}

	function formatNumber(value: number): string {
		return new Intl.NumberFormat('en-US').format(value);
	}
</script>

<div class="mb-20">
	<div class="">
		<!-- Period Selector -->
		<div class="mb-6">
			<div class="flex items-center justify-between gap-2">
				<div class="flex gap-1">
					{#each periods as period}
						<button
							class="btn btn-sm {selectedPeriod === period.value
								? 'btn-primary'
								: 'btn-outline border-subtle'}"
							onclick={() => (selectedPeriod = period.value)}
						>
							{period.label}
						</button>
					{/each}
				</div>
				{#if loading}
					<div class="loading loading-bars self-end"></div>
				{/if}
			</div>
		</div>
	</div>

	{#if error}
		<div class="">
			<div class="alert alert-error">
				<span>Error: {error}</span>
			</div>
		</div>
	{:else if data}
		<!-- Summary Cards -->
		<div class="stats mb-8 grid grid-cols-1 md:grid-cols-3">
			<div class="stat">
				<div class="stat-title">Total Messages</div>
				<div class="stat-value">{formatNumber(data.totalMessages)}</div>
			</div>
			<div class="stat">
				<div class="stat-title">Total Cost</div>
				<div class="stat-value">{formatCurrency(data.totalCost)}</div>
			</div>
			<div class="stat">
				<div class="stat-title">Avg Cost/Message</div>
				<div class="stat-value">
					{data.totalMessages > 0 ? formatCurrency(data.totalCost / data.totalMessages) : '$0.0000'}
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<div class="chart-container bg-base-100 rounded-lg">
				<h3 class="mb-4 text-lg font-semibold">Message Volume Over Time</h3>
				{#if messageVolumeData.length > 0}
					<div class="chart-wrapper">
						<Plot
							height={240}
							marginLeft={40}
							marginRight={60}
							marginBottom={70}
							y={{ grid: true }}
							x={{
								tickRotate: -15,
								tickFormat: (d) => new Date(d).toLocaleDateString()
							}}
						>
							<BarY data={messageVolumeData} x="date" y="messages" fill="var(--color-primary)" />
						</Plot>
					</div>
				{:else}
					<div class="no-data">No message data available</div>
				{/if}
			</div>

			<!-- Model Usage Chart -->
			<div class="chart-container bg-base-100 rounded-lg">
				<h3 class="mb-4 text-lg font-semibold">Top Models by Usage</h3>
				{#if modelUsageData.length > 0}
					<div class="chart-wrapper" onmouseleave={() => (hoveredModel = null)}>
						<Plot
							height={240}
							marginLeft={80}
							x={{ grid: true }}
							color={{
								legend: true,
								scheme: [
									'var(--color-primary)',
									'var(--color-accent)',
									'var(--color-info)',
									'var(--color-success)',
									'var(--color-warning)',
									'var(--color-muted)'
								]
							}}
						>
							<BarX
								onmouseover={(e, d) => {
									hoveredModel = d;
								}}
								data={modelUsageData}
								x="count"
								y="provider"
								fill="model"
							/>

							{#snippet overlay()}
								{#if hoveredModel}
									<div
										transition:fly={{ y: 10, duration: 150 }}
										class="bg-base-100 absolute top-0 right-0"
									>
										<h5
											class="w-full text-right text-sm
											font-semibold"
										>
											{hoveredModel.model}
										</h5>
										<p class="card-text text-right text-xs">
											{hoveredModel.provider} ·
											{hoveredModel.count}
											message{hoveredModel.count == 1 ? '' : 's'}
										</p>
									</div>
								{/if}
							{/snippet}
						</Plot>
					</div>
				{:else}
					<div class="no-data">No model usage data available</div>
				{/if}
			</div>

			<!-- Calendar Heatmap -->
			<div class="chart-container bg-base-100 rounded-lg">
				<h3 class="mb-4 text-lg font-semibold">Activity Heatmap</h3>
				{#if calendarHeatmapData.length > 0}
					<div class="chart-wrapper overflow-x-auto" onmouseleave={() => (hoveredDay = null)}>
						<Plot
							marginLeft={60}
							padding={0}
							aspectRatio={1}
							color={{
								scheme: [
									'var(--color-base-200)',
									'var(--color-base-300)',
									'var(--color-muted)',
									'var(--color-primary)',
									'var(--color-success)'
								],
								type: 'quantize',
								legend: true
							}}
							y={{
								tickFormat: (d) =>
									[
										'Jan',
										'Feb',
										'Mar',
										'Apr',
										'May',
										'Jun',
										'Jul',
										'Aug',
										'Sep',
										'Oct',
										'Nov',
										'Dec'
									][d]
							}}
						>
							<Cell
								data={calendarHeatmapData}
								x="day"
								y="month"
								fill="count"
								inset={0.8}
								onmouseover={(e, d) => {
									hoveredDay = d;
								}}
								style="cursor: pointer;"
							/>

							{#snippet overlay()}
								{#if hoveredDay}
									<div
										class="bg-base-100 absolute top-0
										right-0 tabular-nums"
										transition:fly={{ y: 10, duration: 200 }}
									>
										<h5 class="w-full text-right text-sm font-semibold">
											{new Date(hoveredDay.date).toLocaleDateString('en-UK', {
												month: 'short',
												day: 'numeric'
											})}
										</h5>
										<p class="card-text text-right text-xs">
											{hoveredDay.count} message{hoveredDay.count == 1 ? '' : 's'}
										</p>
									</div>
								{/if}
							{/snippet}
						</Plot>
					</div>
				{:else}
					<div class="no-data">No activity data available</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	:global(text) {
		font-family: var(--font-sans);
	}
</style>

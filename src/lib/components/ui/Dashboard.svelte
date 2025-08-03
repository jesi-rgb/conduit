<script lang="ts">
	import { Plot, Line, BarX, Cell, Pointer, Text, Dot, HTMLTooltip } from 'svelteplot';
	import { fetchWithAuth } from '$lib/client/auth';

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
	let selectedPeriod = $state(90);
	let showPopup = $state(false);

	const periods = [
		{ label: '7 days', value: 7 },
		{ label: '30 days', value: 30 },
		{ label: '90 days', value: 90 }
	];

	async function fetchAnalytics() {
		loading = true;
		error = '';
		try {
			const response = await fetchWithAuth({
				url: `/api/analytics?days=${selectedPeriod}`
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
		data?.messageVolume.flatMap((d) => [
			{ date: new Date(d.date), value: d.userMessages, type: 'User' },
			{ date: new Date(d.date), value: d.assistantMessages, type: 'Assistant' }
		]) || []
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
	$inspect(modelUsageData);

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
			<div class="flex gap-2">
				{#each periods as period}
					<button
						class="btn btn-sm {selectedPeriod === period.value ? 'btn-primary' : 'btn-outline'}"
						onclick={() => (selectedPeriod = period.value)}
					>
						{period.label}
					</button>
				{/each}
			</div>
		</div>
	</div>

	{#if loading}
		<div class="">
			<div class="loading loading-spinner loading-lg"></div>
			<p>Loading analytics...</p>
		</div>
	{:else if error}
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
				<div class="stat-value text-primary">{formatNumber(data.totalMessages)}</div>
			</div>
			<div class="stat">
				<div class="stat-title">Total Cost</div>
				<div class="stat-value text-secondary">{formatCurrency(data.totalCost)}</div>
			</div>
			<div class="stat">
				<div class="stat-title">Avg Cost/Message</div>
				<div class="stat-value text-accent">
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
							marginBottom={40}
							y={{ grid: true }}
							color={{ legend: true }}
						>
							<Line marker="dot" data={messageVolumeData} x="date" y="value" strokeWidth={2} />
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
					<div class="chart-wrapper h-64">
						<Plot height={240} marginLeft={120} marginBottom={40} color={{ legend: true }}>
							<BarX data={modelUsageData} x="count" y="model" fill="provider" />
						</Plot>
					</div>
				{:else}
					<div class="no-data">No model usage data available</div>
				{/if}
			</div>

			<!-- Cost Tracking Chart -->
			<div class="chart-container bg-base-100 rounded-lg">
				<h3 class="mb-4 text-lg font-semibold">Daily Costs</h3>
				{#if costData.length > 0}
					<div class="chart-wrapper h-64">
						<Plot height={240} marginLeft={60} marginBottom={40}>
							<Line data={costData} x="date" y="cost" strokeWidth={2} marker="dot" />
						</Plot>
					</div>
				{:else}
					<div class="no-data">No cost data available</div>
				{/if}
			</div>

			<!-- Calendar Heatmap -->
			<div class="chart-container bg-base-100 rounded-lg">
				<h3 class="mb-4 text-lg font-semibold">Activity Heatmap</h3>
				{#if calendarHeatmapData.length > 0}
					<div class="chart-wrapper overflow-x-auto">
						<Plot
							marginLeft={60}
							padding={0}
							color={{
								scheme: [
									'var(--color-base-200)',
									'var(--color-base-300)',
									'var(--color-muted)',
									'var(--color-primary)'
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
								inset={0.9}
								onclick={(d) => handleCellClick(d)}
								style="cursor: pointer;"
							/>
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

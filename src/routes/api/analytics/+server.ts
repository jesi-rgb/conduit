import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { messages, conversations } from '$lib/server/db/schema';
import { eq, gte, and, count, sql } from 'drizzle-orm';
import { popularModels } from '$lib/models';
import { getCurrentUser } from '$lib/server/auth/user';

export async function GET({ request, url }: { request: Request; url: URL }) {
	const user = await getCurrentUser(request);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const userId = user.id; // Extract user ID for cleaner code
	const days = parseInt(url.searchParams.get('days') || '30');

	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	try {
		// Message volume data - using Drizzle query builder
		const messageVolumeData = await db
			.select({
				date: sql<string>`DATE(${messages.created_at})`.as('date'),
				role: messages.role,
				count: count().as('count')
			})
			.from(messages)
			.innerJoin(conversations, eq(messages.conversation_id, conversations.id))
			.where(and(eq(conversations.user_id, userId), gte(messages.created_at, startDate)))
			.groupBy(sql`DATE(${messages.created_at})`, messages.role)
			.orderBy(sql`date DESC`);

		// Model usage data - using Drizzle query builder
		const modelUsageData = await db
			.select({
				model: messages.generated_by,
				count: count().as('count')
			})
			.from(messages)
			.innerJoin(conversations, eq(messages.conversation_id, conversations.id))
			.where(
				and(
					eq(conversations.user_id, userId),
					eq(messages.role, 'assistant'),
					sql`${messages.generated_by} IS NOT NULL`,
					gte(messages.created_at, startDate)
				)
			)
			.groupBy(messages.generated_by)
			.orderBy(sql`count DESC`);

		// Calendar heatmap data (last 365 days) - using Drizzle query builder
		const calendarStartDate = new Date();
		calendarStartDate.setDate(calendarStartDate.getDate() - 365);

		const calendarData = await db
			.select({
				date: sql<string>`DATE(${messages.created_at})`.as('date'),
				count: count().as('count')
			})
			.from(messages)
			.innerJoin(conversations, eq(messages.conversation_id, conversations.id))
			.where(and(eq(conversations.user_id, userId), gte(messages.created_at, calendarStartDate)))
			.groupBy(sql`DATE(${messages.created_at})`)
			.orderBy(sql`date DESC`);
		// Process message volume data
		const volumeByDate = new Map();
		for (const row of messageVolumeData) {
			const date = row.date;
			const role = row.role;
			const count = Number(row.count);

			if (!volumeByDate.has(date)) {
				volumeByDate.set(date, { date, userMessages: 0, assistantMessages: 0 });
			}
			if (role === 'user') {
				volumeByDate.get(date).userMessages = count;
			} else if (role === 'assistant') {
				volumeByDate.get(date).assistantMessages = count;
			}
		}

		// Process model usage data with cost calculation
		const modelUsage = [];
		for (const row of modelUsageData) {
			const modelId = row.model || 'Unknown';
			const count = Number(row.count);
			const modelInfo = popularModels.find((m) => m.id === modelId);

			// Rough cost estimation (assuming average 1000 tokens per message)
			const estimatedCost = modelInfo
				? (parseFloat(modelInfo.pricing.prompt) + parseFloat(modelInfo.pricing.completion)) *
					1000 *
					count
				: 0;

			modelUsage.push({
				model: modelId,
				provider: modelInfo?.provider || 'Unknown',
				count,
				cost: estimatedCost
			});
		}

		// Calculate cost data by aggregating model usage
		const costByDate = new Map();
		const totalModelUsage = modelUsage.reduce((sum: number, m) => sum + m.count, 0);
		const totalCost = modelUsage.reduce((sum: number, m) => sum + m.cost, 0);

		for (const row of messageVolumeData) {
			const date = row.date;
			const role = row.role;
			const count = Number(row.count);

			if (role === 'assistant') {
				const avgCostPerMessage = totalModelUsage > 0 ? totalCost / totalModelUsage : 0;
				const dailyCost = avgCostPerMessage * count;
				costByDate.set(date, { date, cost: dailyCost });
			}
		}

		// Calculate total messages
		const totalMessages = messageVolumeData.reduce(
			(sum: number, row) => sum + Number(row.count),
			0
		);

		return json({
			messageVolume: Array.from(volumeByDate.values()).reverse(),
			modelUsage: modelUsage.slice(0, 10), // Top 10 models
			calendarData: calendarData.map((row) => ({
				date: row.date,
				count: Number(row.count)
			})),
			costData: Array.from(costByDate.values()).reverse(),
			totalMessages,
			totalCost: Array.from(costByDate.values()).reduce((sum: number, item) => sum + item.cost, 0)
		});
	} catch (error) {
		console.error('Analytics query error:', error);
		return json({ error: 'Failed to fetch analytics data' }, { status: 500 });
	}
}

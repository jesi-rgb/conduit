import { db } from '$lib/server/db';
import { conversations } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const POST = async ({ request, params }: { request: Request; params: any }) => {
	const { id } = params;
	const { title } = await request.json();

	await db.update(conversations).set({ title }).where(eq(conversations.id, id));

	return json({ status: 200 });
};

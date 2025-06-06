
import { json } from '@sveltejs/kit';

import { getCurrentUser } from '$lib/server/auth/user';
import { getBranches } from '$lib/server/branches';


export async function GET({ request }: { request: Request }) {

	const user = await getCurrentUser(request);
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}


	const requestBody = await request.json();
	const { parentId } = requestBody;

	const branches = await getBranches(parentId);
	return json({ branches });

}


export async function POST({ request }: { request: Request }) { }



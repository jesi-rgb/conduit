import { createClient } from "@supabase/supabase-js";
import { env } from '$env/dynamic/public';
import type { User } from '@supabase/supabase-js';

export async function getCurrentUser(request: Request): Promise<User | null> {
	// Allow JWT in Authorization header, or fall back to cookies
	const authHeader = request.headers.get('authorization') || '';
	let token: string | null = null;
	if (authHeader.toLowerCase().startsWith('bearer ')) {
		token = authHeader.slice('bearer '.length).trim();
	}

	const cookie = request.headers.get('cookie');

	const serverSupabase = createClient(
		env.PUBLIC_SUPABASE_URL,
		env.PUBLIC_SUPABASE_ANON_KEY,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
				detectSessionInUrl: false,
				// Pass the cookie header if present for session parsing
				...(cookie ? { headers: { cookie } } : {})
			}
		}
	);

	// If we have a bearer token, validate it directly
	if (token) {
		const { data: { user }, error: userError } = await serverSupabase.auth.getUser(token);
		if (userError) {
			console.error('Error validating JWT:', userError);
			return null;
		}
		if (!user) {
			console.log('No user found in JWT');
			return null;
		}
		return user;
	}

	// For cookie sessions, require a cookie
	if (!cookie) {
		return null;
	}

	// Get the session from the cookie
	const { data: { session }, error: sessionError } = await serverSupabase.auth.getSession();

	if (sessionError) {
		console.error('Error fetching session from cookie:', sessionError);
		return null;
	}

	if (!session) {
		console.log('No active session found');
		return null;
	}

	// Get the user from the session
	const user = session.user;

	if (!user) {
		console.log('No user found in session');
		return null;
	}

	return user;
}

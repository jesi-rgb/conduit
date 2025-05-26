import { supabase } from "$lib/client/supabase";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
	try {
		// Get the current session
		const { data: { session } } = await supabase.auth.getSession();

		// Create a new headers object, preserving any existing headers
		const headers = new Headers(options.headers);

		// Add Authorization header if a session exists
		if (session?.access_token) {
			headers.set('Authorization', `Bearer ${session.access_token}`);
		}

		// Perform the fetch with the updated headers
		return fetch(url, {
			...options,
			headers
		});
	} catch (error) {
		console.error('Error in fetchWithAuth:', error);
		// Fallback to regular fetch if something goes wrong
		return fetch(url, options);
	}
}

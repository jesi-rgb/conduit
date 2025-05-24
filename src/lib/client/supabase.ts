
import { createClient } from '@supabase/supabase-js';

import { env } from '$env/dynamic/public';
import { dev } from '$app/environment';

console.log('dev', dev)
const supabaseUrl = dev ? env.PUBLIC_SUPABASE_URL_DEV : env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = dev ? env.PUBLIC_SUPABASE_ANON_KEY_DEV : env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
	console.log(supabaseUrl)
	console.error('Missing VITE_SUPABASE_URL');
}

if (!supabaseAnonKey) {
	console.error('Missing VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
	supabaseUrl || '',
	supabaseAnonKey || ''
);


import { createClient } from '@supabase/supabase-js';

import { env } from '$env/dynamic/public';

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;

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

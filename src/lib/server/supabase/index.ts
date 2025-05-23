
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

if (!env.PUBLIC_SUPABASE_URL) throw new Error('SUPABASE_URL is not set');
if (!env.PUBLIC_SUPABASE_ANON_KEY) throw new Error('SUPABASE_ANON_KEY is not set');

export const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

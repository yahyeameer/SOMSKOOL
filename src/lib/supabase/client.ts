import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isMock = !supabaseUrl || supabaseUrl === 'your_url' || !supabaseAnonKey;

export const supabase = createBrowserClient(
  supabaseUrl && supabaseUrl !== 'your_url' ? supabaseUrl : 'https://placeholder-somskool.supabase.co',
  supabaseAnonKey && supabaseAnonKey !== 'your_anon_key' ? supabaseAnonKey : 'placeholder'
)

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isMock = !supabaseUrl || supabaseUrl === 'your_url' || !supabaseAnonKey;

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    supabaseUrl && supabaseUrl !== 'your_url' ? supabaseUrl : 'https://placeholder-somskool.supabase.co',
    supabaseAnonKey && supabaseAnonKey !== 'your_anon_key' ? supabaseAnonKey : 'placeholder',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method can be called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

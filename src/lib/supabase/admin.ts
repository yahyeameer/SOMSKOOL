import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client using the SERVICE ROLE key.
 *
 * This bypasses Row Level Security and must ONLY ever be used inside server
 * actions AFTER the caller has been verified (e.g. via `requireAdmin`) or for
 * trusted, server-controlled operations such as awarding points.
 *
 * Never import this into client components.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase service role is not configured (missing env vars).')
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

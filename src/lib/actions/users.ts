'use server'

import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types'

export async function getLeaderboard() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      // If points column doesn't exist yet in the DB, this will fail gracefully due to the catch block
      .order('points', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching leaderboard:', error.message)
      return { data: [] }
    }

    return { data: data as Profile[] || [] }
  } catch (err: any) {
    console.error('getLeaderboard exception:', err.message)
    return { data: [] }
  }
}

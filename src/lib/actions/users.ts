'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from './auth'
import { revalidatePath } from 'next/cache'
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

export async function getAllStudents() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching students:', error.message)
      return { data: [] }
    }

    return { data: data as Profile[] || [] }
  } catch (err: any) {
    console.error('getAllStudents exception:', err.message)
    return { data: [] }
  }
}

export async function updateStudentPoints(studentId: string, points: number) {
  // This action had no authorization check at all. The database blocks the write
  // anyway (RLS plus the profiles column guard), but the gate belongs here too.
  const admin = await requireAdmin()
  if (!admin.ok) return { success: false, error: admin.error }

  const safePoints = Math.max(0, Math.floor(Number(points) || 0))

  try {
    // Points columns are protected by a DB trigger, so this needs the service role.
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('profiles')
      .update({ points: safePoints })
      .eq('id', studentId)

    if (error) return { success: false, error: error.message }

    revalidatePath('/admin')
    revalidatePath('/leaderboard')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

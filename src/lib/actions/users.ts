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
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ points })
      .eq('id', studentId)

    if (error) return { success: false, error: error.message }
    
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

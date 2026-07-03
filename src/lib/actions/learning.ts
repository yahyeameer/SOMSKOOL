'use server'

import { createClient } from '@/lib/supabase/server'
import { CourseVideo, StudentProgress } from '@/types'
import { revalidatePath } from 'next/cache'

// Get all videos for a course
export async function getCourseVideos(courseId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('course_videos')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true })

    if (error) throw error

    return { success: true, data: data as CourseVideo[] }
  } catch (error: any) {
    console.error('getCourseVideos error:', error.message)
    return { success: false, error: error.message }
  }
}

// Get student's completed videos for a course
export async function getStudentProgress(courseId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { data, error } = await supabase
      .from('student_progress')
      .select('*')
      .eq('course_id', courseId)
      .eq('student_id', user.id)

    if (error) throw error

    return { success: true, data: data as StudentProgress[] }
  } catch (error: any) {
    console.error('getStudentProgress error:', error.message)
    return { success: false, error: error.message }
  }
}

// Mark video as completed and award points
export async function markVideoCompleted(videoId: string, courseId: string, pointsToAward: number = 10) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // 1. Check if already completed
    const { data: existing } = await supabase
      .from('student_progress')
      .select('id')
      .eq('video_id', videoId)
      .eq('student_id', user.id)
      .single()

    if (existing) {
      return { success: true, message: 'Already completed' }
    }

    // 2. Insert progress record
    const { error: insertError } = await supabase
      .from('student_progress')
      .insert({
        student_id: user.id,
        video_id: videoId,
        course_id: courseId
      })

    if (insertError) throw insertError

    // 3. Award points to the student profile atomically via RPC (with select-update fallback)
    const { error: updateError } = await supabase
      .rpc('increment_points', { user_id: user.id, points_to_add: pointsToAward })

    if (updateError) {
      console.warn('RPC increment_points failed, falling back to read-then-write:', updateError.message)
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single()

      const currentPoints = profile?.points || 0
      const newPoints = currentPoints + pointsToAward

      const { error: fallbackError } = await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', user.id)

      if (fallbackError) {
        console.error('Fallback points update failed:', fallbackError.message)
      }
    }

    revalidatePath(`/courses/[slug]/learn`, 'page')
    revalidatePath(`/leaderboard`)

    return { success: true }
  } catch (error: any) {
    console.error('markVideoCompleted error:', error.message)
    return { success: false, error: error.message }
  }
}

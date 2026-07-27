'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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

// Mark video as completed and award points.
// NOTE: points are always looked up server-side from the video record — the
// amount is never trusted from the client, to prevent points inflation.
export async function markVideoCompleted(videoId: string, courseId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // 1. Verify the video exists, belongs to the given course, and read its
    //    authoritative point value from the database.
    const { data: video, error: videoError } = await supabase
      .from('course_videos')
      .select('id, course_id, points_awarded')
      .eq('id', videoId)
      .single()

    if (videoError || !video || video.course_id !== courseId) {
      return { success: false, error: 'Casharkan lama helin.' }
    }

    const pointsToAward = video.points_awarded ?? 10

    // 2. Check if already completed
    const { data: existing } = await supabase
      .from('student_progress')
      .select('id')
      .eq('video_id', videoId)
      .eq('student_id', user.id)
      .maybeSingle()

    if (existing) {
      return { success: true, message: 'Already completed' }
    }

    // 3. Insert progress record (RLS ensures student_id = auth.uid())
    const { error: insertError } = await supabase
      .from('student_progress')
      .insert({
        student_id: user.id,
        video_id: videoId,
        course_id: courseId
      })

    if (insertError) throw insertError

    // 4. Award points via the service role. Points columns are protected by a
    //    DB trigger that only permits changes from admins or trusted server
    //    contexts, so this must run with the service-role client.
    const admin = createAdminClient()
    const { error: rpcError } = await admin
      .rpc('increment_points', { user_id: user.id, points_to_add: pointsToAward })

    if (rpcError) {
      console.warn('RPC increment_points failed, falling back to read-then-write:', rpcError.message)
      const { data: profile } = await admin
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single()

      const newPoints = (profile?.points || 0) + pointsToAward
      const { error: fallbackError } = await admin
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', user.id)

      if (fallbackError) {
        console.error('Fallback points update failed:', fallbackError.message)
      }
    }

    revalidatePath(`/courses/[slug]/learn`, 'page')
    revalidatePath(`/leaderboard`)

    return { success: true, pointsAwarded: pointsToAward }
  } catch (error: any) {
    console.error('markVideoCompleted error:', error.message)
    return { success: false, error: error.message }
  }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { getSessionUser } from './auth'
import { Course, CourseVideo, StudentProgress } from '@/types'

export interface EnrolledCourseData {
  course: Course
  totalVideos: number
  completedVideos: number
  progressPercent: number
  lastWatchedAt: string | null
}

export interface DashboardData {
  profile: {
    id: string
    full_name: string
    avatar_url: string
    role: string
    points: number
    created_at: string
    email?: string
  }
  enrolledCourses: EnrolledCourseData[]
  totalPoints: number
  leaderboardRank: number
  totalCompletedVideos: number
  recentActivity: {
    video_title: string
    course_title: string
    completed_at: string
    points_awarded: number
  }[]
  payments: any[]
  documents: any[]
  allVideos: any[]
}

/**
 * Fetches all data needed for the student dashboard in a single call.
 */
export async function getStudentDashboardData(): Promise<{ data: DashboardData | null; error: string | null }> {
  const user = await getSessionUser()
  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  try {
    const supabase = await createClient()

    // 1. Fetch full profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Get email from auth
    const { data: { user: authUser } } = await supabase.auth.getUser()

    // 2. Fetch enrollments
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('course_id, enrolled_at')
      .eq('student_id', user.id)

    // 3. Fetch all courses the student is enrolled in
    const enrolledCourseIds = (enrollments || []).map(e => e.course_id)
    let enrolledCourses: EnrolledCourseData[] = []

    if (enrolledCourseIds.length > 0) {
      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .in('id', enrolledCourseIds)

      // 4. Fetch all videos for enrolled courses
      const { data: allVideos } = await supabase
        .from('course_videos')
        .select('*')
        .in('course_id', enrolledCourseIds)

      // 5. Fetch student progress
      const { data: progress } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', user.id)

      // Build enrolled course data
      enrolledCourses = (courses || []).map(course => {
        const courseVideos = (allVideos || []).filter(v => v.course_id === course.id)
        const completedForCourse = (progress || []).filter(p => p.course_id === course.id)
        const totalVideos = courseVideos.length
        const completedVideos = completedForCourse.length
        const progressPercent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0

        // Find latest watch timestamp for this course
        const latestProgress = completedForCourse.sort((a, b) =>
          new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
        )[0]

        return {
          course: course as Course,
          totalVideos,
          completedVideos,
          progressPercent,
          lastWatchedAt: latestProgress?.completed_at || null
        }
      })

      // Sort by last watched (most recent first), then by progress
      enrolledCourses.sort((a, b) => {
        if (a.lastWatchedAt && b.lastWatchedAt) {
          return new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime()
        }
        if (a.lastWatchedAt) return -1
        if (b.lastWatchedAt) return 1
        return b.progressPercent - a.progressPercent
      })
    }

    // 6. Calculate leaderboard rank
    const { data: allStudents } = await supabase
      .from('profiles')
      .select('id, points')
      .eq('role', 'student')
      .order('points', { ascending: false })

    const leaderboardRank = (allStudents || []).findIndex(s => s.id === user.id) + 1

    // 7. Total completed videos (full count, not limited to the recent slice)
    const { count: completedCount } = await supabase
      .from('student_progress')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id)

    const totalCompletedVideos = completedCount || 0

    // Recent progress rows (with joins) for the activity feed only
    const { data: allProgress } = await supabase
      .from('student_progress')
      .select('*, course_videos(title, points_awarded), courses(title)')
      .eq('student_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10)

    // 8. Build recent activity
    const recentActivity = (allProgress || []).slice(0, 8).map((p: any) => ({
      video_title: p.course_videos?.title || 'Video',
      course_title: p.courses?.title || 'Course',
      completed_at: p.completed_at,
      points_awarded: p.course_videos?.points_awarded || 10
    }))

    // 9. Fetch payments history
    const { data: dbPayments } = await supabase
      .from('payments')
      .select('*, courses(title)')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })

    // 10. Fetch documents for enrolled courses
    let dbDocuments: any[] = []
    if (enrolledCourseIds.length > 0) {
      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .in('course_id', enrolledCourseIds)
        .order('created_at', { ascending: false })
      dbDocuments = docs || []
    }

    // 11. Fetch all videos with courses information for the videos tab
    const { data: dbVideos } = await supabase
      .from('course_videos')
      .select('*, courses(title, slug)')
      .order('created_at', { ascending: false })

    return {
      data: {
        profile: {
          id: profile?.id || user.id,
          full_name: profile?.full_name || user.full_name || 'Student',
          avatar_url: profile?.avatar_url || '',
          role: profile?.role || 'student',
          points: profile?.points || 0,
          created_at: profile?.created_at || new Date().toISOString(),
          email: authUser?.email || ''
        },
        enrolledCourses,
        totalPoints: profile?.points || 0,
        leaderboardRank: leaderboardRank || 0,
        totalCompletedVideos,
        recentActivity,
        payments: dbPayments || [],
        documents: dbDocuments,
        allVideos: dbVideos || []
      },
      error: null
    }
  } catch (err: any) {
    console.error('getStudentDashboardData error:', err.message)
    return { data: null, error: err.message }
  }
}

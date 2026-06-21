'use server'

import { createClient } from '@/lib/supabase/server'
import { getSessionUser } from './auth'
import { revalidatePath } from 'next/cache'

/**
 * Server action to approve or reject student payment requests.
 */
export async function modifyPaymentStatus(paymentId: string, status: 'confirmed' | 'failed') {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Fadlan hubi inaad tahay maamule (admin) si aad u sameyso ficilkan.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', paymentId)

    if (error) return { error: error.message }

    // If confirmed, auto-enroll the student
    if (status === 'confirmed') {
      const { data: payment } = await supabase
        .from('payments')
        .select('student_id, course_id')
        .eq('id', paymentId)
        .single()

      if (payment) {
        await supabase.from('enrollments').upsert({
          student_id: payment.student_id,
          course_id: payment.course_id
        }, { onConflict: 'student_id,course_id' })
      }
    }

    revalidatePath('/admin')
    revalidatePath('/courses')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

/**
 * Server action to upload documents for courses.
 */
export async function submitDocumentUpload(docData: {
  title: string;
  courseId: string;
  type: string;
  url: string;
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Fadlan hubi inaad tahay maamule (admin) si aad u sameyso ficilkan.' }
  }

  if (!docData.title || !docData.courseId || !docData.type) {
    return { error: 'Fadlan buuxi dhamaan meelaha banaan.' }
  }

  try {
    const supabase = await createClient()

    // Get course title for display
    const { data: course } = await supabase
      .from('courses')
      .select('title')
      .eq('id', docData.courseId)
      .single()

    const { error } = await supabase.from('documents').insert({
      title: docData.title,
      course_id: docData.courseId,
      course_title: course?.title || 'General',
      type: docData.type,
      url: docData.url || 'https://somskool.com/uploads/syllabus.pdf'
    })

    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

/**
 * Server action to save promotional homepage YouTube video settings.
 */
export async function saveVideoSettings(settings: {
  youtube_id: string;
  channel_name: string;
  channel_url: string;
  video_title: string;
  video_thumbnail_url: string;
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Fadlan hubi inaad tahay maamule (admin) si aad u sameyso ficilkan.' }
  }

  if (!settings.youtube_id || !settings.channel_name) {
    return { error: 'Muuqaalka YouTube ID iyo magaca kanaalka waa lagama maarmaan.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('video_settings')
      .update({
        youtube_id: settings.youtube_id,
        channel_name: settings.channel_name,
        channel_url: settings.channel_url || 'https://youtube.com',
        video_title: settings.video_title || '',
        video_thumbnail_url: settings.video_thumbnail_url || '',
      })
      .eq('id', 1)

    if (error) return { error: error.message }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

/**
 * Fetch all staff members (teachers and admins)
 */
export async function getStaffMembers() {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Fadlan hubi inaad tahay maamule (admin) si aad u sameyso ficilkan.', data: [] }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['teacher', 'admin'])
      .order('created_at', { ascending: false })

    if (error) return { error: error.message, data: [] }
    return { data: data || [] }
  } catch (err: any) {
    return { error: err.message, data: [] }
  }
}

/**
 * Create a new staff account (uses service role to bypass email confirmation)
 */
export async function createStaffAccount(staffData: { full_name: string, email: string, role: string, password: string }) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Fadlan hubi inaad tahay maamule (admin) si aad u sameyso ficilkan.' }
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    return { error: 'SUPABASE_SERVICE_ROLE_KEY is missing from .env.local' }
  }

  try {
    const { createClient: createAdminClient } = await import('@supabase/supabase-js')
    const adminAuthClient = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Create user via Admin API (automatically confirms email)
    const { data: newUser, error: createError } = await adminAuthClient.auth.admin.createUser({
      email: staffData.email,
      password: staffData.password,
      email_confirm: true,
      user_metadata: { full_name: staffData.full_name }
    })

    if (createError) return { error: createError.message }

    // Update the role since the DB trigger defaults to 'student'
    if (newUser?.user) {
      const { error: updateError } = await adminAuthClient
        .from('profiles')
        .update({ role: staffData.role })
        .eq('id', newUser.user.id)

      if (updateError) return { error: updateError.message }
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

/**
 * Fetch all payments for admin dashboard
 */
export async function getPayments() {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return []
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payments:', error.message)
      return []
    }
    return data || []
  } catch {
    return []
  }
}

/**
 * Fetch all documents for admin dashboard
 */
export async function getDocuments() {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return []
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error.message)
      return []
    }
    return data || []
  } catch {
    return []
  }
}

/**
 * Fetch video settings from database
 */
export async function getVideoSettings() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('video_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error || !data) {
      return {
        youtube_id: 'ScMzIvxBSi4',
        channel_name: 'SomSkool Academy',
        channel_url: 'https://youtube.com/@somskool',
        video_title: '',
        video_thumbnail_url: ''
      }
    }

    return {
      youtube_id: data.youtube_id,
      channel_name: data.channel_name,
      channel_url: data.channel_url,
      video_title: data.video_title || '',
      video_thumbnail_url: data.video_thumbnail_url || ''
    }
  } catch {
    return {
      youtube_id: 'ScMzIvxBSi4',
      channel_name: 'SomSkool Academy',
      channel_url: 'https://youtube.com/@somskool',
      video_title: '',
      video_thumbnail_url: ''
    }
  }
}

export async function addCourseVideo(data: { course_id: string, title: string, youtube_id: string, points_awarded: number, order_index: number }) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') return { error: 'Unauthorized' }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('course_videos')
      .insert(data)

    if (error) throw error

    revalidatePath('/admin')
    // Don't revalidate dynamic path with brackets, just return success
    return { success: true }
  } catch (err: any) {
    console.error('addCourseVideo error:', err.message)
    return { success: false, error: err.message }
  }
}

export async function deleteCourseVideo(id: string) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') return { error: 'Unauthorized' }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('course_videos')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    console.error('deleteCourseVideo error:', err.message)
    return { success: false, error: err.message }
  }
}

export async function getAllCourseVideos() {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') return []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('course_videos')
      .select('*')
      .order('course_id', { ascending: true })
      .order('order_index', { ascending: true })

    if (error) throw error
    return data || []
  } catch (err) {
    return []
  }
}

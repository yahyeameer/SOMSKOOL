'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSessionUser, requireAdmin } from './auth'
import { revalidatePath } from 'next/cache'
import { extractYoutubeId, slugifyTitle } from '@/lib/utils'
import { Course } from '@/types'

/**
 * Cryptographically secure password for staff accounts.
 * Excludes look-alike characters (0/O, 1/l/I) since admins read these aloud.
 */
function generateStrongPassword(length = 14): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789@#%+='
  const bytes = new Uint32Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join('')
}

/** Public storage bucket that holds admin-uploaded images. */
const MEDIA_BUCKET = 'media'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']

/**
 * Uploads an image from the admin's computer to Supabase Storage and returns
 * its public URL, so thumbnails no longer have to be pasted in as links.
 *
 * `folder` keeps course art and promo art in separate prefixes.
 */
export async function uploadImage(
  formData: FormData,
  folder: 'courses' | 'promo' = 'courses'
): Promise<{ success: boolean; url?: string; error?: string }> {
  const admin = await requireAdmin()
  if (!admin.ok) return { success: false, error: admin.error }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: 'No image was selected.' }
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { success: false, error: 'Only PNG, JPG, WEBP, GIF or AVIF images are allowed.' }
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return {
      success: false,
      error: `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 5 MB — please resize it and try again.`,
    }
  }

  try {
    const storage = createAdminClient()
    const extension = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`

    const { error: uploadError } = await storage.storage
      .from(MEDIA_BUCKET)
      .upload(key, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` }
    }

    const { data } = storage.storage.from(MEDIA_BUCKET).getPublicUrl(key)
    return { success: true, url: data.publicUrl }
  } catch (err: any) {
    console.error('uploadImage error:', err.message)
    return { success: false, error: 'Could not upload the image. Please try again.' }
  }
}

/**
 * Server action to approve or reject student payment requests.
 */
export async function modifyPaymentStatus(paymentId: string, status: 'confirmed' | 'failed', reject_reason?: string) {
  const admin = await requireAdmin()
  if (!admin.ok) return { error: admin.error }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('payments')
      .update({ status, reject_reason: status === 'failed' ? reject_reason || null : null })
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
  const admin = await requireAdmin()
  if (!admin.ok) return { error: admin.error }

  if (!docData.title || !docData.courseId || !docData.type) {
    return { error: 'Please fill in all the required fields.' }
  }

  if (!docData.url?.trim()) {
    return { error: 'Please provide a file link. Documents without a link cannot be opened by students.' }
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
      url: docData.url.trim()
    })

    if (error) return { error: error.message }

    revalidatePath('/admin')
    revalidatePath('/dashboard')
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
  const admin = await requireAdmin()
  if (!admin.ok) return { error: admin.error }

  if (!settings.youtube_id || !settings.channel_name) {
    return { error: 'The YouTube video link and channel name are both required.' }
  }

  // Accept a full YouTube link OR a bare 11-character id — the admin should not
  // have to hand-extract the id from the URL.
  const youtubeId = extractYoutubeId(settings.youtube_id)
  if (!youtubeId) {
    return {
      error: 'Could not read a YouTube video ID from that link. Paste the video URL or the 11-character ID.',
    }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('video_settings')
      .update({
        youtube_id: youtubeId,
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
 * Fetch page settings from database
 */
export async function getPageSettings() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('page_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error || !data) {
      return {
        about_title: 'About SomSkool',
        about_subtitle: 'Empowering the future through education',
        about_text: 'The SomSkool is a diploma school in Addis Ababa with courses in computer science and english with highly educated teachers.',
        about_header_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80',
        contact_title: 'La xiriir SomSkool',
        contact_subtitle: 'Fadlan nala soo xiriir haddii aad hayso wax su\'aalo ah',
        contact_text: 'SomSkool waxay diyaar u tahay inay ku caawiso. Nala soo xiriir maanta.',
        contact_phone: '+252 63 XXX XXXX',
        contact_header_image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80',
        contact_email: 'support@somskool.com',
        contact_address: 'Hargeisa, Somaliland',
        social_facebook: 'https://facebook.com/somskool',
        social_instagram: 'https://instagram.com/somskool',
        social_linkedin: 'https://linkedin.com/company/somskool',
        social_youtube: 'https://youtube.com/@somskool'
      }
    }

    return data
  } catch {
    return {
      about_title: 'About SomSkool',
      about_subtitle: 'Empowering the future through education',
      about_text: 'The SomSkool is a diploma school in Addis Ababa with courses in computer science and english with highly educated teachers.',
      about_header_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80',
      contact_title: 'La xiriir SomSkool',
      contact_subtitle: 'Fadlan nala soo xiriir haddii aad hayso wax su\'aalo ah',
      contact_text: 'SomSkool waxay diyaar u tahay inay ku caawiso. Nala soo xiriir maanta.',
      contact_phone: '+252 63 XXX XXXX',
      contact_header_image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80',
      contact_email: 'support@somskool.com',
      contact_address: 'Hargeisa, Somaliland',
      social_facebook: 'https://facebook.com/somskool',
      social_instagram: 'https://instagram.com/somskool',
      social_linkedin: 'https://linkedin.com/company/somskool',
      social_youtube: 'https://youtube.com/@somskool'
    }
  }
}

/**
 * Save page settings to database
 */
export async function savePageSettings(settings: {
  about_title: string;
  about_subtitle: string;
  about_text: string;
  about_header_image: string;
  contact_title: string;
  contact_subtitle: string;
  contact_text: string;
  contact_phone: string;
  contact_header_image: string;
  contact_email: string;
  contact_address: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_youtube: string;
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return { error: 'You must be an admin to perform this action.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('page_settings')
      .update({
        about_title: settings.about_title,
        about_subtitle: settings.about_subtitle,
        about_text: settings.about_text,
        about_header_image: settings.about_header_image,
        contact_title: settings.contact_title,
        contact_subtitle: settings.contact_subtitle,
        contact_text: settings.contact_text,
        contact_phone: settings.contact_phone,
        contact_header_image: settings.contact_header_image,
        contact_email: settings.contact_email,
        contact_address: settings.contact_address,
        social_facebook: settings.social_facebook,
        social_instagram: settings.social_instagram,
        social_linkedin: settings.social_linkedin,
        social_youtube: settings.social_youtube
      })
      .eq('id', 1)

    if (error) return { error: error.message }

    revalidatePath('/admin')
    revalidatePath('/about')
    revalidatePath('/contact')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

/**
 * Fetch all staff members (teachers and admins)
 */
export async function getStaffMembers() {
  const admin = await requireAdmin()
  if (!admin.ok) return { error: admin.error, data: [] }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'student')
      .order('created_at', { ascending: false })

    if (error) return { error: error.message, data: [] }

    // `profiles` has no email column — the address lives in auth.users, so look
    // it up separately. Without this the staff list shows "Email missing" for
    // every row and admins cannot tell which account they are resetting.
    let emailById = new Map<string, string>()
    try {
      const authClient = createAdminClient()
      const { data: authList } = await authClient.auth.admin.listUsers({ page: 1, perPage: 1000 })
      emailById = new Map((authList?.users || []).map(u => [u.id, u.email || '']))
    } catch (err: any) {
      // Non-fatal: fall back to showing the staff list without emails.
      console.error('getStaffMembers: could not load emails:', err.message)
    }

    const withEmails = (data || []).map(p => ({ ...p, email: emailById.get(p.id) || '' }))
    return { data: withEmails }
  } catch (err: any) {
    return { error: err.message, data: [] }
  }
}

/**
 * Create a new staff account (uses service role to bypass email confirmation)
 */
export async function createStaffAccount(staffData: { full_name: string, email: string, role: string, password: string }) {
  const admin = await requireAdmin()
  if (!admin.ok) return { error: admin.error }

  try {
    const adminAuthClient = createAdminClient()

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
 * Remove a document from the platform.
 */
export async function deleteDocument(id: string) {
  const admin = await requireAdmin()
  if (!admin.ok) return { success: false, error: admin.error }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('documents').delete().eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
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

  // Accept a full YouTube link or a bare id, and reject anything unusable so
  // we never store a broken value that silently produces a dead embed.
  const finalYoutubeId = extractYoutubeId(data.youtube_id)
  if (!finalYoutubeId) {
    return { success: false, error: 'Could not read a YouTube video ID from that link. Paste a video URL or the 11-character ID.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('course_videos')
      .insert({ ...data, youtube_id: finalYoutubeId })

    if (error) throw error

    revalidatePath('/admin')
    // Don't revalidate dynamic path with brackets, just return success
    return { success: true, finalYoutubeId }
  } catch (err: any) {
    console.error('addCourseVideo error:', err.message)
    return { success: false, error: err.message }
  }
}

export interface BulkVideoResult {
  input: string
  videoId?: string
  title?: string
  status: 'added' | 'invalid' | 'duplicate' | 'unavailable' | 'failed'
  message?: string
}

/**
 * Adds many lessons at once from a block of pasted YouTube links (one per line).
 *
 * Each link is parsed, checked against the videos already on the course, and
 * titled from oEmbed where possible. Bad lines are reported back rather than
 * aborting the whole batch.
 */
export async function addCourseVideosBulk(input: {
  course_id: string
  urls: string[]
  points_awarded: number
}): Promise<{ results: BulkVideoResult[]; addedCount: number; error?: string }> {
  const admin = await requireAdmin()
  if (!admin.ok) return { results: [], addedCount: 0, error: admin.error }

  const lines = input.urls.map(u => u.trim()).filter(Boolean)
  if (lines.length === 0) {
    return { results: [], addedCount: 0, error: 'Paste at least one YouTube link.' }
  }

  try {
    const supabase = await createClient()

    // Existing videos on this course: used for ordering and duplicate detection.
    const { data: existing } = await supabase
      .from('course_videos')
      .select('youtube_id, order_index')
      .eq('course_id', input.course_id)

    const seen = new Set((existing || []).map(v => v.youtube_id))
    let nextIndex = (existing || []).reduce((max, v) => Math.max(max, v.order_index || 0), 0) + 1

    // Resolve titles in parallel — oEmbed is a plain public GET.
    const parsed = lines.map(line => ({ line, videoId: extractYoutubeId(line) }))
    const titles = await Promise.all(
      parsed.map(async p => {
        if (!p.videoId) return null
        try {
          const res = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${p.videoId}`)}&format=json`,
            { cache: 'no-store' }
          )
          if (!res.ok) return { unavailable: res.status === 401 || res.status === 403 }
          const data = await res.json()
          return { title: data.title as string }
        } catch {
          return null
        }
      })
    )

    const results: BulkVideoResult[] = []
    const toInsert: any[] = []

    parsed.forEach((p, i) => {
      if (!p.videoId) {
        results.push({ input: p.line, status: 'invalid', message: 'Not a valid YouTube link.' })
        return
      }
      if (seen.has(p.videoId)) {
        results.push({ input: p.line, videoId: p.videoId, status: 'duplicate', message: 'Already on this course.' })
        return
      }

      const meta = titles[i]
      if (meta && 'unavailable' in meta && meta.unavailable) {
        results.push({
          input: p.line,
          videoId: p.videoId,
          status: 'unavailable',
          message: 'Private or not embeddable — set it to Unlisted on YouTube.',
        })
        return
      }

      const title = meta && 'title' in meta && meta.title ? meta.title : `Lesson ${nextIndex}`
      seen.add(p.videoId)
      toInsert.push({
        course_id: input.course_id,
        title,
        youtube_id: p.videoId,
        points_awarded: input.points_awarded,
        order_index: nextIndex++,
      })
      results.push({ input: p.line, videoId: p.videoId, title, status: 'added' })
    })

    if (toInsert.length > 0) {
      const { error } = await supabase.from('course_videos').insert(toInsert)
      if (error) {
        return { results: [], addedCount: 0, error: error.message }
      }
    }

    revalidatePath('/admin')
    return { results, addedCount: toInsert.length }
  } catch (err: any) {
    console.error('addCourseVideosBulk error:', err.message)
    return { results: [], addedCount: 0, error: err.message }
  }
}

/**
 * Looks up a YouTube video's real title from the public oEmbed endpoint so the
 * admin can paste a link and have the lesson title filled in automatically.
 * Requires no API key. Returns an error for links that cannot be embedded
 * (private videos, deleted videos, or embedding disabled by the owner).
 */
export async function lookupYoutubeVideo(urlOrId: string) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') return { error: 'Unauthorized' }

  const videoId = extractYoutubeId(urlOrId)
  if (!videoId) {
    return { error: 'Could not read a YouTube video ID from that link.' }
  }

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`,
      { cache: 'no-store' }
    )

    if (res.status === 401 || res.status === 403) {
      return {
        videoId,
        error: 'This video is private, so it cannot be embedded. Set it to Unlisted on YouTube instead.',
      }
    }
    if (res.status === 404) {
      return { videoId, error: 'That video does not exist or has been removed.' }
    }
    if (!res.ok) {
      return { videoId, error: 'Could not reach YouTube to verify this video.' }
    }

    const data = await res.json()
    return { videoId, title: data.title as string, author: data.author_name as string }
  } catch {
    // Network failure shouldn't block adding the lesson manually.
    return { videoId, error: 'Could not reach YouTube to verify this video.' }
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

/**
 * Every course, including unpublished ones.
 *
 * The admin console must NOT use getCourses(), which filters to
 * is_published = true — a hidden course would then vanish from the course list
 * and from the video/document dropdowns, making it impossible to un-hide or
 * add lessons to it.
 */
export async function getAllCoursesForAdmin(): Promise<{ data: Course[] }> {
  const admin = await requireAdmin()
  if (!admin.ok) return { data: [] }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('getAllCoursesForAdmin error:', error.message)
      return { data: [] }
    }
    return { data: (data as Course[]) || [] }
  } catch (err: any) {
    console.error('getAllCoursesForAdmin exception:', err.message)
    return { data: [] }
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

/** Fallback course art used when the admin does not supply a thumbnail. */
const DEFAULT_COURSE_THUMBNAIL =
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80'

export async function createCourse(courseData: Partial<Course>) {
  const admin = await requireAdmin()
  if (!admin.ok) return { success: false, error: admin.error }

  const user = await getSessionUser()

  const title = courseData.title?.trim()
  if (!title) {
    return { success: false, error: 'Please enter a course title.' }
  }

  // Slug is optional in the UI — derive it from the title when it is left blank.
  const slug = (courseData.slug?.trim() || slugifyTitle(title))
  if (!slug) {
    return { success: false, error: 'Could not build a URL slug from that title. Please enter one manually.' }
  }

  const price = Number(courseData.price) || 0

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('courses')
      .insert({
        title,
        slug,
        description: courseData.description?.trim() || '',
        thumbnail_url: courseData.thumbnail_url?.trim() || DEFAULT_COURSE_THUMBNAIL,
        price,
        is_free: price === 0,
        level: courseData.level || 'Beginner',
        duration_minutes: Number(courseData.duration_minutes) || 60,
        instructor_name: courseData.instructor_name?.trim() || user?.full_name || 'SomSkool',
        instructor_avatar:
          courseData.instructor_avatar ||
          'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(user?.full_name || 'SomSkool'),
        is_published: true
      })

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/courses')
    revalidatePath('/')
    return { success: true, slug }
  } catch (err: any) {
    const message: string = err?.message || 'Could not create the course.'

    // Duplicate slug is by far the most common failure — say so in plain English
    // instead of leaking the Postgres unique-constraint text.
    if (/duplicate key|already exists|unique constraint/i.test(message)) {
      return {
        success: false,
        error: `A course with the URL slug “${slug}” already exists. Please choose a different title or slug.`,
      }
    }

    return { success: false, error: message }
  }
}

export async function deleteCourse(id: string) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') return { error: 'Unauthorized' }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/courses')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function toggleCoursePublish(id: string, isPublished: boolean) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') return { error: 'Unauthorized' }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('courses')
      .update({ is_published: isPublished })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/courses')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/**
 * Fetch dynamic roles
 */
export async function getRoles() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) return { data: [] }
    return { data: data || [] }
  } catch {
    return { data: [] }
  }
}

/**
 * Create a new role
 */
export async function createRole(name: string) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Admin only' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('roles')
      .insert({ name })

    if (error) return { error: error.message }
    
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

/**
 * Delete a role
 */
export async function deleteRole(id: string) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Admin only' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id)

    if (error) return { error: error.message }
    
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

/**
 * Regenerate a staff member's password
 */
export async function regenerateStaffPassword(userId: string) {
  const admin = await requireAdmin()
  if (!admin.ok) return { error: admin.error }

  try {
    const adminAuthClient = createAdminClient()

    // Math.random() is not cryptographically secure and must not be used to mint
    // credentials — use the platform CSPRNG instead.
    const newPassword = generateStrongPassword()

    // Update user password via Admin API
    const { error: updateError } = await adminAuthClient.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    )

    if (updateError) return { error: updateError.message }

    return { success: true, newPassword }
  } catch (err: any) {
    return { error: err.message }
  }
}

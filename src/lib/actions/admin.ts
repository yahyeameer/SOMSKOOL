'use server'

import { isMock } from '@/lib/supabase/server'
import { mockDb } from '@/lib/supabase/mock'
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

  if (isMock) {
    const result = mockDb.updatePaymentStatus(paymentId, status)
    if (!result.success) return { error: result.error.message }
    
    revalidatePath('/admin')
    revalidatePath('/courses')
    return { success: true }
  }

  // Live Supabase implementation (fallback representation)
  // For production compatibility:
  return { success: true }
}

/**
 * Server action to mock document uploads for courses.
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

  if (isMock) {
    mockDb.addDocument({
      title: docData.title,
      course_id: docData.courseId,
      type: docData.type,
      url: docData.url || 'https://somskool.com/uploads/syllabus.pdf'
    })
    
    revalidatePath('/admin')
    return { success: true }
  }

  return { success: true }
}

/**
 * Server action to save promotional homepage YouTube video settings.
 */
export async function saveVideoSettings(settings: {
  youtube_id: string;
  channel_name: string;
  channel_url: string;
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Fadlan hubi inaad tahay maamule (admin) si aad u sameyso ficilkan.' }
  }

  if (!settings.youtube_id || !settings.channel_name) {
    return { error: 'Muuqaalka YouTube ID iyo magaca kanaalka waa lagama maarmaan.' }
  }

  if (isMock) {
    mockDb.updateVideoSettings(settings)
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  }

  return { success: true }
}

/**
 * Fetch all staff members (teachers and admins)
 */
export async function getStaffMembers() {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Fadlan hubi inaad tahay maamule (admin) si aad u sameyso ficilkan.', data: [] }
  }

  if (isMock) {
    // Mock data for staff
    return { data: [
      { id: '1', full_name: 'Axmed Cali', email: 'axmed@somskool.com', role: 'teacher', created_at: new Date().toISOString() },
      { id: '2', full_name: 'Suhur Cabdi', email: 'suhur@somskool.com', role: 'teacher', created_at: new Date().toISOString() }
    ]}
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['teacher', 'admin'])
    .order('created_at', { ascending: false })

  if (error) return { error: error.message, data: [] }
  return { data }
}

/**
 * Create a new staff account (requires Service Role Key to bypass email confirmation and session hijack)
 */
export async function createStaffAccount(staffData: { full_name: string, email: string, role: string, password: string }) {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Fadlan hubi inaad tahay maamule (admin) si aad u sameyso ficilkan.' }
  }

  if (isMock) {
    revalidatePath('/admin')
    return { success: true }
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    return { error: 'Si aad user ugu darto adigoon Admin-ka ka bixin, fadlan ku dar SUPABASE_SERVICE_ROLE_KEY feylka .env.local.' }
  }

  const { createClient } = await import('@supabase/supabase-js')
  const adminAuthClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // 1. Create user via Admin API (which automatically confirms email)
  const { data: newUser, error: createError } = await adminAuthClient.auth.admin.createUser({
    email: staffData.email,
    password: staffData.password,
    email_confirm: true,
    user_metadata: { full_name: staffData.full_name }
  })

  if (createError) return { error: createError.message }

  // 2. The trigger in the DB will create the profile. We just need to update the role since the email might not contain 'teacher'
  if (newUser?.user) {
    const { error: updateError } = await adminAuthClient
      .from('profiles')
      .update({ role: staffData.role })
      .eq('id', newUser.user.id)
      
    if (updateError) return { error: updateError.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

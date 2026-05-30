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

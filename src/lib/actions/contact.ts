'use server'

import { createClient, isMock } from '@/lib/supabase/server'
import { mockDb } from '@/lib/supabase/mock'
import { revalidatePath } from 'next/cache'

export async function submitContactMessage(formData: {
  fullName: string;
  email: string;
  subject?: string;
  message: string;
}) {
  if (!formData.fullName || !formData.email || !formData.message) {
    return { error: 'Fadlan wada buuxi dhamaan meelaha lagama maarmaanka ah.' }
  }

  if (isMock) {
    try {
      mockDb.addContactMessage({
        full_name: formData.fullName,
        email: formData.email,
        subject: formData.subject || '',
        message: formData.message,
      });
      revalidatePath('/contact')
      return { success: true }
    } catch (e: any) {
      return { error: e.message }
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('contact_messages').insert({
    full_name: formData.fullName,
    email: formData.email,
    subject: formData.subject || '',
    message: formData.message,
  })

  if (error) return { error: error.message }

  revalidatePath('/contact')
  return { success: true }
}

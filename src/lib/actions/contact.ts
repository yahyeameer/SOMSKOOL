'use server'

import { createClient } from '@/lib/supabase/server'
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

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('contact_messages').insert({
      full_name: formData.fullName,
      email: formData.email,
      subject: formData.subject || '',
      message: formData.message,
    })

    if (error) {
      console.error('Error submitting contact message:', error.message)
      return { error: error.message }
    }

    revalidatePath('/contact')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to submit message.' }
  }
}

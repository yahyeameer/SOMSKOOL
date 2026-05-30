'use server'

import { createClient, isMock } from '@/lib/supabase/server'
import { mockDb } from '@/lib/supabase/mock'
import { getSessionUser } from './auth'
import { revalidatePath } from 'next/cache'

export async function submitPayment(formData: {
  courseId: string;
  fullName: string;
  email: string;
  phone: string;
  method: 'zaad' | 'edahab' | 'evc_plus' | 'golis';
  reference: string;
  amount: number;
}) {
  const user = await getSessionUser()
  if (!user) return { error: 'Fadlan ku laabo login oo soo kirayso koorsada mar kale.' }

  if (isMock) {
    try {
      mockDb.addPayment({
        student_id: user.id,
        course_id: formData.courseId,
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phone,
        payment_method: formData.method,
        transaction_reference: formData.reference,
        amount: formData.amount,
        status: 'pending'
      });
      revalidatePath('/courses')
      revalidatePath(`/payment`)
      return { success: true }
    } catch (e: any) {
      return { error: e.message }
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('payments').insert({
    student_id: user.id,
    course_id: formData.courseId,
    full_name: formData.fullName,
    email: formData.email,
    phone_number: formData.phone,
    payment_method: formData.method,
    transaction_reference: formData.reference,
    amount: formData.amount,
    status: 'pending'
  })

  if (error) return { error: error.message }
  
  revalidatePath('/courses')
  return { success: true }
}

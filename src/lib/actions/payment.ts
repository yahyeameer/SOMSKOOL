'use server'

import { createClient } from '@/lib/supabase/server'
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

  if (!formData.phone?.trim() || !formData.reference?.trim()) {
    return { error: 'Fadlan geli lambarkaaga iyo lambarka xawilaadda (transaction ID).' }
  }

  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    // Never trust the client-supplied identity or amount — resolve both server side.
    const studentId = authUser?.id || user.id
    const studentEmail = authUser?.email || formData.email || 'barte@somskool.com'

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price, is_free')
      .eq('id', formData.courseId)
      .single()

    if (courseError || !course) {
      return { error: 'Koorsadan lama helin. Fadlan isku day mar kale.' }
    }

    if (course.is_free) {
      return { error: 'Koorsadani waa bilaash — uma baahnid inaad wax bixiso.' }
    }

    // Block a second request while one is already awaiting review.
    const { data: pending } = await supabase
      .from('payments')
      .select('id')
      .eq('student_id', studentId)
      .eq('course_id', course.id)
      .eq('status', 'pending')
      .maybeSingle()

    if (pending) {
      return { error: 'Codsi lacag-bixineed ayaa horey loogu diray koorsadan, wuxuuna sugayaa ansixin.' }
    }

    const { error } = await supabase.from('payments').insert({
      student_id: studentId,
      course_id: course.id,
      full_name: formData.fullName,
      email: studentEmail,
      phone_number: formData.phone.trim(),
      payment_method: formData.method,
      transaction_reference: formData.reference.trim(),
      // Authoritative price from the database, not the number the browser sent.
      amount: course.price,
      status: 'pending'
    })

    if (error) return { error: error.message }

    revalidatePath('/courses')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Payment submission failed.' }
  }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { getSessionUser } from './auth'
import { Course } from '@/types'

export async function getCourses(filters?: {
  category?: string;
  level?: string;
  price?: string;
  q?: string;
}) {
  try {
    const supabase = await createClient()
    let query = supabase.from('courses').select('*').eq('is_published', true)

    if (filters?.level && filters.level !== 'all') {
      query = query.eq('level', filters.level)
    }
    if (filters?.price === 'free') {
      query = query.eq('is_free', true)
    } else if (filters?.price === 'paid') {
      query = query.eq('is_free', false)
    }
    if (filters?.q) {
      query = query.ilike('title', `%${filters.q}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching courses:', error.message)
      return { data: [], error: error.message }
    }

    return { data: (data as Course[]) || [], error: null }
  } catch (err: any) {
    console.error('getCourses exception:', err.message)
    return { data: [], error: err.message }
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data: data as Course, error: null }
  } catch (err: any) {
    return { data: null, error: { message: err.message } }
  }
}

export async function isCourseEnrolled(courseId: string) {
  const user = await getSessionUser();
  if (!user) return false;

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle()

    return !!data;
  } catch {
    return false;
  }
}

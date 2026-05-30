'use server'

import { createClient, isMock } from '@/lib/supabase/server'
import { mockDb } from '@/lib/supabase/mock'
import { getSessionUser } from './auth'
import { Course } from '@/types'

export async function getCourses(filters?: {
  category?: string;
  level?: string;
  price?: string;
  q?: string;
}) {
  if (isMock) {
    let list = mockDb.getCourses();
    
    if (filters?.level && filters.level !== 'all') {
      list = list.filter(c => c.level.toLowerCase() === filters.level!.toLowerCase());
    }
    
    if (filters?.category && filters.category !== 'all') {
      list = list.filter(c => c.category_slug === filters.category);
    }
    
    if (filters?.price === 'free') {
      list = list.filter(c => c.is_free);
    } else if (filters?.price === 'paid') {
      list = list.filter(c => !c.is_free);
    }
    
    if (filters?.q) {
      const search = filters.q.toLowerCase();
      list = list.filter(c => 
        c.title.toLowerCase().includes(search) || 
        c.description?.toLowerCase().includes(search)
      );
    }
    
    return { data: list, error: null };
  }

  const supabase = await createClient()
  let query = supabase.from('courses').select('*').eq('is_published', true)

  if (filters?.level && filters.level !== 'all') {
    query = query.eq('level', filters.level)
  }
  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category_slug', filters.category)
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

  return { data: data as Course[] || [], error }
}

export async function getCourseBySlug(slug: string) {
  if (isMock) {
    const course = mockDb.getCourseBySlug(slug);
    return { data: course || null, error: course ? null : { message: 'Course not found' } };
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single()

  return { data: data as Course || null, error }
}

export async function isCourseEnrolled(courseId: string) {
  const user = await getSessionUser();
  if (!user) return false;

  if (isMock) {
    return mockDb.isEnrolled(user.id, courseId);
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('student_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle()

  return !!data;
}

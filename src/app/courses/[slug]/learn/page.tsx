import React from 'react'
import { getCourseBySlug, isCourseEnrolled } from '@/lib/actions/courses'
import { getCourseVideos, getStudentProgress } from '@/lib/actions/learning'
import { getSessionUser } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LearningClient from '@/components/LearningClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function LearnPage({ params }: PageProps) {
  // Await the params in Next.js 15
  const resolvedParams = await params

  // 1. Verify User Session
  const user = await getSessionUser()
  if (!user) {
    redirect(`/login?next=/courses/${resolvedParams.slug}/learn`)
  }

  // 2. Fetch Course
  const { data: course } = await getCourseBySlug(resolvedParams.slug)
  if (!course) {
    redirect('/courses')
  }

  // 3. Verify Enrollment or Admin Access
  const isEnrolled = await isCourseEnrolled(course.id)
  if (!isEnrolled && user.role !== 'admin') {
    // Redirect to payment if not enrolled
    redirect(`/payment?courseId=${course.id}`)
  }

  // 4. Fetch Videos, Progress, and Documents
  const { data: videos = [] } = await getCourseVideos(course.id)
  const { data: progress = [] } = await getStudentProgress(course.id)
  
  const supabase = await createClient()
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('course_id', course.id)
    .order('created_at', { ascending: false })

  return (
    <LearningClient 
      course={course} 
      videos={videos || []} 
      progress={progress || []} 
      documents={documents || []}
    />
  )
}

import React from 'react'
import { getCourses } from '@/lib/actions/courses'
import CoursesPageClient from '@/components/CoursesPageClient'

interface PageProps {
  searchParams: Promise<{
    category?: string;
    level?: string;
    price?: string;
    q?: string;
  }>
}

export default async function CoursesPage({ searchParams }: PageProps) {
  // Await searchParams in Next.js 15
  const resolvedParams = await searchParams

  const { data: courses = [] } = await getCourses({
    category: resolvedParams.category,
    level: resolvedParams.level,
    price: resolvedParams.price,
    q: resolvedParams.q,
  })

  return (
    <CoursesPageClient courses={courses} />
  )
}

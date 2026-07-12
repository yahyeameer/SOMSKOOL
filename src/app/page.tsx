import React from 'react'
import { getCourses } from '@/lib/actions/courses'
import HomePageClient from '@/components/HomePageClient'

export const revalidate = 60

export default async function Home() {
  const { data: courses = [] } = await getCourses()

  return (
    <HomePageClient courses={courses} />
  )
}

import React from 'react'
import { getCourses } from '@/lib/actions/courses'
import { getVideoSettings } from '@/lib/actions/admin'
import HomePageClient from '@/components/HomePageClient'

export const revalidate = 60

export default async function Home() {
  const { data: courses = [] } = await getCourses()
  const videoSettings = await getVideoSettings()

  return (
    <HomePageClient courses={courses} videoSettings={videoSettings} />
  )
}

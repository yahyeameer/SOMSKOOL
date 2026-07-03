import React from 'react'
import { getPageSettings } from '@/lib/actions/admin'
import AboutClient from '@/components/AboutClient'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function AboutPage() {
  const settings = await getPageSettings()
  
  return (
    <AboutClient settings={settings} />
  )
}

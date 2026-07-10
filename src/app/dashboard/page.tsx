import React from 'react'
import { getStudentDashboardData } from '@/lib/actions/dashboard'
import { redirect } from 'next/navigation'
import StudentDashboard from '@/components/StudentDashboard'

export const metadata = {
  title: 'My Dashboard - SomSkool',
  description: 'View your courses, progress, and leaderboard ranking.',
}

export default async function DashboardPage() {
  const { data, error } = await getStudentDashboardData()

  if (error || !data) {
    redirect('/login?next=/dashboard')
  }

  // Double check that only students access this (admins should go to /admin)
  if (data.profile.role === 'admin') {
    redirect('/admin')
  }

  return <StudentDashboard data={data} />
}

import React from 'react'
import { getSessionUser } from '@/lib/actions/auth'
import { getCourses } from '@/lib/actions/courses'
import { getStaffMembers, getPayments, getDocuments, getVideoSettings, getAllCourseVideos } from '@/lib/actions/admin'
import { getAllStudents } from '@/lib/actions/users'
import { redirect } from 'next/navigation'
import AdminPanel from '@/components/AdminPanel'
import { Shield } from 'lucide-react'

export default async function AdminPage() {
  const user = await getSessionUser()

  if (!user || user.role !== 'admin') {
    redirect('/login?next=/admin')
  }

  const { data: courses = [] } = await getCourses()
  const { data: staff = [] } = await getStaffMembers()
  const { data: students = [] } = await getAllStudents()
  const payments = await getPayments()
  const documents = await getDocuments()
  const videoSettings = await getVideoSettings()
  const courseVideos = await getAllCourseVideos()

  return (
    <div className="flex flex-col w-full font-sans min-h-screen bg-background">
      {/* Admin Hero */}
      <section className="bg-brand-dark py-10 text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-primary/20 text-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/10">
              <Shield className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-white/60 text-sm font-medium">
                Ku soo dhawoow, <span className="text-brand-accent font-bold">{user.full_name}</span> — Maamulka SomSkool
              </p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(91,79,233,0.08),transparent)]" />
      </section>

      {/* Admin Console Panel */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        <AdminPanel
          payments={payments}
          documents={documents}
          courses={courses}
          courseVideos={courseVideos}
          videoSettings={videoSettings}
          initialStaff={staff || []}
          students={students || []}
        />
      </section>
    </div>
  )
}

'use client'

import React from 'react'
import FilterSidebar from '@/components/FilterSidebar'
import CourseCard from '@/components/CourseCard'
import { Course } from '@/types'
import { BookOpen } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CoursesPageClient({ courses }: { courses: Course[] }) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col w-full font-sans">
      {/* 📘 Page Header Banner */}
      <section className="bg-brand-primary py-16 text-center text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3 relative z-10">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            {t('courses_title')}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
            {t('courses_subtitle')}
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent)]" />
      </section>

      {/* 🛠️ Main Catalog Container */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Filter Sidebar Left (Client side URL router pushes) */}
          <FilterSidebar />

          {/* Grid Area Right */}
          <div className="flex-1 space-y-6 w-full">
            {/* Filter Results Info Row */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="text-sm font-bold text-gray-500 tracking-wide uppercase">
                {t('showing')}: <span className="text-brand-primary">{courses.length} {t('course_count')}</span>
              </span>
            </div>

            {/* Courses Catalog Grid */}
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-border rounded-2xl p-8 space-y-4">
                <div className="h-16 w-16 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-brand-dark">
                    {t('no_courses_found')}
                  </h3>
                  <p className="text-text-muted text-sm max-w-xs font-semibold leading-relaxed">
                    {t('no_courses_hint')}
                  </p>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </section>
    </div>
  )
}

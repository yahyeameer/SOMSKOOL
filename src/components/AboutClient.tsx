'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export default function AboutClient({ settings }: { settings: any }) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col w-full font-sans">
      {/* 🎓 About Hero Banner */}
      <section 
        className="py-16 text-center text-white relative overflow-hidden"
        style={{
          backgroundImage: settings.about_header_image ? `linear-gradient(rgba(91, 79, 233, 0.85), rgba(91, 79, 233, 0.95)), url(${settings.about_header_image})` : undefined,
          backgroundColor: settings.about_header_image ? undefined : 'var(--brand-primary)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3 relative z-10">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            {settings.about_title || 'About SomSkool'}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
            {settings.about_subtitle || 'Empowering the future through education'}
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.05),transparent)]" />
      </section>

      {/* 📄 About Content — single-column, text-only layout */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

        <div className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Halkani waa SomSkool
          </h2>
          <p className="text-gray-600 text-base leading-relaxed font-medium whitespace-pre-wrap">
            {settings.about_text}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-xl font-bold text-brand-dark">Diploma Programs</h3>
          <p className="text-gray-600 text-base leading-relaxed font-medium">
            We offer certified diploma programs designed to give students a recognised
            qualification and the practical skills employers are looking for.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-xl font-bold text-brand-dark">Top Courses</h3>
          <p className="text-gray-600 text-base leading-relaxed font-medium">
            Our strongest programs are in Computer Science and English Language, taught in a
            way that is clear, practical, and accessible to every student.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-xl font-bold text-brand-dark">Expert Instructors</h3>
          <p className="text-gray-600 text-base leading-relaxed font-medium">
            Every course is delivered by highly educated teachers with real experience in
            their field, so students learn from people who have done the work themselves.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-xl font-bold text-brand-dark">Our Campus</h3>
          <p className="text-gray-600 text-base leading-relaxed font-medium">
            SomSkool is located in the heart of Addis Ababa, Ethiopia, and serves students
            across the region both on campus and online.
          </p>
        </div>

        {/* Social Row */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {t('follow_social')}
          </h4>
          <div className="flex items-center gap-3">
            <a href="https://facebook.com/somskool" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-10 w-10 rounded-full bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary flex items-center justify-center transition-all">
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href="https://instagram.com/somskool" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-10 w-10 rounded-full bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary flex items-center justify-center transition-all">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com/company/somskool" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="h-10 w-10 rounded-full bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary flex items-center justify-center transition-all">
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

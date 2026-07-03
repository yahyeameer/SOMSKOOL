'use client'

import React from 'react'
import { MapPin, Mail, Phone, Clock, GraduationCap, Users, BookOpen } from 'lucide-react'
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

      {/* 🛠️ About Content Grid (Matches Contact Page Layout) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column — About Info */}
        <div className="space-y-10 text-left">
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-extrabold text-brand-dark">
              Halkani waa SomSkool
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-md whitespace-pre-wrap">
              {settings.about_text}
            </p>
          </div>

          {/* Info Cards (Matches Contact Page style but different content) */}
          <div className="space-y-5">
            <div className="flex items-start gap-4 bg-white border border-border rounded-xl p-5 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark">Diploma Programs</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">We offer certified diploma programs.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white border border-border rounded-xl p-5 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark">Top Courses</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Computer Science & English Language.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white border border-border rounded-xl p-5 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark">Expert Instructors</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Learn from highly educated teachers.</p>
              </div>
            </div>
          </div>

          {/* Social Row */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('follow_social')}
            </h4>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com/somskool" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary flex items-center justify-center transition-all">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/somskool" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary flex items-center justify-center transition-all">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/somskool" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary flex items-center justify-center transition-all">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column — Large Image or graphic */}
        <div className="flex flex-col justify-start">
          <div className="rounded-2xl overflow-hidden shadow-2xl relative h-full min-h-[400px]">
            <img 
              src={settings.about_header_image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"} 
              alt="Students learning at SomSkool" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white font-display text-2xl font-bold mb-2">Our Campus</h3>
              <p className="text-white/80 text-sm">Located in the heart of Addis Ababa, Ethiopia.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

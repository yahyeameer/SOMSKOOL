'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CourseCard from '@/components/CourseCard'
import { Course } from '@/types'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, CheckCircle, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface HomePageClientProps {
  courses: Course[];
  videoSettings: any;
}

export default function HomePageClient({ courses, videoSettings }: HomePageClientProps) {
  const { t } = useLanguage()

  const stats = [
    { value: '18+', label: t('expert_instructors') },
    { value: '75+', label: t('premium_courses') },
    { value: '8k+', label: t('active_students') },
    { value: '4.9/5', label: t('average_rating') },
  ]

  const testimonials = [
    {
      name: 'Emily R.',
      role: 'UI/UX Designer',
      text: 'SomSkool waxay iga caawisay inaan barto Figma iyo naqshadaynta UI/UX anigoo gurigayga jooga. Casharada waa kuwo aad u fudud oo qof kasta fahmi karo!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60'
    },
    {
      name: 'James L.',
      role: 'Software Engineer',
      text: 'Fursad weyn weeye in la helo koorsooyin heersare ah oo ku baxaya luuqada Soomaaliga. Waxaan ku bartay Next.js iyo horumarinta shabakadaha min bilaaw!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60'
    },
    {
      name: 'Sophia M.',
      role: 'Business Owner',
      text: 'Koorsooyinka Digital Marketing-ka waxay iga caawisay inaan ganacsigeyga u sameeyo growth weyn. Waxaan kula talinayaa qof kasta oo raba inuu kobco.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60'
    }
  ]

  return (
    <div className="flex flex-col w-full font-sans">
      {/* 🚀 HERO SECTION */}
      <section className="relative w-full bg-gradient-to-br from-brand-primary via-brand-primary-dark to-brand-dark overflow-hidden pt-12 pb-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column (55%) */}
          <div className="lg:col-span-7 space-y-8 flex flex-col items-start text-left">
            <Badge className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs shadow-sm transition-colors">
              <Star className="h-3.5 w-3.5 fill-brand-accent text-brand-accent" />
              {t('hero_badge')}
            </Badge>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              {t('hero_title_1')} <br />
              <span className="text-brand-accent">{t('hero_title_2')}</span>
            </h1>
            
            <p className="text-white/80 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
              {t('hero_subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link 
                href="/courses" 
                className="w-full sm:w-auto rounded-full bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 text-base shadow-lg shadow-white/5 transition-all cursor-pointer flex items-center justify-center text-center"
              >
                {t('start_learning')}
              </Link>
              <Link 
                href="/courses" 
                className="w-full sm:w-auto rounded-full border-2 border-white/30 text-white hover:bg-white/10 hover:border-white font-bold px-8 py-4 text-base transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                {t('explore_courses')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Avatar Stack */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
              <div className="flex -space-x-3 overflow-hidden">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=60',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
                ].map((avatar, idx) => (
                  <div key={idx} className="relative h-10 w-10 rounded-full border-2 border-brand-primary overflow-hidden">
                    <Image src={avatar} alt="Student avatar" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-white/90 text-sm font-semibold">
                +2,400 <span className="text-brand-accent font-bold">{t('join_students')}</span>
              </span>
            </div>
          </div>

          {/* Right Column (45%) — Hero Image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-sm group">
              <Image
                src="/hero_image_realistic.png"
                alt="SomSkool Academy Professional Illustration"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent pointer-events-none" />
            </div>

            {/* Floating completed Course toast */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-card rounded-2xl shadow-2xl p-4 border border-gray-100 dark:border-white/10 flex items-center gap-3.5 rotate-[-2deg] hover-lift hover:rotate-0 z-20">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner">
                <CheckCircle className="h-7 w-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 leading-tight">{t('completed')}</span>
                <span className="text-sm font-extrabold text-brand-dark leading-tight mt-0.5">
                  UI/UX Design Masterclass
                </span>
                <span className="text-[10px] text-emerald-500 font-bold mt-0.5">{t('certificate_awarded')}</span>
              </div>
            </div>
          </div>
          
        </div>

        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-white/[0.03] to-transparent pointer-events-none transform skew-x-[-12deg]" />
      </section>



      {/* 📚 RECENT COURSES SECTION */}
      <section className="w-full py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">
                {t('new_courses_label')}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-dark">
                {t('recent_courses')}
              </h2>
            </div>
            
            <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition-all group">
              <span>{t('view_all')}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* 🌟 TESTIMONIALS SECTION */}
      <section className="w-full py-24 bg-gray-50/70 border-t border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">
              {t('student_success')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-dark">
              {t('what_students_say')}
            </h2>
            <p className="text-text-muted text-base font-semibold leading-relaxed">
              {t('testimonials_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div key={idx} className="relative bg-card rounded-2xl border border-border shadow-sm hover-lift p-8 space-y-6 flex flex-col justify-between">
                <span className="absolute top-4 right-6 text-brand-primary/5 text-8xl font-serif leading-none select-none pointer-events-none">
                  “
                </span>
                <div className="flex items-center gap-1 text-brand-accent">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand-accent" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic font-medium flex-1">
                  &ldquo;{test.text}&rdquo;
                </p>
                <div className="flex items-center gap-3.5 pt-4 border-t border-gray-50">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-100">
                    <Image src={test.avatar} alt={test.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-extrabold text-brand-dark">
                      {test.name}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      {test.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

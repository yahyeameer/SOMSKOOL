'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CourseCard from '@/components/CourseCard'
import { Course } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Star, CheckCircle, ArrowRight, BookOpen, Users, Award, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// ─── Custom Hooks ──────────────────────────────────────────

/** Respects prefers-reduced-motion */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

/** IntersectionObserver-based scroll reveal */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    // Observe the container and all children with scroll-hidden classes
    const children = el.querySelectorAll(
      '.scroll-hidden, .scroll-hidden-left, .scroll-hidden-right, .scroll-hidden-scale'
    )
    children.forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [threshold])
  return ref
}

/** Animated counter from 0 → target */
function useCountUp(target: number, duration = 2000, trigger = false): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(eased * target)
      setValue(current)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, trigger])
  return value
}

/** Parallax scroll offset */
function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.innerHeight - rect.top
      setOffset(scrolled * speed)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])
  return { ref, offset }
}

/** Magnetic hover effect — element subtly follows cursor */
function useMagneticHover(strength = 5) {
  const ref = useRef<HTMLAnchorElement>(null)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      ref.current.style.transform = `translate(${x / strength}px, ${y / strength}px)`
    },
    [strength]
  )
  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'translate(0, 0)'
      ref.current.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }
  }, [])
  const handleMouseEnter = useCallback(() => {
    if (ref.current) ref.current.style.transition = 'transform 0.1s ease-out'
  }, [])
  return { ref, handleMouseMove, handleMouseLeave, handleMouseEnter }
}

/** 3D tilt for cards */
function useTilt3D(maxDeg = 6) {
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget.querySelector('.tilt-card-inner') as HTMLElement
      if (!el) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg) scale(1.02)`
    },
    [maxDeg]
  )
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget.querySelector('.tilt-card-inner') as HTMLElement
    if (el) el.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)'
  }, [])
  return { handleMouseMove, handleMouseLeave }
}

// ─── Stat Counter Component ──────────────────────────────────

function AnimatedStat({
  icon: Icon,
  target,
  suffix,
  label,
  trigger,
  delay,
}: {
  icon: React.ElementType
  target: number
  suffix: string
  label: string
  trigger: boolean
  delay: number
}) {
  const count = useCountUp(target, 2000, trigger)
  return (
    <div
      className="scroll-hidden flex flex-col items-center gap-2 p-6 group"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300 border border-white/10">
        <Icon className="h-6 w-6 text-brand-accent" />
      </div>
      <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
        {count}{suffix}
      </span>
      <span className="text-white/60 text-xs sm:text-sm font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────

interface HomePageClientProps {
  courses: Course[];
}

export default function HomePageClient({ courses }: HomePageClientProps) {
  const { t } = useLanguage()
  const reducedMotion = useReducedMotion()

  // Scroll reveal refs for each section
  const heroRef = useScrollReveal(0.1)
  const statsRef = useScrollReveal(0.2)
  const coursesRef = useScrollReveal(0.1)
  const testimonialsRef = useScrollReveal(0.1)

  // Parallax for hero image
  const { ref: parallaxRef, offset: parallaxOffset } = useParallax(0.15)

  // Magnetic CTA button
  const magneticCTA = useMagneticHover(8)

  // 3D tilt for course cards
  const tilt = useTilt3D(5)

  // Stats counter trigger
  const [statsVisible, setStatsVisible] = useState(false)
  const statsObserverRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = statsObserverRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Hero entrance stagger state
  const [heroLoaded, setHeroLoaded] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

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
    <div className="flex flex-col w-full font-sans overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          🚀 HERO SECTION — Staggered entrance + floating blobs
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-gradient-to-br from-brand-primary via-brand-primary-dark to-brand-dark overflow-hidden pt-12 pb-24 md:py-32">

        {/* Animated morphing blob decorations */}
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-brand-accent/[0.07] animate-morph-blob pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-8%] w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] bg-white/[0.04] animate-morph-blob pointer-events-none" style={{ animationDelay: '5s', animationDirection: 'reverse' }} />
        <div className="absolute top-[30%] right-[20%] w-[20vw] h-[20vw] max-w-[250px] max-h-[250px] bg-brand-primary/[0.08] animate-morph-blob pointer-events-none" style={{ animationDelay: '10s' }} />

        <div ref={heroRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8 flex flex-col items-start text-left">

            {/* Badge — shimmer effect */}
            <div
              className={`transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '0ms' }}
            >
              <Badge className="relative overflow-hidden bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs shadow-sm transition-colors cursor-default">
                <Star className="h-3.5 w-3.5 fill-brand-accent text-brand-accent" />
                {t('hero_badge')}
                {/* Shimmer overlay */}
                <span className="absolute inset-0 animate-shimmer rounded-full pointer-events-none" />
              </Badge>
            </div>

            {/* Title — stagger delay 150ms */}
            <div
              className={`transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '150ms' }}
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                {t('hero_title_1')} <br />
                <span
                  className="bg-gradient-to-r from-brand-accent via-yellow-300 to-brand-accent bg-clip-text text-transparent animate-text-gradient-sweep"
                  style={{ backgroundSize: '200% auto' }}
                >
                  {t('hero_title_2')}
                </span>
              </h1>
            </div>

            {/* Subtitle — stagger delay 300ms */}
            <div
              className={`transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '300ms' }}
            >
              <p className="text-white/80 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
                {t('hero_subtitle')}
              </p>
            </div>

            {/* CTA Buttons — stagger delay 450ms */}
            <div
              className={`flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '450ms' }}
            >
              {/* Primary CTA — magnetic + glow */}
              <Link
                ref={magneticCTA.ref}
                href="/courses"
                className="w-full sm:w-auto rounded-full bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 text-base shadow-lg shadow-white/5 transition-all cursor-pointer flex items-center justify-center text-center animate-glow-pulse"
                onMouseMove={magneticCTA.handleMouseMove}
                onMouseLeave={magneticCTA.handleMouseLeave}
                onMouseEnter={magneticCTA.handleMouseEnter}
                style={{ willChange: 'transform' }}
              >
                {t('start_learning')}
              </Link>
              <Link
                href="/courses"
                className="w-full sm:w-auto rounded-full border-2 border-white/30 text-white hover:bg-white/10 hover:border-white font-bold px-8 py-4 text-base transition-all cursor-pointer flex items-center justify-center gap-2 text-center group"
              >
                {t('explore_courses')}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>

            {/* Avatar Stack — stagger delay 600ms */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center gap-4 pt-4 transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="flex -space-x-3 overflow-hidden">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=60',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
                ].map((avatar, idx) => (
                  <div
                    key={idx}
                    className="relative h-10 w-10 rounded-full border-2 border-brand-primary overflow-hidden hover:scale-110 hover:z-10 transition-transform duration-300 cursor-pointer"
                    style={{ transitionDelay: `${idx * 80}ms` }}
                  >
                    <Image src={avatar} alt="Student avatar" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-white/90 text-sm font-semibold">
                +2,400 <span className="text-brand-accent font-bold">{t('join_students')}</span>
              </span>
            </div>
          </div>

          {/* Right Column — Hero Image with parallax + float */}
          <div ref={parallaxRef} className="lg:col-span-5 relative flex items-center justify-center">
            {/* Main Image */}
            <div
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-sm group"
              style={{
                transform: reducedMotion ? 'none' : `translateY(${-parallaxOffset}px)`,
                transition: 'transform 0.1s linear',
              }}
            >
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

            {/* Floating completed Course toast — continuous float */}
            <div
              className={`absolute -bottom-2 -left-2 md:-bottom-6 md:-left-6 max-w-[200px] md:max-w-none bg-white dark:bg-card rounded-xl md:rounded-2xl shadow-2xl p-3 md:p-4 border border-gray-100 dark:border-white/10 flex items-center gap-2 md:gap-3.5 z-20 cursor-default ${reducedMotion ? '' : 'animate-float'}`}
              style={reducedMotion ? {} : { animationDelay: '1s' }}
            >
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner shrink-0">
                <CheckCircle className="h-5 w-5 md:h-7 md:w-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold text-gray-400 leading-tight">{t('completed')}</span>
                <span className="text-xs md:text-sm font-extrabold text-brand-dark leading-tight mt-0.5 truncate">
                  UI/UX Design Masterclass
                </span>
                <span className="text-[9px] md:text-[10px] text-emerald-500 font-bold mt-0.5">{t('certificate_awarded')}</span>
              </div>
            </div>

            {/* NEW: Small floating badge top-right */}
            <div
              className={`absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-brand-accent text-white rounded-lg md:rounded-xl shadow-lg px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold z-20 ${reducedMotion ? '' : 'animate-float-slow'}`}
              style={reducedMotion ? {} : { animationDelay: '2s' }}
            >
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Trending
              </span>
            </div>
          </div>

        </div>

        {/* Existing decorative diagonal */}
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-white/[0.03] to-transparent pointer-events-none transform skew-x-[-12deg]" />
      </section>


      {/* ═══════════════════════════════════════════════════════════
          📊 STATS BAR — Animated count-up numbers
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-brand-dark border-t border-white/5" ref={statsObserverRef}>
        <div ref={statsRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-x divide-white/10">
            <AnimatedStat
              icon={Users}
              target={18}
              suffix="+"
              label={t('expert_instructors')}
              trigger={statsVisible}
              delay={0}
            />
            <AnimatedStat
              icon={BookOpen}
              target={75}
              suffix="+"
              label={t('premium_courses')}
              trigger={statsVisible}
              delay={150}
            />
            <AnimatedStat
              icon={TrendingUp}
              target={8}
              suffix="k+"
              label={t('active_students')}
              trigger={statsVisible}
              delay={300}
            />
            <AnimatedStat
              icon={Award}
              target={4}
              suffix=".9/5"
              label={t('average_rating')}
              trigger={statsVisible}
              delay={450}
            />
          </div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════════════════════
          📚 RECENT COURSES — 3D tilt + scroll reveal
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-background">
        <div ref={coursesRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 text-left scroll-hidden" style={{ transitionDelay: '0ms' }}>
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">
                {t('new_courses_label')}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-dark">
                {t('recent_courses')}
              </h2>
            </div>

            <Link
              href="/courses"
              className="scroll-hidden inline-flex items-center gap-1.5 text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition-all group"
              style={{ transitionDelay: '100ms' }}
            >
              <span>{t('view_all')}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course, idx) => (
              <div
                key={course.id}
                className="tilt-card scroll-hidden-scale"
                style={{ transitionDelay: `${idx * 150}ms` }}
                onMouseMove={reducedMotion ? undefined : tilt.handleMouseMove}
                onMouseLeave={reducedMotion ? undefined : tilt.handleMouseLeave}
              >
                <div className="tilt-card-inner">
                  <CourseCard course={course} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          🌟 TESTIMONIALS — Stagger + star animation
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-gray-50/70 border-t border-b border-gray-100">
        <div ref={testimonialsRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="scroll-hidden text-xs font-extrabold uppercase tracking-widest text-brand-primary" style={{ transitionDelay: '0ms' }}>
              {t('student_success')}
            </span>
            <h2 className="scroll-hidden font-display text-3xl sm:text-4xl font-extrabold text-brand-dark" style={{ transitionDelay: '100ms' }}>
              {t('what_students_say')}
            </h2>
            <p className="scroll-hidden text-text-muted text-base font-semibold leading-relaxed" style={{ transitionDelay: '200ms' }}>
              {t('testimonials_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => {
              const direction = idx === 0 ? 'scroll-hidden-left' : idx === 2 ? 'scroll-hidden-right' : 'scroll-hidden'
              return (
                <div
                  key={idx}
                  className={`relative bg-card rounded-2xl border border-border shadow-sm p-8 space-y-6 flex flex-col justify-between hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-500 cursor-default group ${direction}`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {/* Animated quote mark */}
                  <span className="absolute top-4 right-6 text-brand-primary/5 text-8xl font-serif leading-none select-none pointer-events-none group-hover:text-brand-primary/10 transition-colors duration-700">
                    &ldquo;
                  </span>

                  {/* Animated star ratings */}
                  <div className="flex items-center gap-1 text-brand-accent">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-brand-accent opacity-0 animate-star-pop"
                        style={{ animationDelay: `${(idx * 150) + (i * 100) + 400}ms` }}
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed italic font-medium flex-1">
                    &ldquo;{test.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3.5 pt-4 border-t border-gray-50">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-100 group-hover:scale-110 transition-transform duration-300">
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

                  {/* Subtle border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:animate-border-glow pointer-events-none" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}

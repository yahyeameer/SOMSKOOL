import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CourseCard from '@/components/CourseCard'
import VideoModal from '@/components/VideoModal'
import { getCourses } from '@/lib/actions/courses'
import { mockDb } from '@/lib/supabase/mock'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, CheckCircle, ArrowRight, Shield, Award, Users, BookOpen } from 'lucide-react'

// Enable 60-second ISR
export const revalidate = 60

export default async function Home() {
  // Fetch trending courses
  const { data: courses = [] } = await getCourses()
  
  // Fetch video settings for hero
  const videoSettings = mockDb.getVideoSettings()

  const stats = [
    { value: '18+', label: 'Expert Instructors' },
    { value: '75+', label: 'Premium Courses' },
    { value: '8k+', label: 'Active Students' },
    { value: '4.9/5', label: 'Average Rating' },
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
      <section className="relative w-full bg-brand-primary overflow-hidden pt-12 pb-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column (55%) */}
          <div className="lg:col-span-7 space-y-8 flex flex-col items-start text-left">
            <Badge className="bg-white/10 hover:bg-white/10 text-white border border-white/20 font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs shadow-sm">
              <Star className="h-3.5 w-3.5 fill-brand-accent text-brand-accent" />
              #1 Learning Platform in Somalia
            </Badge>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Learn Without <br />
              <span className="text-brand-accent">Limits.</span>
            </h1>
            
            <p className="text-white/80 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
              Ku dhis mustaqbalkaaga koorsooyin xirfadeed oo ay diyaariyeen khubaro caalami ah, kuna baxaya luuqadaada hooyo ee Soomaaliga. Baro Web Dev, UI/UX, iyo waxyaabo kale.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link 
                href="/courses" 
                className="w-full sm:w-auto rounded-full bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 text-base shadow-lg shadow-white/5 transition-all cursor-pointer flex items-center justify-center text-center"
              >
                Start Learning
              </Link>
              <Link 
                href="/courses" 
                className="w-full sm:w-auto rounded-full border-2 border-white/30 text-white hover:bg-white/10 hover:border-white font-bold px-8 py-4 text-base transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                Explore Courses
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
                Join <span className="text-brand-accent font-bold">+2,400</span> active Somali students!
              </span>
            </div>
          </div>

          {/* Right Column (45%) — Video Preview */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Video Thumbnail with Play */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              {/* YouTube thumbnail image */}
              <Image
                src={`https://img.youtube.com/vi/${videoSettings.youtube_id}/maxresdefault.jpg`}
                alt="SomSkool promotional video"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
              
              {/* Dark overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Play Button centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoModal youtubeId={videoSettings.youtube_id} channelName={videoSettings.channel_name} />
              </div>
              
              {/* Bottom info bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white/90 text-xs font-bold">Watch Intro</span>
                </div>
                <span className="text-white/60 text-xs font-semibold">{videoSettings.channel_name}</span>
              </div>
            </div>

            {/* Floating completed Course toast */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 flex items-center gap-3.5 rotate-[-2deg] transition-transform duration-300 hover:rotate-0">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner">
                <CheckCircle className="h-7 w-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 leading-tight">Dhamaystiray</span>
                <span className="text-sm font-extrabold text-brand-dark leading-tight mt-0.5">
                  UI/UX Design Masterclass
                </span>
                <span className="text-[10px] text-emerald-500 font-bold mt-0.5">Sertifiko la siiyey</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Diagonal background decorations */}
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-white/[0.03] to-transparent pointer-events-none transform skew-x-[-12deg]" />
      </section>

      {/* 📊 STATS BAR */}
      <section className="w-full bg-white py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-4xl sm:text-5xl font-extrabold text-brand-primary font-display">
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-gray-500 tracking-wide uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📚 RECENT COURSES SECTION */}
      <section className="w-full py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">
                Koorsooyinka Cusub
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-dark">
                Recent Premium Courses
              </h2>
            </div>
            
            <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition-all group">
              <span>Muuqi Dhamaan</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Grid Layout of Course Cards */}
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
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">
              Guusha Barteyaasha
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-dark">
              What Our Students Say
            </h2>
            <p className="text-text-muted text-base font-semibold leading-relaxed">
              Akhri sheekooyinka guusha iyo faallooyinka ay ardaydii hore ee SomSkool ka baxiyeen casharadeena.
            </p>
          </div>

          {/* Grid Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div key={idx} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 flex flex-col justify-between">
                {/* Top Quote Icon decoration */}
                <span className="absolute top-4 right-6 text-brand-primary/5 text-8xl font-serif leading-none select-none pointer-events-none">
                  “
                </span>

                {/* Stars */}
                <div className="flex items-center gap-1 text-brand-accent">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand-accent" />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-gray-600 text-sm leading-relaxed italic font-medium flex-1">
                  &ldquo;{test.text}&rdquo;
                </p>

                {/* Profile info */}
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

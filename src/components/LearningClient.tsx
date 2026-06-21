'use client'

import React, { useState, useTransition } from 'react'
import { Course, CourseVideo, StudentProgress } from '@/types'
import { markVideoCompleted } from '@/lib/actions/learning'
import { CheckCircle2, PlayCircle, Loader2, Trophy, ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'

interface LearningClientProps {
  course: Course
  videos: CourseVideo[]
  progress: StudentProgress[]
}

export default function LearningClient({ course, videos, progress: initialProgress }: LearningClientProps) {
  const [progress, setProgress] = useState<StudentProgress[]>(initialProgress)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const activeVideo = videos[activeVideoIndex]

  // A video is locked if it's not the first video and the previous video hasn't been completed
  const isVideoLocked = (index: number) => {
    if (index === 0) return false
    const previousVideo = videos[index - 1]
    return !progress.some(p => p.video_id === previousVideo.id)
  }

  const handleMarkCompleted = () => {
    if (!activeVideo) return
    
    startTransition(async () => {
      setMessage(null)
      const res = await markVideoCompleted(activeVideo.id, course.id, activeVideo.points_awarded)
      
      if (res.success) {
        if (res.message !== 'Already completed') {
          setMessage({ type: 'success', text: `Waxaad heshay +${activeVideo.points_awarded} dhibcood!` })
          setProgress(prev => [...prev, {
            id: 'temp-' + Math.random(),
            student_id: 'temp',
            video_id: activeVideo.id,
            course_id: course.id,
            completed_at: new Date().toISOString()
          }])
        }

        // Auto advance if next video exists and is not the last
        if (activeVideoIndex < videos.length - 1) {
          setTimeout(() => {
            setActiveVideoIndex(activeVideoIndex + 1)
            setMessage(null)
          }, 1500)
        }
      } else {
        setMessage({ type: 'error', text: res.error || 'Cilad ayaa dhacday' })
      }
    })
  }

  const completedCount = videos.filter(v => progress.some(p => p.video_id === v.id)).length
  const progressPercentage = videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <PlayCircle className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-500">Wali casharo laguma darin koorsadan.</h2>
        <Link href="/courses" className="mt-6 text-brand-primary font-bold hover:underline">
          &larr; Ku laabo Koorsooyinka
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-brand-dark text-white px-4 py-4 sm:px-6 lg:px-8 border-b border-white/10 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/courses" className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">{course.title}</h1>
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{progressPercentage}% Dhamaystiran</p>
          </div>
        </div>
        
        {/* Progress Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-3 w-64">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-emerald-400">{completedCount}/{videos.length}</span>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row">
        {/* Left: Video Player Area */}
        <div className="flex-1 lg:border-r border-gray-200 bg-white flex flex-col">
          <div className="w-full aspect-video bg-black relative">
            {activeVideo ? (
              <iframe
                key={activeVideo.id} // Forces iframe reload when video changes
                src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?modestbranding=1&rel=0&showinfo=0`}
                title={activeVideo.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                Dooro cashar
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 flex-1 max-w-4xl w-full mx-auto">
            {activeVideo && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-dark mb-2">
                    {activeVideo.order_index}. {activeVideo.title}
                  </h2>
                  <div className="flex items-center gap-2 text-brand-primary font-bold bg-brand-primary/10 inline-flex px-3 py-1.5 rounded-full text-sm">
                    <Trophy className="h-4 w-4" />
                    <span>+{activeVideo.points_awarded} Dhibcood</span>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm font-medium">
                    Markaad daawato muuqaalka, fadlan taabo badhanka si aad u hesho dhibcaha.
                  </p>
                  <button
                    onClick={handleMarkCompleted}
                    disabled={isPending || progress.some(p => p.video_id === activeVideo.id)}
                    className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${
                      progress.some(p => p.video_id === activeVideo.id)
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20 cursor-default'
                        : 'bg-brand-primary hover:bg-brand-primary-dark text-white shadow-brand-primary/20 hover:-translate-y-0.5'
                    }`}
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : progress.some(p => p.video_id === activeVideo.id) ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Waa La Daawaday
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Calaamadee in la daawaday
                      </>
                    )}
                  </button>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {message.text}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Curriculum Sidebar */}
        <div className="w-full lg:w-96 bg-gray-50 border-t lg:border-t-0 border-gray-200 flex flex-col h-[50vh] lg:h-[calc(100vh-73px)] sticky top-[73px]">
          <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h3 className="font-display font-extrabold text-lg text-brand-dark">Casharada Koorsada</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">Guji cashar si aad u daawato</p>
          </div>
          <div className="overflow-y-auto flex-1 p-4 space-y-2">
            {videos.map((video, index) => {
              const isCompleted = progress.some(p => p.video_id === video.id)
              const isLocked = isVideoLocked(index)
              const isActive = activeVideoIndex === index

              return (
                <button
                  key={video.id}
                  onClick={() => !isLocked && setActiveVideoIndex(index)}
                  disabled={isLocked}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    isActive 
                      ? 'bg-white border-brand-primary shadow-md shadow-brand-primary/5 ring-1 ring-brand-primary' 
                      : isLocked
                        ? 'bg-gray-100 border-gray-200 opacity-70 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:border-brand-primary/30 hover:shadow-sm cursor-pointer'
                  }`}
                >
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : isLocked ? (
                      <Lock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <PlayCircle className={`h-5 w-5 ${isActive ? 'text-brand-primary' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold ${isActive ? 'text-brand-primary' : isLocked ? 'text-gray-500' : 'text-brand-dark'}`}>
                      {index + 1}. {video.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wide">
                      {video.points_awarded} Dhibcood
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

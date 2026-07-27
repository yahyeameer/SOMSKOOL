'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { Course, CourseVideo, StudentProgress } from '@/types'
import { extractYoutubeId } from '@/lib/utils'
import { markVideoCompleted } from '@/lib/actions/learning'
import { 
  CheckCircle2, 
  PlayCircle, 
  Loader2, 
  Trophy, 
  ArrowLeft, 
  Lock, 
  FileText, 
  Download, 
  Info,
  Calendar,
  Layers,
  Award
} from 'lucide-react'
import Link from 'next/link'

interface LearningClientProps {
  course: Course
  videos: CourseVideo[]
  progress: StudentProgress[]
  documents?: any[]
}

export default function LearningClient({ 
  course, 
  videos, 
  progress: initialProgress, 
  documents = [] 
}: LearningClientProps) {
  const [progress, setProgress] = useState<StudentProgress[]>(initialProgress)
  const [activeTab, setActiveTab] = useState<'about' | 'resources'>('about')
  
  // Find the first unwatched video to resume learning
  const firstUnwatchedIndex = videos.findIndex(v => !initialProgress.some(p => p.video_id === v.id))
  const initialIndex = firstUnwatchedIndex >= 0 ? firstUnwatchedIndex : Math.max(0, videos.length - 1)
  
  const [activeVideoIndex, setActiveVideoIndex] = useState(initialIndex)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const activeVideo = videos[activeVideoIndex]
  const [canMarkCompleted, setCanMarkCompleted] = useState(false)

  // Reset completion check when video changes
  useEffect(() => {
    setCanMarkCompleted(false)
  }, [activeVideoIndex])

  useEffect(() => {
    if (!activeVideo) return

    // If already watched, no need to monitor
    const isCompleted = progress.some(p => p.video_id === activeVideo.id)
    if (isCompleted) {
      setCanMarkCompleted(true)
      return
    }

    let player: any
    let intervalId: any

    const initializePlayer = () => {
      try {
        player = new (window as any).YT.Player('youtube-player', {
          events: {
            onStateChange: (event: any) => {
              // 1 is PLAYING
              if (event.data === 1) {
                intervalId = setInterval(() => {
                  try {
                    const duration = player.getDuration()
                    const currentTime = player.getCurrentTime()
                    if (duration > 0 && (currentTime / duration) >= 0.8) {
                      setCanMarkCompleted(true)
                      clearInterval(intervalId)
                    }
                  } catch (e) {
                    // Fail-safe in case of API issues
                  }
                }, 1000)
              } else {
                if (intervalId) clearInterval(intervalId)
              }
            }
          }
        })
      } catch (e) {
        // Fail-safe: allow marking as completed if YT player fails to initialize
        setCanMarkCompleted(true)
      }
    }

    // Load YT Script if not loaded
    if (!(window as any).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      ;(window as any).onYouTubeIframeAPIReady = () => {
        initializePlayer()
      }
    } else {
      // Small timeout to ensure iframe is rendered before initializing
      const timeoutId = setTimeout(initializePlayer, 1000)
      return () => {
        clearTimeout(timeoutId)
        if (intervalId) clearInterval(intervalId)
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [activeVideoIndex, activeVideo, progress])

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
      const res = await markVideoCompleted(activeVideo.id, course.id)
      
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <PlayCircle className="h-16 w-16 text-slate-300 mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-slate-500">Wali casharo laguma darin koorsadan.</h2>
        <Link href="/courses" className="mt-6 bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-full shadow-sm text-sm">
          &larr; Ku laabo Koorsooyinka
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-indigo-950 text-white px-4 py-4 sm:px-6 lg:px-8 border-b border-indigo-900 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display font-extrabold text-base sm:text-lg leading-tight truncate max-w-[280px] sm:max-w-md">{course.title}</h1>
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider">{progressPercentage}% Dhamaystiran</p>
          </div>
        </div>
        
        {/* Progress Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-3 w-64">
          <div className="flex-1 h-2 bg-indigo-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-emerald-400">{completedCount}/{videos.length} cashar</span>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row">
        {/* Left: Video Player Area */}
        <div className="flex-1 lg:border-r border-slate-200 bg-white flex flex-col">
          <div className="w-full aspect-video bg-black relative">
            {activeVideo ? (
              <iframe
                key={activeVideo.id}
                id="youtube-player"
                src={`https://www.youtube.com/embed/${extractYoutubeId(activeVideo.youtube_id)}?enablejsapi=1&modestbranding=1&rel=0&showinfo=0`}
                title={activeVideo.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                Fadlan dooro cashar dhanka midig ah
              </div>
            )}
          </div>

          {/* Under Video Content */}
          <div className="p-6 sm:p-8 flex-1 max-w-4xl w-full mx-auto space-y-6">
            {activeVideo && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
                      <span>Casharka {activeVideoIndex + 1}</span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-800 leading-snug">
                      {activeVideo.title}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2 text-amber-600 font-bold bg-amber-50 border border-amber-100 px-3.5 py-1.5 rounded-full text-xs shrink-0 self-start sm:self-center">
                    <Trophy className="h-4 w-4" />
                    <span>+{activeVideo.points_awarded} Dhibcood</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-500 text-xs font-semibold">
                    {!canMarkCompleted && !progress.some(p => p.video_id === activeVideo.id) ? (
                      <span>Fadlan daawo ugu yaraan 80% muuqaalka si aad u xaqiijiso casharkan.</span>
                    ) : (
                      <span className="text-emerald-600">Waxaad hada calaamadin kartaa casharka in la daawaday!</span>
                    )}
                  </p>
                  
                  <button
                    onClick={handleMarkCompleted}
                    disabled={isPending || progress.some(p => p.video_id === activeVideo.id) || !canMarkCompleted}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 ${
                      progress.some(p => p.video_id === activeVideo.id)
                        ? 'bg-emerald-500 text-white shadow-emerald-500/10 cursor-default'
                        : !canMarkCompleted
                          ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed border border-slate-350'
                          : 'bg-indigo-650 hover:bg-indigo-600 text-white shadow-indigo-600/20 hover:-translate-y-0.5 cursor-pointer'
                    }`}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : progress.some(p => p.video_id === activeVideo.id) ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Waa La Daawaday
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Calaamadee in la daawaday
                      </>
                    )}
                  </button>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-bottom-2 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* Info and Resources Tabs */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex border-b border-slate-200 mb-4">
                    <button
                      onClick={() => setActiveTab('about')}
                      className={`pb-3 pr-6 font-bold text-sm transition-all cursor-pointer ${
                        activeTab === 'about' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-650'
                      }`}
                    >
                      Macluumaadka Koorsada
                    </button>
                    <button
                      onClick={() => setActiveTab('resources')}
                      className={`pb-3 px-6 font-bold text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'resources' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-650'
                      }`}
                    >
                      Faylasha Koorsada
                      <span className="text-[10px] bg-indigo-55 text-indigo-600 font-extrabold px-1.5 py-0.5 rounded-full">
                        {documents.length}
                      </span>
                    </button>
                  </div>

                  {activeTab === 'about' ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={course.instructor_avatar} 
                          alt={course.instructor_name} 
                          className="h-10 w-10 rounded-full border border-slate-200"
                        />
                        <div>
                          <p className="text-xs text-slate-400 font-semibold">Instructor</p>
                          <p className="text-sm font-bold text-slate-800">{course.instructor_name}</p>
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        {course.description}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.length === 0 ? (
                        <div className="text-center py-6 text-slate-400">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs font-semibold">Wali wax fayl ah laguma soo darin koorsadan.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {documents.map((doc) => (
                            <div key={doc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center shrink-0">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate" title={doc.title}>{doc.title}</p>
                                  <p className="text-[9px] font-semibold text-slate-450 uppercase tracking-wider mt-0.5">{doc.type}</p>
                                </div>
                              </div>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-8 w-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center transition-all cursor-pointer"
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Curriculum Sidebar */}
        <div className="w-full lg:w-96 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col h-[50vh] lg:h-[calc(100vh-73px)] sticky top-[73px]">
          <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
            <h3 className="font-display font-extrabold text-sm text-slate-800 uppercase tracking-wider">Muuqaalada Koorsada</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Casharka ku xiga wuxuu furmayaa markaad kan hada daawato.</p>
          </div>
          <div className="overflow-y-auto flex-1 p-4 space-y-2.5">
            {videos.map((video, index) => {
              const isCompleted = progress.some(p => p.video_id === video.id)
              const isLocked = isVideoLocked(index)
              const isActive = activeVideoIndex === index

              return (
                <button
                  key={video.id}
                  onClick={() => !isLocked && setActiveVideoIndex(index)}
                  disabled={isLocked}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 relative overflow-hidden ${
                    isActive 
                      ? 'bg-indigo-50/40 border-indigo-500 shadow-sm shadow-indigo-100 ring-1 ring-indigo-500/20' 
                      : isLocked
                        ? 'bg-slate-100/50 border-slate-150 opacity-60 cursor-not-allowed'
                        : 'bg-white border-slate-200 hover:border-indigo-400/40 hover:shadow-sm cursor-pointer'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : isLocked ? (
                      <Lock className="h-5 w-5 text-slate-400" />
                    ) : (
                      <PlayCircle className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold leading-snug truncate ${isActive ? 'text-indigo-700' : isLocked ? 'text-slate-500' : 'text-slate-800'}`}>
                      <span className="opacity-60 text-[10px] block mb-0.5 font-semibold">Casharka {index + 1}</span>
                      {video.title}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider flex items-center gap-1">
                      <Award className="h-3 w-3" />
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

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { DashboardData } from '@/lib/actions/dashboard'
import { 
  Trophy, 
  PlayCircle, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Medal,
  Activity,
  GraduationCap,
  Search,
  CreditCard,
  FileText,
  Download,
  Lock,
  X,
  Play,
  Calendar,
  Sparkles
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { extractYoutubeId } from '@/lib/utils'

interface StudentDashboardProps {
  data: DashboardData
}

export default function StudentDashboard({ data }: StudentDashboardProps) {
  const { 
    profile, 
    enrolledCourses, 
    totalPoints, 
    leaderboardRank, 
    totalCompletedVideos, 
    recentActivity,
    payments = [],
    documents = [],
    allVideos = []
  } = data

  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'documents' | 'payments'>('overview')
  const [videoSearch, setVideoSearch] = useState('')
  const [docSearch, setDocSearch] = useState('')
  
  // Video Modal State
  const [selectedVideo, setSelectedVideo] = useState<{ youtubeId: string; title: string; courseTitle: string } | null>(null)

  const pendingPayments = payments.filter((p: any) => p.status === 'pending')
  const failedPayments = payments.filter((p: any) => p.status === 'failed')

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Filter videos based on search
  const filteredVideos = allVideos.filter(video => 
    video.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
    (video.courses?.title || '').toLowerCase().includes(videoSearch.toLowerCase())
  )

  // Filter documents based on search
  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(docSearch.toLowerCase()) ||
    (doc.course_title || '').toLowerCase().includes(docSearch.toLowerCase())
  )

  const isEnrolledInCourse = (courseId: string) => {
    return enrolledCourses.some(ec => ec.course.id === courseId)
  }

  return (
    <div className="flex flex-col w-full font-sans min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <section className="bg-[#1E1B4B] pt-12 pb-24 text-white relative overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[4rem] shadow-xl shadow-indigo-950/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.2),transparent_50%)]" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <Avatar className="h-24 w-24 border-4 border-indigo-400/20 shadow-2xl ring-4 ring-indigo-500/10">
              <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`} />
              <AvatarFallback className="bg-indigo-600 text-2xl font-bold">{getInitials(profile.full_name)}</AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left flex-1 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Barte Firfircoo ah</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Kusoo dhawoow, {profile.full_name.split(' ')[0]}! 👋
              </h1>
              <p className="text-slate-300 font-medium max-w-lg text-sm">
                Ku dhowow hadafkaaga! Halkan kala soco koorsooyinkaaga, dhibcahaaga, muuqaalada ugu dambeeyay, iyo faylasha waxbarashada.
              </p>
            </div>

            <div className="flex gap-4">
              <Link 
                href="/courses" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-indigo-600/35 flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Koorsooyin Cusub
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20 w-full space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-md shadow-slate-100 border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Koorsooyinka</p>
              <p className="font-display text-2xl font-extrabold text-slate-900">{enrolledCourses.length}</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-md shadow-slate-100 border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Casharada la Daawaday</p>
              <p className="font-display text-2xl font-extrabold text-slate-900">{totalCompletedVideos}</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-md shadow-slate-100 border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dhibcahaaga</p>
              <p className="font-display text-2xl font-extrabold text-slate-900">{totalPoints}</p>
            </div>
          </div>

          {/* Stat 4 */}
          <Link href="/leaderboard" className="bg-white rounded-2xl p-6 shadow-md shadow-slate-100 border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-all group">
            <div className="h-14 w-14 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Medal className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kaalintaada</p>
              <p className="font-display text-2xl font-extrabold text-slate-900">#{leaderboardRank || '-'}</p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-1 sm:space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Dashboard-ka', icon: GraduationCap },
              { id: 'videos', name: 'Muuqaalada Ugu Dambeeyay', icon: PlayCircle },
              { id: 'documents', name: 'Faylasha & PDF', icon: FileText },
              { id: 'payments', name: 'Taariikhda Bixinta', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-semibold text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Contents */}
        <div className="transition-all duration-300">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content: Enrolled Courses */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Payment Alerts */}
                {pendingPayments.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                    <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-800">Lacag bixintaada waa la hubinayaa</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        Fadlan sug inta maamulku ka xaqiijinayo lacag bixintaada. Marka la xaqiijiyo, koorsadu halkaan ayay kasoo muuqan doontaa.
                      </p>
                    </div>
                  </div>
                )}

                {failedPayments.length > 0 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                    <Activity className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="w-full">
                      <h4 className="text-sm font-bold text-rose-800">Raali ahow, lacag bixintaadii waa la diiday</h4>
                      <p className="text-xs text-rose-700 mt-1 mb-2">
                        Lacag bixintii aad samaysay lama aqbalin. Fadlan eeg sababta hoose.
                      </p>
                      {failedPayments.map(p => (
                        <div key={p.id} className="bg-white/60 border border-rose-100 rounded-lg p-2.5 mt-2">
                          <p className="text-xs font-bold text-rose-900">{p.courses?.title || 'Koorso'}</p>
                          <p className="text-xs text-rose-800 mt-0.5 font-medium italic">
                            Sababta: "{p.reject_reason || 'Lama xusin sababta'}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-extrabold text-slate-800 flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-indigo-600" />
                    Koorsooyinkaaga Waxbarasho
                  </h2>
                </div>

                {enrolledCourses.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <BookOpen className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">Wali koorso kuma jirto profile-kaaga</h3>
                    <p className="text-slate-500 max-w-sm mx-auto text-sm">
                      Fadlan tag qaybta koorsooyinka si aad u doorato oo aad u bilowdo koorsooyin xiiso leh.
                    </p>
                    <Link 
                      href="/courses" 
                      className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-600/20 transition-all text-sm"
                    >
                      Raadi Koorsooyin
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map((enrolled) => (
                      <div key={enrolled.course.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                          <Image
                            src={enrolled.course.thumbnail_url}
                            alt={enrolled.course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                              {enrolled.course.level}
                            </span>
                            {enrolled.progressPercent === 100 && (
                              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Dhamaystiran
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-display font-bold text-base text-slate-800 mb-1 line-clamp-2">
                            {enrolled.course.title}
                          </h3>
                          
                          <div className="mt-auto pt-4 space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                              <span>Boqolleyda</span>
                              <span className={enrolled.progressPercent === 100 ? "text-emerald-600" : "text-indigo-600"}>
                                {enrolled.progressPercent}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 rounded-full ${enrolled.progressPercent === 100 ? "bg-emerald-500" : "bg-indigo-600"}`}
                                style={{ width: `${enrolled.progressPercent}%` }}
                              />
                            </div>
                            
                            <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold uppercase tracking-wider pt-2 border-t border-slate-50">
                              <span>{enrolled.completedVideos} / {enrolled.totalVideos} Casharo</span>
                            </div>

                            <Link 
                              href={`/courses/${enrolled.course.slug}/learn`}
                              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                enrolled.progressPercent === 100 
                                  ? 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                              }`}
                            >
                              {enrolled.progressPercent === 100 ? 'Dib u Daawo' : 'Sii Wado Waxbarashada'}
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar: Activity & Leaderboard Promo */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-display font-bold text-base text-slate-800 mb-6 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    Casharadii kuugu Dambeeyay
                  </h3>

                  {recentActivity.length === 0 ? (
                    <div className="text-center py-6 text-slate-400">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-semibold">Wali wax cashar ah maadan dhamaysan.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-4.5 w-4.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate" title={activity.video_title}>
                              {activity.video_title}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{activity.course_title}</p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                              <span className="text-[9px] text-slate-400 font-semibold">{new Date(activity.completed_at).toLocaleDateString()}</span>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                +{activity.points_awarded} dhibic
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                  <h3 className="font-display font-bold text-base mb-2">Eeg Kaalintaada Hadda</h3>
                  <p className="text-xs text-indigo-200 leading-relaxed mb-4">
                    La tartanto ardayda kale ee SomSkool. Dhibcahaaga ku kordhi adoo casharada dhamaystiraya!
                  </p>
                  <Link 
                    href="/leaderboard" 
                    className="inline-flex bg-white text-indigo-900 hover:bg-slate-100 font-bold py-2 px-5 rounded-full text-xs transition-colors shadow-sm"
                  >
                    Fure Board-ka
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LATEST VIDEOS */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-extrabold text-slate-800">Muuqaaladii Ugu Dambeeyay ee Koorsooyinka</h2>
                  <p className="text-xs text-slate-500 font-medium">Ka raadi casharada iyo koorsooyinka oo daawo muuqalka directly.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ka raadi magaca casharka..."
                    value={videoSearch}
                    onChange={(e) => setVideoSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  />
                </div>
              </div>

              {filteredVideos.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                  <PlayCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-semibold">Wax cashar ah oo la mid ah raadintaada lama helin.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVideos.map((video) => {
                    const enrolled = isEnrolledInCourse(video.course_id)
                    return (
                      <div 
                        key={video.id} 
                        className={`bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative ${
                          !enrolled ? 'opacity-85' : ''
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-slate-900 overflow-hidden">
                          <Image 
                            src={`https://img.youtube.com/vi/${extractYoutubeId(video.youtube_id)}/mqdefault.jpg`}
                            alt={video.title}
                            fill
                            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                            {enrolled ? (
                              <button
                                onClick={() => setSelectedVideo({
                                  youtubeId: extractYoutubeId(video.youtube_id),
                                  title: video.title,
                                  courseTitle: video.courses?.title || 'Course'
                                })}
                                className="h-12 w-12 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform cursor-pointer"
                              >
                                <Play className="h-5 w-5 fill-indigo-600 ml-0.5" />
                              </button>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-slate-800/80 backdrop-blur-sm text-slate-300 flex items-center justify-center border border-white/10">
                                <Lock className="h-4.5 w-4.5" />
                              </div>
                            )}
                          </div>
                          <span className="absolute bottom-2 right-2 bg-slate-900/85 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {video.points_awarded} Dhibcood
                          </span>
                        </div>

                        {/* Details */}
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                              {video.courses?.title || 'Koorso'}
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                            {video.title}
                          </h4>

                          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                            {enrolled ? (
                              <button
                                onClick={() => setSelectedVideo({
                                  youtubeId: extractYoutubeId(video.youtube_id),
                                  title: video.title,
                                  courseTitle: video.courses?.title || 'Course'
                                })}
                                className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline cursor-pointer"
                              >
                                Daawo Hadda &rarr;
                              </button>
                            ) : (
                              <Link
                                href={`/payment?courseId=${video.course_id}&title=${encodeURIComponent(video.courses?.title || '')}`}
                                className="text-xs font-bold text-rose-500 flex items-center gap-1 hover:underline"
                              >
                                Fur casharka (Guri koorsada) &rarr;
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-extrabold text-slate-800">Faylasha iyo Dukumantiyada Koorsooyinka</h2>
                  <p className="text-xs text-slate-500 font-medium">Soo dejiso casharada, PDFs, iyo layliyo kasta oo macalinku soo dhigay.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ka raadi magaca faylka..."
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  />
                </div>
              </div>

              {filteredDocs.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto space-y-4">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700">Dukumantiyo ma jiraan</h3>
                  <p className="text-xs text-slate-500">
                    Koorsada aad diwaangashan tahay wali wax fayl ah looma soo galiyay, ama lama helin fayl u dhigma raadintaada.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocs.map((doc) => (
                    <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md transition-all flex flex-col">
                      <div className="flex gap-4 items-start mb-4">
                        <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-800 text-sm truncate" title={doc.title}>
                            {doc.title}
                          </h4>
                          <p className="text-[10px] font-bold text-indigo-500 bg-indigo-50/50 px-2 py-0.5 rounded inline-block mt-1">
                            {doc.course_title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1">Type: {doc.type.toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="mt-auto pt-3 border-t border-slate-100 flex justify-end">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Soo Dejiso Faylka
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-extrabold text-slate-800">Taariikhda Bixinta iyo Rasiidhada</h2>
                <p className="text-xs text-slate-500 font-medium">Halkan ka hubi rasiidhada aad gudbisay iyo heerka ay marayaan (Status).</p>
              </div>

              {payments.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto space-y-4">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <CreditCard className="h-8 w-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700">Rasiidho laguma helin</h3>
                  <p className="text-xs text-slate-500">Wali maadan soo gudbin wax codsi lacag bixin ah.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                          <th className="px-6 py-4">Koorsada</th>
                          <th className="px-6 py-4">Tixraac (Reference)</th>
                          <th className="px-6 py-4">Habka Lacagta</th>
                          <th className="px-6 py-4">Cadadka (Amount)</th>
                          <th className="px-6 py-4">Taariikhda</th>
                          <th className="px-6 py-4 text-center">Xaalada (Status)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {payments.map((pay: any) => {
                          const status = pay.status || 'pending'
                          return (
                            <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <p className="font-extrabold text-slate-850 truncate max-w-[200px]" title={pay.courses?.title}>
                                  {pay.courses?.title || 'Koorso SomSkool'}
                                </p>
                              </td>
                              <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                                {pay.transaction_reference}
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-650 capitalize">
                                {pay.payment_method.replace('_', ' ')}
                              </td>
                              <td className="px-6 py-4 font-display font-extrabold text-slate-900">
                                ${parseFloat(pay.amount).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-xs font-medium text-slate-400">
                                {new Date(pay.created_at).toLocaleDateString()} {new Date(pay.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                  status === 'confirmed'
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    : status === 'failed'
                                      ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                      : 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
                                }`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${
                                    status === 'confirmed'
                                      ? 'bg-emerald-500'
                                      : status === 'failed'
                                        ? 'bg-rose-500'
                                        : 'bg-amber-500'
                                  }`} />
                                  {status === 'confirmed' ? 'La Xaqiijiyay' : status === 'failed' ? 'Waa La Diiday' : 'Waa Hadhsan tahay'}
                                </span>
                                {status === 'failed' && pay.reject_reason && (
                                  <p className="text-[10px] text-rose-500 mt-1.5 max-w-[150px] mx-auto text-center font-medium leading-tight line-clamp-2" title={pay.reject_reason}>
                                    {pay.reject_reason}
                                  </p>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* CUSTOM VIDEO PLAYER MODAL */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedVideo(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* YouTube Embed */}
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={selectedVideo.title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* Title Banner below player */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/85 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 max-w-[90vw]">
            <span className="text-indigo-400 uppercase tracking-wider">{selectedVideo.courseTitle}</span>
            <span className="text-slate-400">|</span>
            <span className="truncate">{selectedVideo.title}</span>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import React from 'react'
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
  GraduationCap
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface StudentDashboardProps {
  data: DashboardData
}

export default function StudentDashboard({ data }: StudentDashboardProps) {
  const { profile, enrolledCourses, totalPoints, leaderboardRank, totalCompletedVideos, recentActivity } = data

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex flex-col w-full font-sans min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <section className="bg-brand-dark pt-12 pb-24 text-white relative overflow-hidden rounded-b-[3rem] shadow-xl shadow-brand-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(91,79,233,0.15),transparent_50%)]" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-brand-primary/20 rounded-full blur-[80px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <Avatar className="h-24 w-24 border-4 border-white/10 shadow-2xl">
              <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`} />
              <AvatarFallback className="bg-brand-primary text-2xl font-bold">{getInitials(profile.full_name)}</AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left flex-1 space-y-2">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Kusoo dhawoow, {profile.full_name.split(' ')[0]}! 👋
              </h1>
              <p className="text-white/60 font-medium max-w-lg">
                Halkan waa meesha aad kala socon karto koorsooyinkaaga, dhibcahaaga, iyo heerkaaga waxbarasho.
              </p>
            </div>

            <div className="flex gap-4">
              <Link 
                href="/courses" 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Daawo Koorso
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20 w-full space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/40 border border-gray-100 flex items-center gap-4 hover-lift">
            <div className="h-14 w-14 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Koorsooyinka</p>
              <p className="font-display text-2xl font-extrabold text-brand-dark">{enrolledCourses.length}</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/40 border border-gray-100 flex items-center gap-4 hover-lift">
            <div className="h-14 w-14 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">La Daawaday</p>
              <p className="font-display text-2xl font-extrabold text-brand-dark">{totalCompletedVideos}</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/40 border border-gray-100 flex items-center gap-4 hover-lift">
            <div className="h-14 w-14 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center">
              <Trophy className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Dhibcaha</p>
              <p className="font-display text-2xl font-extrabold text-brand-dark">{totalPoints}</p>
            </div>
          </div>

          {/* Stat 4 */}
          <Link href="/leaderboard" className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/40 border border-gray-100 flex items-center gap-4 hover-lift group">
            <div className="h-14 w-14 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Medal className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kaalinta</p>
              <p className="font-display text-2xl font-extrabold text-brand-dark">#{leaderboardRank}</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold text-brand-dark flex items-center gap-2">
                <PlayCircle className="h-6 w-6 text-brand-primary" />
                Koorsooyinkaaga
              </h2>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">Wali isma diiwaangalin koorso</h3>
                <p className="text-gray-500 mb-6 text-sm">Fadlan tag qaybta koorsooyinka si aad u bilowdo waxbarashadaada.</p>
                <Link 
                  href="/courses" 
                  className="inline-flex bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-brand-primary/20 transition-all"
                >
                  Gudaha Ugal Koorsooyinka
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((enrolled) => (
                  <div key={enrolled.course.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md shadow-gray-200/30 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
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
                      <h3 className="font-display font-bold text-lg text-brand-dark mb-1 line-clamp-2">
                        {enrolled.course.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 space-y-3">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                          <span>Dhamaystirka</span>
                          <span className={enrolled.progressPercent === 100 ? "text-emerald-500" : "text-brand-primary"}>
                            {enrolled.progressPercent}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 rounded-full ${enrolled.progressPercent === 100 ? "bg-emerald-500" : "bg-brand-primary"}`}
                            style={{ width: `${enrolled.progressPercent}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center text-[11px] text-gray-400 font-semibold uppercase tracking-wider pt-2 border-t border-gray-50">
                          <span>{enrolled.completedVideos} / {enrolled.totalVideos} Casharo</span>
                        </div>

                        <Link 
                          href={`/courses/${enrolled.course.slug}/learn`}
                          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                            enrolled.progressPercent === 100 
                              ? 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                              : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white'
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

          {/* Sidebar: Activity & Profile Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md shadow-gray-200/30 border border-gray-100">
              <h3 className="font-display font-bold text-lg text-brand-dark mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-brand-accent" />
                Dhaqdhaqaaqii U Danbeeyay
              </h3>

              {recentActivity.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">Wali wax cashar ah maadan daawan.</p>
                </div>
              ) : (
                <div className="space-y-5 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent pl-8 md:pl-0">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-brand-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute -left-8 md:static" />
                      
                      <div className="w-[calc(100%-1rem)] md:w-[calc(50%-1.5rem)] bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-xs font-bold text-brand-dark line-clamp-1" title={activity.video_title}>{activity.video_title}</p>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{activity.course_title}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                          <span className="text-[9px] text-gray-400 font-semibold">{new Date(activity.completed_at).toLocaleDateString()}</span>
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Trophy className="h-2.5 w-2.5" /> +{activity.points_awarded}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-3xl p-6 text-white shadow-xl shadow-brand-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
              <h3 className="font-display font-bold text-lg mb-2 relative z-10">Ku biir Bulshada</h3>
              <p className="text-sm text-white/80 font-medium mb-4 relative z-10">La wadaag ardayda kale fikradahaaga oo caawi saaxiibadaa.</p>
              <Link 
                href="/leaderboard" 
                className="inline-flex bg-white text-brand-primary hover:bg-gray-50 font-bold py-2.5 px-6 rounded-full text-sm transition-colors relative z-10 shadow-sm"
              >
                Eeg Kaalimaha
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

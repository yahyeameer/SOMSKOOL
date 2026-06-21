'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Trophy, Medal, Star, Crown, TrendingUp, Users } from 'lucide-react'
import { Profile } from '@/types'

export default function LeaderboardClient({ leaderboard }: { leaderboard: Profile[] }) {
  const { t } = useLanguage()

  const getRankBadge = (index: number) => {
    if (index === 0) return { icon: Crown, color: 'from-yellow-400 to-amber-500', bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200', label: t('rank_gold') }
    if (index === 1) return { icon: Medal, color: 'from-gray-300 to-gray-400', bg: 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200', label: t('rank_silver') }
    if (index === 2) return { icon: Medal, color: 'from-orange-400 to-amber-600', bg: 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200', label: t('rank_bronze') }
    return { icon: Star, color: 'from-brand-primary to-[#4834D4]', bg: 'bg-white border-gray-200', label: t('rank_member') }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="flex flex-col w-full font-sans min-h-screen justify-center items-center">
        <Trophy className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-400">Wali lama diiwaangelin arday.</h2>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-brand-primary via-brand-primary-dark to-brand-dark py-20 text-center text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20">
            <Trophy className="h-4 w-4 text-brand-accent" />
            <span>{t('leaderboard')}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            {t('leaderboard_title')}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
            {t('leaderboard_subtitle')}
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.05),transparent)]" />
      </section>

      {/* Top 3 Podium */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaderboard.slice(0, 3).map((student, index) => {
            const badge = getRankBadge(index)
            const Icon = badge.icon
            return (
              <div
                key={student.id}
                className={`relative rounded-3xl border p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${badge.bg} ${index === 0 ? 'md:-mt-4 md:scale-105' : ''}`}
              >
                {/* Rank Number */}
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-white text-sm font-extrabold shadow-lg`}>
                  #{index + 1}
                </div>

                {/* Avatar */}
                <div className={`mx-auto h-20 w-20 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-white text-2xl font-extrabold mb-4 shadow-lg`}>
                  {getInitials(student.full_name)}
                </div>

                <h3 className="font-display text-lg font-extrabold text-brand-dark">{student.full_name}</h3>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <Icon className="h-4 w-4 text-brand-primary" />
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">{badge.label}</span>
                </div>

                {/* Points */}
                <div className="mt-4 flex items-center justify-center gap-2 bg-brand-primary/5 rounded-full px-4 py-2">
                  <TrendingUp className="h-4 w-4 text-brand-primary" />
                  <span className="text-xl font-extrabold text-brand-primary font-display">{student.points || 0}</span>
                  <span className="text-xs font-bold text-gray-500">{t('points')}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Full Ranking Table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Users className="h-5 w-5 text-brand-primary" />
            <h2 className="font-display text-xl font-extrabold text-brand-dark">{t('leaderboard_title')}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">{t('rank')}</th>
                  <th className="py-4 px-6">{t('student')}</th>
                  <th className="py-4 px-6 text-center">{t('points')}</th>
                  <th className="py-4 px-6 text-right">{t('rank')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {leaderboard.map((student, index) => {
                  const badge = getRankBadge(index)
                  return (
                    <tr key={student.id} className="hover:bg-brand-primary/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br ${badge.color} text-white text-xs font-extrabold shadow-sm`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-white text-sm font-extrabold`}>
                            {getInitials(student.full_name)}
                          </div>
                          <div>
                            <p className="font-extrabold text-brand-dark">{student.full_name}</p>
                            <p className="text-xs text-gray-400 font-semibold capitalize">{student.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-lg font-extrabold text-brand-primary font-display">{student.points || 0}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold border inline-block ${
                          index === 0 ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                          index === 1 ? 'bg-gray-50 text-gray-600 border-gray-200' :
                          index === 2 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          'bg-brand-primary/5 text-brand-primary border-brand-primary/20'
                        }`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

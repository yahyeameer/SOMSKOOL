'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Course } from '@/types'
import { Heart, Star, Clock, ArrowRight, Users } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const [wishlist, setWishlist] = useState(false)
  const { t } = useLanguage()

  const getDifficultyStyles = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-50'
      case 'Intermediate':
        return 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-50'
      case 'Advanced':
        return 'bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-50'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  return (
    <Card className="overflow-hidden border border-white/20 bg-white/80 backdrop-blur-xl rounded-2xl shadow-md shadow-brand-primary/5 hover:shadow-xl hover:shadow-brand-primary/20 transition-all duration-500 ease-out hover:-translate-y-1.5 group flex flex-col h-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none z-0"></div>
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={course.thumbnail_url}
          alt={course.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setWishlist(!wishlist)
          }}
          aria-label="Add to wishlist"
          className="absolute top-2.5 right-2.5 z-10 h-7 w-7 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm border border-gray-100 transition-colors cursor-pointer"
        >
          <Heart className={`h-3.5 w-3.5 transition-transform duration-200 active:scale-95 ${wishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <CardContent className="p-3.5 flex flex-col flex-1">
        {/* Rating and Duration */}
        <div className="flex items-center justify-between text-[11px] text-text-muted mb-2 font-semibold font-sans">
          <div className="flex items-center gap-1">
            <div className="flex items-center text-brand-accent">
              <Star className="h-3.5 w-3.5 fill-brand-accent" />
            </div>
            <span className="text-brand-dark font-bold">{course.rating.toFixed(1)}</span>
            <span className="text-gray-400">({course.total_students}+)</span>
          </div>

          <div className="flex items-center gap-1 text-gray-500 font-medium">
            <Clock className="h-3 w-3" />
            <span>{Math.floor(course.duration_minutes / 60)}{t('hours')} {course.duration_minutes % 60}{t('minutes')}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-sm font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors line-clamp-2 mb-2">
          <Link href={`/courses/${course.slug}/learn`}>
            {course.title}
          </Link>
        </h3>

        {/* Description preview */}
        <p className="text-text-muted text-xs leading-relaxed line-clamp-2 mb-3 font-medium">
          {course.description}
        </p>

        {/* Spacer to push CTA to bottom */}
        <div className="mt-auto pt-2.5 border-t border-gray-100 flex items-center justify-end">
          {/* CTA */}
          <Link
            href={
              course.is_free
                ? `/courses/${course.slug}/learn`
                : `/payment?courseId=${course.id}&title=${encodeURIComponent(course.title)}&price=${course.price}`
            }
            className="flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:text-brand-primary-dark transition-all mt-1 group/btn"
          >
            <span>{t('enroll_now')}</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

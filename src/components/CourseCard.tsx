'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Course } from '@/types'
import { Heart, Star, Clock, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const [wishlist, setWishlist] = useState(false)

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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours} saacadood`
    }
    return `${minutes} daqiiqo`
  }

  return (
    <Card className="overflow-hidden border border-border bg-card rounded-2xl shadow-sm hover-lift group flex flex-col h-full">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={course.thumbnail_url}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Difficulty Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className={`font-semibold rounded-full px-3 py-1 text-xs shadow-sm ${getDifficultyStyles(course.level)}`}>
            {course.level}
          </Badge>
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setWishlist(!wishlist)
          }}
          className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm border border-gray-100 transition-colors cursor-pointer"
        >
          <Heart className={`h-5 w-5 transition-transform duration-200 active:scale-95 ${wishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <CardContent className="p-6 flex flex-col flex-1">
        {/* Rating and Duration */}
        <div className="flex items-center justify-between text-xs text-text-muted mb-3 font-semibold font-sans">
          <div className="flex items-center gap-1">
            <div className="flex items-center text-brand-accent">
              <Star className="h-4 w-4 fill-brand-accent" />
            </div>
            <span className="text-brand-dark font-bold">{course.rating.toFixed(1)}</span>
            <span className="text-gray-400">({course.total_students}+ barte)</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-gray-500 font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDuration(course.duration_minutes)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors line-clamp-2 mb-4">
          <Link href={`/courses?q=${encodeURIComponent(course.title)}`}>
            {course.title}
          </Link>
        </h3>

        {/* Description preview */}
        <p className="text-text-muted text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
          {course.description}
        </p>

        {/* Spacer to push pricing & instructor to bottom */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          {/* Instructor profile */}
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 border border-gray-100">
              <AvatarImage src={course.instructor_avatar} />
              <AvatarFallback className="bg-brand-primary/5 text-brand-primary font-bold text-xs">
                YM
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-brand-dark">
                {course.instructor_name}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Bare</span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex flex-col items-end">
            <span className="text-base font-extrabold text-brand-primary font-display leading-tight">
              {course.is_free ? 'Bilaash' : `$${course.price.toFixed(2)}`}
            </span>
            <Link
              href={
                course.is_free
                  ? `/courses?q=${encodeURIComponent(course.title)}`
                  : `/payment?courseId=${course.id}&title=${encodeURIComponent(course.title)}&price=${course.price}`
              }
              className="flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:text-brand-primary-dark transition-all mt-1 group/btn"
            >
              <span>Enroll Now</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

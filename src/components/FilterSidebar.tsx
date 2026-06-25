'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [level, setLevel] = useState(searchParams.get('level') || 'all')
  const [price, setPrice] = useState(searchParams.get('price') || 'all')

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateUrl({ q: search })
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  const updateUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/courses?${params.toString()}`)
  }

  const handleCategoryChange = (cat: string) => {
    setCategory(cat)
    updateUrl({ category: cat })
  }

  const handleLevelChange = (lvl: string) => {
    setLevel(lvl)
    updateUrl({ level: lvl })
  }

  const handlePriceChange = (prc: string) => {
    setPrice(prc)
    updateUrl({ price: prc })
  }

  const categories = [
    { name: t('all_categories'), slug: 'all' },
    { name: t('computer_science'), slug: 'computer-science' },
    { name: t('english_category'), slug: 'english' },
  ]

  const levels = [
    { name: t('all_levels'), slug: 'all' },
    { name: t('beginner'), slug: 'Beginner' },
    { name: t('intermediate'), slug: 'Intermediate' },
    { name: t('advanced'), slug: 'Advanced' },
  ]

  const prices = [
    { name: t('all_prices'), slug: 'all' },
    { name: t('free'), slug: 'free' },
    { name: t('paid'), slug: 'paid' },
  ]

  return (
    <div className="w-full lg:w-[280px] flex-shrink-0 space-y-8 bg-white border border-border rounded-2xl p-6 shadow-sm font-sans text-left">
      {/* Search Input */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider font-display">
          {t('search_course')}
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t('search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-150 text-brand-dark rounded-xl focus-visible:ring-brand-primary"
          />
        </div>
      </div>

      {/* Category Buttons */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider font-display border-b border-gray-100 pb-2">
          {t('categories')}
        </h3>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold text-left transition-all duration-300 w-fit lg:w-full border ${
                category === cat.slug
                  ? 'bg-gradient-to-r from-brand-primary to-[#4834D4] text-white shadow-lg shadow-brand-primary/25 border-transparent scale-[1.02]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Level Panel */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider font-display border-b border-gray-100 pb-2">
          {t('course_level')}
        </h3>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {levels.map((lvl) => (
            <button
              key={lvl.slug}
              onClick={() => handleLevelChange(lvl.slug)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold text-left transition-all duration-300 w-fit lg:w-full border ${
                level === lvl.slug
                  ? 'bg-gradient-to-r from-brand-primary to-[#4834D4] text-white shadow-lg shadow-brand-primary/25 border-transparent scale-[1.02]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary'
              }`}
            >
              {lvl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Panel */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider font-display border-b border-gray-100 pb-2">
          {t('price_type')}
        </h3>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {prices.map((prc) => (
            <button
              key={prc.slug}
              onClick={() => handlePriceChange(prc.slug)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold text-left transition-all duration-300 w-fit lg:w-full border ${
                price === prc.slug
                  ? 'bg-gradient-to-r from-brand-primary to-[#4834D4] text-white shadow-lg shadow-brand-primary/25 border-transparent scale-[1.02]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary'
              }`}
            >
              {prc.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

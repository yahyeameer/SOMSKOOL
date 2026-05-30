'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

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
    { name: 'All Categories', slug: 'all' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'UI/UX Design', slug: 'ui-ux' },
    { name: 'Digital Marketing', slug: 'digital-marketing' },
    { name: 'Data Science & AI', slug: 'data-science' },
    { name: 'Business Strategy', slug: 'business' },
  ]

  const levels = [
    { name: 'All Levels', slug: 'all' },
    { name: 'Beginner', slug: 'Beginner' },
    { name: 'Intermediate', slug: 'Intermediate' },
    { name: 'Advanced', slug: 'Advanced' },
  ]

  const prices = [
    { name: 'All Prices', slug: 'all' },
    { name: 'Bilaash (Free)', slug: 'free' },
    { name: 'Lacag (Paid)', slug: 'paid' },
  ]

  return (
    <div className="w-full lg:w-[280px] flex-shrink-0 space-y-8 bg-white border border-border rounded-2xl p-6 shadow-sm font-sans text-left">
      {/* Search Input */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider font-display">
          Raadi Koorsada
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Koorso qor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-150 text-brand-dark rounded-xl focus-visible:ring-brand-primary"
          />
        </div>
      </div>

      {/* Category Checkboxes / Buttons */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider font-display border-b border-gray-100 pb-2">
          Qeybaha
        </h3>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all w-fit lg:w-full ${
                category === cat.slug
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-brand-dark'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Level Radio Panel */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider font-display border-b border-gray-100 pb-2">
          Heerka Koorsada
        </h3>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {levels.map((lvl) => (
            <button
              key={lvl.slug}
              onClick={() => handleLevelChange(lvl.slug)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all w-fit lg:w-full ${
                level === lvl.slug
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-brand-dark'
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
          Nooca Qiimaha
        </h3>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {prices.map((prc) => (
            <button
              key={prc.slug}
              onClick={() => handlePriceChange(prc.slug)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all w-fit lg:w-full ${
                price === prc.slug
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-brand-dark'
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

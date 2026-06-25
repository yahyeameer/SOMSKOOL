'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signUp } from '@/lib/actions/auth'
import { BookOpen, KeyRound, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    // Client side confirmation validation
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string
    if (password !== confirmPassword) {
      setError(t('password_mismatch') || 'Furayaasha aad qortay isku mid ma aha!')
      setLoading(false)
      return
    }

    const result = await signUp(formData)

    setLoading(false)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full font-sans bg-white">
      {/* 🚀 LEFT PANEL - Decorative Brand Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-primary p-16 flex-col justify-between relative overflow-hidden text-white text-left">
        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-primary shadow-md">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">SOMSKOOL</span>
        </div>

        {/* Brand Focus */}
        <div className="space-y-6 relative z-10 my-auto">
          <Badge className="bg-white/10 hover:bg-white/10 text-white border border-white/20 px-4 py-1.5 rounded-full text-xs w-fit">
            {t('quality_education')}
          </Badge>
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight">
            Build Your <br />
            <span className="text-brand-accent">Future.</span>
          </h1>
          <p className="text-white/80 text-base leading-relaxed max-w-md">
            {t('join_thousands')}
          </p>
        </div>

        {/* Footer info */}
        <p className="text-white/50 text-xs font-semibold relative z-10">
          © 2026 SomSkool · Hargeisa, Somaliland 🇸🇴
        </p>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent)]" />
      </div>

      {/* ✍️ RIGHT PANEL - Register inputs form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 text-left">
          {/* Header Mobile Brand details */}
          <div className="space-y-3">
            <div className="flex lg:hidden items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-md">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-brand-dark">SOMSKOOL</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold text-brand-dark">
              {t('create_account')}
            </h2>
            <p className="text-gray-400 text-sm font-semibold">
              {t('register_prompt')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name field */}
            <div className="space-y-1">
              <Label htmlFor="full_name" className="text-xs font-bold text-gray-500 uppercase">{t('full_name')}</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder={t('name_placeholder')}
                className="bg-white border-gray-200 text-brand-dark font-medium rounded-xl focus-visible:ring-brand-primary"
              />
            </div>

            {/* Email or Phone field */}
            <div className="space-y-1">
              <Label htmlFor="emailOrPhone" className="text-xs font-bold text-gray-500 uppercase">{t('email_or_phone_label')}</Label>
              <Input
                id="emailOrPhone"
                name="emailOrPhone"
                type="text"
                required
                placeholder={t('email_or_phone_placeholder')}
                className="bg-white border-gray-200 text-brand-dark font-medium rounded-xl focus-visible:ring-brand-primary"
              />
            </div>

            {/* Role field */}
            <div className="space-y-1">
              <Label htmlFor="role" className="text-xs font-bold text-gray-500 uppercase">{t('role_label')}</Label>
              <select
                id="role"
                name="role"
                required
                className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-brand-dark font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <option value="student">{t('student_role')}</option>
                <option value="teacher">{t('teacher_role')}</option>
              </select>
            </div>

            {/* Password field */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pass 1 */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={t('password_placeholder')}
                    className="bg-white border-gray-200 text-brand-dark pr-10 font-medium rounded-xl focus-visible:ring-brand-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-brand-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {/* Pass 2 */}
              <div className="space-y-1">
                <Label htmlFor="confirm_password" className="text-xs font-bold text-gray-500 uppercase">{t('confirm_password')}</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={t('confirm_password_placeholder')}
                  className="bg-white border-gray-200 text-brand-dark font-medium rounded-xl focus-visible:ring-brand-primary"
                />
              </div>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 flex items-start gap-2.5 text-xs font-medium leading-relaxed">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Terms clause */}
            <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
              Markaad samaysato koonto, waxaad ogolaatay in SomSkool ay ku habayn karto waxbarashadaada xeerarka Shuruucda iyo Terms of Service.
            </p>

            {/* Submit Action */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-bold py-6 text-base gap-2 shadow-lg shadow-brand-primary/15 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('registering')}
                </>
              ) : (
                t('register_button')
              )}
            </Button>
          </form>

          {/* Login Option */}
          <div className="text-center pt-2 text-sm text-gray-500 font-semibold">
            {t('already_registered')}{' '}
            <Link href="/login" className="text-brand-primary hover:underline font-bold">
              {t('login_now')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Inline badge for the left layout panel
function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`inline-flex items-center justify-center font-semibold rounded-full border px-3 py-1 text-xs ${className}`}>
      {children}
    </div>
  )
}

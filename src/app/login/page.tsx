'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/lib/actions/auth'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SomSkoolLogo from '@/components/SomSkoolLogo'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await signIn(formData)

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
        <Link href="/" className="flex items-center gap-3 relative z-10 w-fit">
          <SomSkoolLogo size={44} className="bg-white p-1 rounded-xl shadow-md" />
          <span className="font-display text-2xl font-bold tracking-tight">SOMSKOOL</span>
        </Link>

        {/* Brand Focus */}
        <div className="space-y-6 relative z-10 my-auto">
          <Badge className="bg-white/10 hover:bg-white/10 text-white border border-white/20 px-4 py-1.5 rounded-full text-xs w-fit">
            {t('quality_education')}
          </Badge>
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight">
            Learn Without <br />
            <span className="text-brand-accent">Limits.</span>
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

      {/* ✍️ RIGHT PANEL - Login credentials input Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 text-left">
          {/* Header Mobile Brand details */}
          <div className="space-y-3">
            <Link href="/" className="flex lg:hidden items-center gap-3 w-fit">
              <SomSkoolLogo size={40} className="rounded-xl" />
              <span className="font-display text-xl font-bold tracking-tight text-brand-dark">SOMSKOOL</span>
            </Link>
            <h2 className="font-display text-3xl font-extrabold text-brand-dark">
              {t('welcome_back')}
            </h2>
            <p className="text-gray-400 text-sm font-semibold">
              {t('login_prompt')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email or Phone field */}
            <div className="space-y-1.5">
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

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase">{t('password')}</Label>
                <Link href="/forgot-password" className="text-xs font-bold text-brand-primary hover:underline">{t('forgot_password')}</Link>
              </div>
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
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-medium leading-relaxed">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-bold py-6 text-base gap-2 shadow-lg shadow-brand-primary/15 transition-all cursor-pointer"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              Login
            </Button>
          </form>

          {/* Registration Option */}
          <div className="text-center pt-2 text-sm text-gray-500 font-semibold">
            {t('new_student')}{' '}
            <Link href="/register" className="text-brand-primary hover:underline font-bold">
              {t('register_now')}
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

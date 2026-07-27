'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/lib/actions/auth'
import { supabase } from '@/lib/supabase/client'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="#EA4335" d="M12 10.2v3.9h5.5a4.7 4.7 0 0 1-2 3.1l3.2 2.5c1.9-1.7 3-4.3 3-7.3 0-.7-.1-1.4-.2-2H12z" />
    <path fill="#34A853" d="M6.6 14.3l-.7.5-2.5 2A9 9 0 0 0 12 21c2.4 0 4.5-.8 6-2.2l-3.2-2.5c-.8.6-1.9.9-2.8.9-2.3 0-4.3-1.5-5-3.6z" />
    <path fill="#4A90E2" d="M3.4 7.2A9 9 0 0 0 3 12c0 1.6.4 3.2 1.1 4.6l3.2-2.5A5.4 5.4 0 0 1 7 12c0-.5.1-1 .3-1.5z" />
    <path fill="#FBBC05" d="M12 6.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 12 3a9 9 0 0 0-8 4.9l3.3 2.6c.7-2.1 2.7-3.6 5-3.6z" />
  </svg>
)

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16.4 12.8c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.2 0 1.9-1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.3-.9-2.3-3.3zM14.3 5.9c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2z" />
  </svg>
)

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setError(null)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/courses` },
    })
    if (oauthError) setError(oauthError.message)
  }

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] w-full items-center justify-center overflow-hidden bg-[#FAFAFE] px-4 py-16 font-sans">
      {/* Soft radial brand glow behind the card */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/[0.07] blur-[90px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Heading */}
        <div className="mb-8 space-y-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary">
            Welcome Back
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Login to Account
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Enter your credentials to access your courses.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-7 shadow-[0_6px_30px_rgba(26,26,46,0.07)] sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="emailOrPhone" className="text-[13px] font-bold text-brand-dark">
                Email Address
              </Label>
              <Input
                id="emailOrPhone"
                name="emailOrPhone"
                type="text"
                required
                placeholder="name@example.com"
                className="h-11 rounded-lg border-0 bg-[#F4F4F8] px-3.5 text-sm font-medium text-brand-dark placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand-primary/40"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[13px] font-bold text-brand-dark">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-xs font-semibold text-brand-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="h-11 rounded-lg border-0 bg-[#F4F4F8] px-3.5 pr-10 text-sm font-medium text-brand-dark placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-brand-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium leading-relaxed text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full gap-2 rounded-lg bg-brand-primary text-sm font-bold text-white shadow-md shadow-brand-primary/20 transition-all hover:bg-brand-primary-dark cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-[11px] font-medium text-gray-400">Or login with</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-brand-dark transition-colors hover:bg-gray-50 cursor-pointer"
            >
              <GoogleIcon className="h-4 w-4" />
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('apple')}
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-brand-dark transition-colors hover:bg-gray-50 cursor-pointer"
            >
              <AppleIcon className="h-4 w-4" />
              Apple
            </button>
          </div>

          {/* Sign up */}
          <p className="mt-5 text-center text-sm font-medium text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-brand-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

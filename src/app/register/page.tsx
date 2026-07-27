'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signUp } from '@/lib/actions/auth'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SocialAuthButtons from '@/components/SocialAuthButtons'

const fieldClass =
  'h-11 rounded-lg border-0 bg-[#F4F4F8] px-3.5 text-sm font-medium text-brand-dark placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand-primary/40'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Client side confirmation validation
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
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
    <div className="relative flex min-h-[calc(100vh-80px)] w-full items-center justify-center overflow-hidden bg-[#FAFAFE] px-4 py-16 font-sans">
      {/* Soft radial brand glow behind the card */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/[0.07] blur-[90px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Heading */}
        <div className="mb-8 space-y-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary">
            Get Started
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Create Account
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Join SomSkool and start learning today.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-7 shadow-[0_6px_30px_rgba(26,26,46,0.07)] sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="text-[13px] font-bold text-brand-dark">
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="Your full name"
                className={fieldClass}
              />
            </div>

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
                className={fieldClass}
              />
            </div>

            {/* Role is always student for public sign-ups */}
            <input type="hidden" name="role" value="student" />

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[13px] font-bold text-brand-dark">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className={`${fieldClass} pr-10`}
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm_password" className="text-[13px] font-bold text-brand-dark">
                Confirm Password
              </Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className={fieldClass}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium leading-relaxed text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Terms */}
            <p className="text-[11px] font-medium leading-relaxed text-gray-400">
              By creating an account, you agree to SomSkool&apos;s Terms of Service and Privacy Policy.
            </p>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full gap-2 rounded-lg bg-brand-primary text-sm font-bold text-white shadow-md shadow-brand-primary/20 transition-all hover:bg-brand-primary-dark cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Register
            </Button>
          </form>

          {/* Social sign-up */}
          <SocialAuthButtons label="Or sign up with" onError={setError} />

          {/* Login link */}
          <p className="mt-5 text-center text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-brand-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

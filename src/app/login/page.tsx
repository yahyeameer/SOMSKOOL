'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/lib/actions/auth'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

          {/* Sign up */}
          <p className="mt-6 text-center text-sm font-medium text-gray-500">
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

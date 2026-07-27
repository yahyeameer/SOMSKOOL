'use client'

import React from 'react'
import { supabase } from '@/lib/supabase/client'

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

interface SocialAuthButtonsProps {
  /** Text shown in the divider above the buttons. */
  label: string
  /** Where to send the user after a successful OAuth round trip. */
  next?: string
  onError: (message: string) => void
}

export default function SocialAuthButtons({ label, next = '/courses', onError }: SocialAuthButtonsProps) {
  const handleOAuth = async (provider: 'google' | 'apple') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
    if (error) onError(error.message)
  }

  const buttonClass =
    'flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-brand-dark transition-colors hover:bg-gray-50 cursor-pointer'

  return (
    <>
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-[11px] font-medium text-gray-400">{label}</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => handleOAuth('google')} className={buttonClass}>
          <GoogleIcon className="h-4 w-4" />
          Google
        </button>
        <button type="button" onClick={() => handleOAuth('apple')} className={buttonClass}>
          <AppleIcon className="h-4 w-4" />
          Apple
        </button>
      </div>
    </>
  )
}

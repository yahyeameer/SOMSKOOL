'use client'

import React, { useState } from 'react'
import { submitContactMessage } from '@/lib/actions/contact'
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const formData = {
      fullName: (form.elements.namedItem('full_name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    const result = await submitContactMessage(formData)

    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="bg-white border border-emerald-100 rounded-2xl p-10 shadow-md text-center space-y-6 font-sans">
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-brand-dark">
            {t('form_success_title')}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto font-medium">
            {t('form_success_desc')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-6 font-sans text-left">
      <div className="space-y-1">
        <h3 className="font-display text-xl font-bold text-brand-dark">
          {t('send_message')}
        </h3>
        <p className="text-gray-400 text-xs font-semibold">
          {t('form_subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
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

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase">{t('email_label')}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="magac@email.com"
            className="bg-white border-gray-200 text-brand-dark font-medium rounded-xl focus-visible:ring-brand-primary"
          />
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <Label htmlFor="subject" className="text-xs font-bold text-gray-500 uppercase">{t('subject')}</Label>
          <Input
            id="subject"
            name="subject"
            type="text"
            placeholder={t('subject_placeholder')}
            className="bg-white border-gray-200 text-brand-dark font-medium rounded-xl focus-visible:ring-brand-primary"
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase">{t('message')}</Label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder={t('message_placeholder')}
            className="flex w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-dark font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-medium leading-relaxed">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-brand-primary to-[#4834D4] hover:shadow-xl hover:shadow-brand-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 font-bold py-7 text-base gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          Submit
        </Button>
      </form>
    </div>
  )
}

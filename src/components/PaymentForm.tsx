'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { submitPayment } from '@/lib/actions/payment'
import { Profile } from '@/types'
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/contexts/LanguageContext'

interface PaymentFormProps {
  courseId: string
  title: string
  price: number
  user: Profile | null
}

export default function PaymentForm({ courseId, title, price, user }: PaymentFormProps) {
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState<'zaad' | 'edahab' | 'evc_plus' | 'golis'>('zaad')
  const [reference, setReference] = useState('')
  const [agreed, setAgreed] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      setError(t('agree_checkbox') || 'Fadlan xaqiiji inaad lacagta dirtay adoo saxaya sanduuqa.')
      return
    }

    setLoading(true)
    setError(null)

    const result = await submitPayment({
      courseId,
      fullName: user?.full_name || 'Barte SomSkool',
      email: 'barte@somskool.com', // fallback
      phone,
      method,
      reference,
      amount: price,
    })

    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
  }

  const methods = [
    { id: 'zaad', name: 'Zaad Service', label: 'Telesom Zaad', num: '063-4567890', color: 'border-emerald-200 hover:border-emerald-400' },
    { id: 'edahab', name: 'eDahab', label: 'Somtel eDahab', num: '062-4567890', color: 'border-yellow-200 hover:border-yellow-400' },
    { id: 'evc_plus', name: 'EVC Plus', label: 'Hormuud EVC+', num: '061-4567890', color: 'border-blue-200 hover:border-blue-400' },
    { id: 'golis', name: 'Golis Sahal', label: 'Golis Sahal', num: '090-4567890', color: 'border-orange-200 hover:border-orange-400' },
  ]

  if (success) {
    return (
      <div className="bg-white border border-emerald-100 rounded-2xl p-8 shadow-md text-center space-y-6 font-sans">
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-brand-dark">
            {t('payment_success')}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto font-medium">
            {t('payment_success_desc')}
          </p>
        </div>
        <Link 
          href="/courses" 
          className={buttonVariants({ 
            className: "rounded-full bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-8 shadow-md shadow-brand-primary/10 flex items-center justify-center inline-flex" 
          })}
        >
          {t('my_courses')}
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-6 font-sans text-left">
      <div className="space-y-1">
        <h3 className="font-display text-xl font-bold text-brand-dark">
          {t('enter_details')}
        </h3>
        <p className="text-gray-400 text-xs font-semibold">
          {t('payment_form_desc')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name & Email pre-filled read-only fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-500 uppercase">{t('full_name')}</Label>
            <Input
              type="text"
              value={user?.full_name || ''}
              readOnly
              className="bg-gray-50 border-gray-200 text-brand-dark font-semibold rounded-xl focus-visible:ring-brand-primary"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-500 uppercase">{t('choose_method')}</Label>
            <div className="h-10 px-3 bg-gray-50 border border-gray-200 text-brand-dark font-semibold rounded-xl flex items-center text-sm capitalize">
              {method.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Sender Mobile Number */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase">{t('sender_number')}</Label>
          <Input
            id="phone"
            type="tel"
            required
            placeholder="e.g. 0634567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-white border-gray-200 text-brand-dark font-medium rounded-xl focus-visible:ring-brand-primary"
          />
        </div>

        {/* Method Picker Grid */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-500 uppercase">{t('payment_method')}</Label>
          <div className="grid grid-cols-2 gap-3">
            {methods.map((met) => {
              const isSelected = method === met.id
              return (
                <button
                  type="button"
                  key={met.id}
                  onClick={() => setMethod(met.id as any)}
                  className={`p-3 border rounded-xl flex flex-col text-left transition-all ${met.color} ${
                    isSelected
                      ? 'bg-brand-primary/5 border-brand-primary text-brand-dark ring-2 ring-brand-primary/10'
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  <span className="text-xs font-bold font-display uppercase tracking-wide">
                    {met.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold mt-1">
                    Send to: {met.num}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Transaction Reference ID */}
        <div className="space-y-1.5">
          <Label htmlFor="reference" className="text-xs font-bold text-gray-500 uppercase">{t('transaction_id')}</Label>
          <Input
            id="reference"
            type="text"
            required
            placeholder={t('transaction_placeholder')}
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="bg-white border-gray-200 text-brand-dark font-medium rounded-xl focus-visible:ring-brand-primary"
          />
        </div>

        {/* Error Notification banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 flex items-start gap-2.5 text-xs font-medium leading-relaxed">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Checkbox agreement */}
        <div className="flex items-start gap-2.5">
          <input
            id="agree"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4.5 w-4.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary mt-0.5 cursor-pointer"
          />
          <Label htmlFor="agree" className="text-xs text-gray-500 font-semibold leading-relaxed cursor-pointer select-none">
            {t('confirm_payment_details')}
          </Label>
        </div>

        {/* Submit action button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-accent hover:bg-brand-accent/90 text-brand-dark font-bold py-6 text-base gap-2 shadow-lg shadow-brand-accent/15 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            <>
              {t('submit_details')}
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

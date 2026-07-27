'use client'

import React from 'react'
import ContactForm from '@/components/ContactForm'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export default function ContactClient({ settings }: { settings: any }) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col w-full font-sans">
      {/* 📞 Contact Hero Banner */}
      <section 
        className="py-16 text-center text-white relative overflow-hidden"
        style={{
          backgroundImage: settings.contact_header_image ? `linear-gradient(rgba(91, 79, 233, 0.85), rgba(91, 79, 233, 0.95)), url(${settings.contact_header_image})` : undefined,
          backgroundColor: settings.contact_header_image ? undefined : 'var(--brand-primary)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3 relative z-10">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            {settings.contact_title || t('contact_title')}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
            {settings.contact_subtitle || t('contact_subtitle')}
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.05),transparent)]" />
      </section>

      {/* 🛠️ Contact Content Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column — Contact Info */}
        <div className="space-y-10 text-left">
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-extrabold text-brand-dark">
              {t('contact_heading')}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-md whitespace-pre-wrap">
              {settings.contact_text || t('contact_description')}
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-5">
            {/* Location */}
            <div className="flex items-start gap-4 bg-white border border-border rounded-xl p-5 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark">{t('location')}</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{settings.contact_address || 'Hargeisa, Somaliland'}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 bg-white border border-border rounded-xl p-5 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark">{t('email_label')}</h4>
                <a href={`mailto:${settings.contact_email || 'support@somskool.com'}`} className="text-xs text-brand-primary font-semibold hover:underline mt-0.5 block">
                  {settings.contact_email || 'support@somskool.com'}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4 bg-white border border-border rounded-xl p-5 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark">{t('whatsapp')}</h4>
                <a href={`https://wa.me/${settings.contact_phone?.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-primary font-semibold hover:underline mt-0.5 block">
                  {settings.contact_phone || '+252 63 XXX XXXX'}
                </a>
              </div>
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-brand-primary/[0.02] border border-brand-primary/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-primary" />
              <h4 className="text-sm font-bold text-brand-dark">{t('working_hours')}</h4>
            </div>
            <div className="space-y-1.5 text-xs font-medium text-gray-500">
              <div className="flex items-center justify-between">
                <span>{t('mon_fri')}</span>
                <span className="font-bold text-brand-dark">8:00 AM – 6:00 PM (EAT)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('saturday')}</span>
                <span className="font-bold text-brand-dark">9:00 AM – 2:00 PM (EAT)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('sunday')}</span>
                <span className="font-bold text-red-400">{t('closed')}</span>
              </div>
            </div>
          </div>

          {/* Social Row — placed below the working hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('follow_social')}
            </h4>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com/somskool" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-10 w-10 rounded-full bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary flex items-center justify-center transition-all">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/somskool" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-10 w-10 rounded-full bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary flex items-center justify-center transition-all">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/somskool" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="h-10 w-10 rounded-full bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary flex items-center justify-center transition-all">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column — Contact Form */}
        <div className="flex flex-col justify-start">
          <ContactForm />
        </div>
      </section>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SomSkoolLogo from '@/components/SomSkoolLogo'

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export default function Footer({ settings }: { settings?: any }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-white/5 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <SomSkoolLogo size={44} className="bg-white p-1 shadow-md shadow-black/10 rounded-xl" />
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                SOMSKOOL
              </span>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              Waxaan u taaganahay inaan bulshada Soomaaliyeed u soo gudbino casharo tayo sare leh oo ku baxaya luuqadooda hooyo, si ay u dhistaan mustaqbal ifaya.
            </p>
            <div className="flex items-center gap-4">
              <a href={settings?.social_facebook || "https://facebook.com/somskool"} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-10 w-10 rounded-full bg-white/10 hover:bg-brand-primary flex items-center justify-center transition-colors text-white">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href={settings?.social_instagram || "https://instagram.com/somskool"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-10 w-10 rounded-full bg-white/10 hover:bg-brand-primary flex items-center justify-center transition-colors text-white">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href={settings?.social_linkedin || "https://linkedin.com/company/somskool"} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="h-10 w-10 rounded-full bg-white/10 hover:bg-brand-primary flex items-center justify-center transition-colors text-white">
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a href={settings?.social_youtube || "https://youtube.com/@somskool"} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="h-10 w-10 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors text-white">
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6 font-display">
              Xiriirada Degdega ah
            </h3>
            <ul className="space-y-4">
              {['About Us', 'All Courses', 'Contact support'].map((link) => (
                <li key={link}>
                  <Link href={link === 'All Courses' ? '/courses' : link === 'Contact support' ? '/contact' : '/about'} className="text-white/85 hover:text-white transition-colors text-sm font-medium">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6 font-display">
              Qeybaha ugu caansan
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Web Development', slug: 'web-development' },
                { name: 'UI/UX Design', slug: 'ui-ux' },
                { name: 'Digital Marketing', slug: 'digital-marketing' },
                { name: 'Data Science & AI', slug: 'data-science' },
                { name: 'Business Strategy', slug: 'business' },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/courses?category=${cat.slug}`} className="text-white/85 hover:text-white transition-colors text-sm font-medium">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6 font-display">
              Wargeyskayaga
            </h3>
            <p className="text-white/85 text-sm leading-relaxed">
              Ku biir wargeyskayaga si aad u hesho ogeysiisyada koorsooyinka cusub iyo qiimo dhimista.
            </p>
            {subscribed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 text-emerald-400 text-sm">
                Waad ku mahadsantahay ku biiristaada!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <Input
                  type="email"
                  placeholder="Geli iimaylkaaga"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/25 text-white placeholder:text-white/60 rounded-xl focus-visible:ring-white/50"
                />
                <Button type="submit" className="w-full rounded-xl bg-brand-accent hover:bg-brand-accent/90 text-brand-dark font-semibold gap-2 shadow-lg shadow-brand-accent/15 transition-all">
                  <Send className="h-4 w-4" />
                  Subscribe Now
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/85 font-medium">
          <p>© {new Date().getFullYear()} SomSkool. Xuquuqda oo dhan waa dhowran tahay.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

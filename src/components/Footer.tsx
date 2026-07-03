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

export default function Footer() {
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
    <footer className="bg-brand-primary text-white pt-16 pb-8 border-t border-white/5 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <SomSkoolLogo size={44} className="shadow-md shadow-brand-primary/25 rounded-xl" />
              <span className="font-display text-2xl font-bold tracking-tight">
                Som<span className="text-brand-accent">Skool</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Waxaan u taaganahay inaan bulshada Soomaaliyeed u soo gudbino casharo tayo sare leh oo ku baxaya luuqadooda hooyo, si ay u dhistaan mustaqbal ifaya.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 hover:bg-brand-primary flex items-center justify-center transition-colors text-gray-400 hover:text-white">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 hover:bg-brand-primary flex items-center justify-center transition-colors text-gray-400 hover:text-white">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 hover:bg-brand-primary flex items-center justify-center transition-colors text-gray-400 hover:text-white">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-accent mb-6 font-display">
              Xiriirada Degdega ah
            </h3>
            <ul className="space-y-4">
              {['About Us', 'All Courses', 'Contact support'].map((link) => (
                <li key={link}>
                  <Link href={link === 'All Courses' ? '/courses' : link === 'Contact support' ? '/contact' : '/about'} className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-accent mb-6 font-display">
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
                  <Link href={`/courses?category=${cat.slug}`} className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-accent mb-6 font-display">
              Wargeyskayaga
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
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
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus-visible:ring-brand-primary"
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
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70 font-medium">
          <p>© {new Date().getFullYear()} SomSkool. Xuquuqda oo dhan waa dhowran tahay.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

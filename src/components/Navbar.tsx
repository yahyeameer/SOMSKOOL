'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/actions/auth'
import { Profile } from '@/types'
import { Menu, X, User, LogOut, ChevronRight, Shield, Globe, Trophy } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SomSkoolLogo from '@/components/SomSkoolLogo'
import { useLanguage } from '@/contexts/LanguageContext'

interface NavbarProps {
  user: Profile | null
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { language, toggleLanguage, setLanguage, t } = useLanguage()

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('courses'), href: '/courses' },
    ...(user && user.role === 'student' ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
    { name: t('contact'), href: '/contact' },
    { name: 'About', href: '/about' },
  ]

  const handleLogout = async () => {
    await signOut()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/70 backdrop-blur-xl shadow-sm transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3 group">
                <SomSkoolLogo size={44} className="transition-transform duration-300 group-hover:scale-105 shadow-md shadow-brand-primary/25 rounded-xl" />
                <div className="flex flex-col">
                  <span className="font-display text-2xl font-bold tracking-tight text-[#4834D4] transition-colors">
                    SOMSKOOL
                  </span>
                  <span className="text-[10px] font-medium tracking-wide text-[#6C5CE7] -mt-1 hidden sm:block">
                    {t('empowering_minds')}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-sans text-sm font-semibold transition-colors duration-200 hover:text-brand-primary relative ${
                      isActive ? 'text-brand-primary' : 'text-slate-600'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-primary rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Desktop Right Side Toggle / Profile */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'EN' : 'SO'}
              </button>

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-sm font-bold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 transition-colors px-3 py-2 rounded-lg"
                >
                  <Shield className="h-4 w-4" />
                  {t('admin')}
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsOpen(true)}>
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-bold text-slate-900 leading-none">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {user.role}
                    </span>
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-brand-primary/20 hover:border-brand-primary transition-colors">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-bold text-sm">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <Menu className="h-5 w-5 text-slate-400" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    href="/login" 
                    className={buttonVariants({ 
                      className: "rounded-full bg-slate-900 hover:bg-slate-800 font-extrabold text-white px-6 shadow-md transition-all hover:scale-105" 
                    })}
                  >
                    {t('login')}
                  </Link>
                  <Link 
                    href="/register" 
                    className={buttonVariants({ 
                      className: "rounded-full bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-6 shadow-lg shadow-brand-primary/25 transition-all hover:scale-105" 
                    })}
                  >
                    {t('register')}
                  </Link>
                  <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg ml-2"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <Globe className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <span className="font-display font-bold text-lg text-slate-900">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* User Profile Section */}
          {user && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <Avatar className="h-12 w-12 border border-brand-primary/20">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-bold text-lg">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1">
                <span className="text-base font-bold text-slate-900">
                  {user.full_name}
                </span>
                <span className="text-xs text-slate-500 capitalize">{user.role}</span>
              </div>
              <div className="flex flex-col items-center bg-brand-primary/10 px-3 py-1.5 rounded-xl">
                <Trophy className="h-4 w-4 text-brand-primary" />
                <span className="text-sm font-extrabold text-brand-primary">{user.points ?? 0}</span>
                <span className="text-[9px] font-bold text-brand-primary/60 uppercase">{t('points')}</span>
              </div>
            </div>
          )}

          {/* Admin Section (Only visible to admins) */}
          {user?.role === 'admin' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maamulka (Admin)</span>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-brand-primary/10 text-brand-primary font-bold hover:bg-brand-primary/20 transition-colors"
              >
                <Shield className="h-5 w-5" />
                {t('admin')} Panel
              </Link>
            </div>
          )}

          {/* Student Dashboard Link */}
          {user?.role === 'student' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Waxbarashadaada</span>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-brand-primary/10 text-brand-primary font-bold hover:bg-brand-primary/20 transition-colors"
              >
                <Trophy className="h-5 w-5" />
                My Dashboard
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigation</span>
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl font-semibold transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-brand-primary'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className={`h-4 w-4 ${isActive ? 'text-brand-primary' : 'text-slate-400'}`} />
                </Link>
              )
            })}
          </div>

          {/* Language Toggle */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('language')}</span>
            <div className="flex gap-2 p-1 rounded-xl bg-slate-100">
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  language === 'en' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t('english')}
              </button>
              <button
                onClick={() => setLanguage('so')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  language === 'so' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t('somali')}
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          {user ? (
            <Button
              onClick={() => {
                setIsOpen(false)
                handleLogout()
              }}
              variant="destructive"
              className="w-full rounded-xl gap-2 font-bold shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className={buttonVariants({
                  className: "w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold shadow-sm"
                })}
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className={buttonVariants({
                  className: "w-full rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-bold text-white shadow-md shadow-brand-primary/20"
                })}
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}


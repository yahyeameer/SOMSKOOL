'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/actions/auth'
import { Profile } from '@/types'
import { Menu, X, User, LogOut, ChevronRight, Shield } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SomSkoolLogo from '@/components/SomSkoolLogo'

interface NavbarProps {
  user: Profile | null
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Contact', href: '/contact' },
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
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
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
                <span className="text-[10px] font-medium tracking-wide text-[#6C5CE7] -mt-1">
                  Empowering Minds Across Somalia
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
                  className={`font-sans text-sm font-semibold transition-colors duration-200 hover:text-brand-primary ${
                    isActive ? 'text-brand-primary font-bold' : 'text-text-muted'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Desktop User Panel */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={buttonVariants({
                      variant: "outline",
                      className: "rounded-full border-brand-primary/20 text-brand-primary font-bold text-xs gap-1.5 px-4 flex items-center justify-center inline-flex"
                    })}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-brand-primary/20">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-bold text-sm">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-brand-dark leading-none">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-gray-500 capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Kabax"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className={buttonVariants({ 
                    variant: "ghost", 
                    className: "font-semibold text-brand-dark hover:text-brand-primary transition-colors flex items-center justify-center inline-flex" 
                  })}
                >
                  Gala
                </Link>
                <Link 
                  href="/register" 
                  className={buttonVariants({ 
                    className: "rounded-full bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-6 shadow-md shadow-brand-primary/15 transition-all flex items-center justify-center inline-flex" 
                  })}
                >
                  Is-diiwangali
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-dark focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-border bg-white ${
          isOpen ? 'max-h-[400px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="space-y-2 px-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-primary/5 text-brand-primary font-bold'
                    : 'text-brand-dark hover:bg-gray-50'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className={`h-4 w-4 opacity-50 ${isActive ? 'text-brand-primary' : ''}`} />
              </Link>
            )
          })}

          <div className="border-t border-gray-100 my-4 pt-4">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-4">
                  <Avatar className="h-11 w-11 border border-brand-primary/20">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-bold text-base">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-brand-dark">
                      {user.full_name}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    handleLogout()
                  }}
                  variant="destructive"
                  className="w-full rounded-full gap-2 font-semibold"
                >
                  <LogOut className="h-4 w-4" />
                  Kabax (Logout)
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className={buttonVariants({
                    variant: "outline",
                    className: "rounded-full border-border text-brand-dark font-semibold flex items-center justify-center"
                  })}
                >
                  Gala (Login)
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className={buttonVariants({
                    className: "rounded-full bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white flex items-center justify-center"
                  })}
                >
                  Is-diiwangali
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

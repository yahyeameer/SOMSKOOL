'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getSessionUser() {
  // First check cookie cache for performance
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('somskool_user')
  if (userCookie?.value) {
    try {
      return JSON.parse(userCookie.value)
    } catch {
      // Invalid cookie, fall through to Supabase check
    }
  }

  // Check real Supabase session
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Fetch profile from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const sessionUser = profile || {
      id: user.id,
      full_name: user.user_metadata?.full_name || 'Student',
      role: 'student',
      points: 0
    }

    // Cache in cookie for next requests
    cookieStore.set('somskool_user', JSON.stringify(sessionUser), { path: '/', maxAge: 604800 })

    return sessionUser
  } catch {
    return null
  }
}

/**
 * Verifies the caller is an admin using the REAL Supabase session and the
 * database role — NOT the `somskool_user` cookie (which is client-forgeable).
 *
 * Use this to gate any privileged / service-role server action.
 */
export async function requireAdmin(): Promise<
  | { ok: true; userId: string }
  | { ok: false; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { ok: false, error: 'Please log in to continue.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { ok: false, error: 'You must be an admin to perform this action.' }
    }

    return { ok: true, userId: user.id }
  } catch {
    return { ok: false, error: 'Could not verify your admin permissions.' }
  }
}

export async function signIn(formData: FormData) {
  const rawInput = formData.get('emailOrPhone') as string
  const password = formData.get('password') as string

  if (!rawInput || !password) {
    return { error: 'Fadlan buuxi dhamaan meelaha banaan' }
  }

  // Auto-detect email or phone
  const email = rawInput.includes('@') 
    ? rawInput 
    : `${rawInput.replace(/[^0-9+]/g, '')}@users.somskool.com`

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    // Get user profile to cache in cookie
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      const cachedUser = profile || {
        id: data.user.id,
        full_name: data.user.user_metadata?.full_name || 'Student',
        role: 'student',
        points: 0
      }

      const cookieStore = await cookies()
      cookieStore.set('somskool_user', JSON.stringify(cachedUser), { path: '/', maxAge: 604800 })
    }
  } catch (err: any) {
    return { error: err.message || 'Login failed. Please check your credentials.' }
  }

  redirect('/courses')
}

export async function signUp(formData: FormData) {
  const fullName = formData.get('full_name') as string
  const rawInput = formData.get('emailOrPhone') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string
  const role = formData.get('role') as string || 'student'

  if (!fullName || !rawInput || !password) {
    return { error: 'Fadlan buuxi dhamaan meelaha banaan' }
  }

  if (password !== confirmPassword) {
    return { error: 'Furayaasha iskuma mid aha' }
  }

  // Auto-detect email or phone
  const email = rawInput.includes('@') 
    ? rawInput 
    : `${rawInput.replace(/[^0-9+]/g, '')}@users.somskool.com`

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, requested_role: role } }
    })

    if (error) throw error

    if (data.user) {
      // The DB trigger will create the profile automatically.
      // Fetch it (or use a fallback until trigger fires)
      const cachedUser = {
        id: data.user.id,
        full_name: fullName,
        role: 'student',
        avatar_url: '',
        points: 0
      }
      const cookieStore = await cookies()
      cookieStore.set('somskool_user', JSON.stringify(cachedUser), { path: '/', maxAge: 604800 })
    }
  } catch (err: any) {
    return { error: err.message || 'Registration failed. Please try again.' }
  }

  redirect('/courses')
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('somskool_user')

  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {
    // Even if Supabase signout fails, we've cleared the cookie
  }

  redirect('/')
}

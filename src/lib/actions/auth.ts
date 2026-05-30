'use server'

import { createClient, isMock } from '@/lib/supabase/server'
import { mockDb } from '@/lib/supabase/mock'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getSessionUser() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('somskool_user')
  if (userCookie?.value) {
    try {
      return JSON.parse(userCookie.value)
    } catch {
      return null
    }
  }

  if (isMock) {
    return mockDb.getCurrentUser()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return profile || { id: user.id, full_name: user.user_metadata.full_name || 'Student', role: 'student' }
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Fadlan buuxi dhamaan meelaha banaan' }
  }

  if (isMock) {
    const { data, error } = mockDb.login(email)
    if (error) return { error: error.message }
    
    // Set cookie on server side so middleware is updated
    const cookieStore = await cookies()
    cookieStore.set('somskool_user', JSON.stringify(data.user), { path: '/', maxAge: 604800 })
    
    redirect('/courses')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  // Get user profile to cache in cookie for middleware performance
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const cachedUser = profile || { id: user.id, full_name: user.user_metadata.full_name || 'Student', role: 'student' }
    const cookieStore = await cookies()
    cookieStore.set('somskool_user', JSON.stringify(cachedUser), { path: '/', maxAge: 604800 })
  }

  redirect('/courses')
}

export async function signUp(formData: FormData) {
  const fullName = formData.get('full_name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (!fullName || !email || !password) {
    return { error: 'Fadlan buuxi dhamaan meelaha banaan' }
  }

  if (password !== confirmPassword) {
    return { error: 'Furayaasha iskuma mid aha' }
  }

  if (isMock) {
    const { data, error } = mockDb.register(fullName, email)
    if (error) return { error: error.message }

    const cookieStore = await cookies()
    cookieStore.set('somskool_user', JSON.stringify(data.user), { path: '/', maxAge: 604800 })

    redirect('/courses')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  })
  
  if (error) return { error: error.message }

  // Supabase trigger automatically creates a profile.
  // Wait a moment and redirect to login or courses.
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const cachedUser = { id: user.id, full_name: fullName, role: 'student' }
    const cookieStore = await cookies()
    cookieStore.set('somskool_user', JSON.stringify(cachedUser), { path: '/', maxAge: 604800 })
  }

  redirect('/courses')
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('somskool_user')

  if (isMock) {
    mockDb.logout()
    redirect('/')
  }

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

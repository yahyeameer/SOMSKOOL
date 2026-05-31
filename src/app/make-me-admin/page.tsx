'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function MakeMeAdmin() {
  const [status, setStatus] = useState('Waxaan kugu bedelayaa Admin...')

  useEffect(() => {
    async function makeAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setStatus('Fadlan marka hore Login samee!')
        return
      }

      // Update the role to admin in the profiles table
      // This works because the RLS policy allows users to update their own profile!
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)

      if (error) {
        setStatus('Cillad ayaa dhacday: ' + error.message)
      } else {
        setStatus('Waa lagu guuleystay! Hada waxaad tahay Admin. Fadlan Logout dheh kadibna mar labaad Login samee si ay u shaqeyso.')
      }
    }

    makeAdmin()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-brand-primary">Admin Access</h1>
        <p className="text-gray-700 font-medium">{status}</p>
      </div>
    </div>
  )
}

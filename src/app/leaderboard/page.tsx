import React from 'react'
import { getLeaderboard } from '@/lib/actions/users'
import LeaderboardClient from '@/components/LeaderboardClient'

export const revalidate = 60 // Revalidate every minute

export default async function LeaderboardPage() {
  const { data: leaderboard } = await getLeaderboard()
  
  return <LeaderboardClient leaderboard={leaderboard || []} />
}

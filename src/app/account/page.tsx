import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AccountClient from './AccountClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi cuenta — CodeReview AI',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <AccountClient
      email={user.email ?? ''}
      plan={profile?.plan ?? 'free'}
      reviewsUsed={profile?.reviews_used ?? 0}
      stripeCustomerId={profile?.stripe_customer_id ?? null}
    />
  )
}

import { redirect } from 'next/navigation'
import { checkIsAdmin } from '@/lib/supabase/check-admin'
import AdminClient from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) redirect('/')

  return <AdminClient />
}

import { createClient } from './server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function checkIsAdmin(): Promise<boolean> {
  try {
    // Get current user via session cookies
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // Use service role to bypass RLS for the admin check
    const service = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data } = await service
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    return data?.is_admin === true
  } catch {
    return false
  }
}

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export function createAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Server env missing: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required.')
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function readBearerToken(req) {
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) return ''
  return authHeader.slice(7).trim()
}

export async function requireAdmin(adminClient, token) {
  if (!token) {
    return { ok: false, status: 401, error: 'Missing bearer token.' }
  }

  const { data: requesterData, error: requesterError } = await adminClient.auth.getUser(token)
  if (requesterError || !requesterData?.user?.email) {
    return { ok: false, status: 401, error: 'Invalid auth token.' }
  }

  const requesterEmail = requesterData.user.email.toLowerCase()
  const { data: requesterProfile, error: requesterProfileError } = await adminClient
    .from('profiles')
    .select('role')
    .eq('email', requesterEmail)
    .single()

  if (requesterProfileError) {
    return { ok: false, status: 403, error: 'Requester profile not found.' }
  }
  if (requesterProfile?.role !== 'admin') {
    return { ok: false, status: 403, error: 'Admin role required.' }
  }

  return { ok: true, requesterEmail }
}

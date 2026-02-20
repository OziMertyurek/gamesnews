import { createAdminClient, readBearerToken } from './_admin.js'

export async function requireUser(req) {
  const adminClient = createAdminClient()
  const token = readBearerToken(req)
  if (!token) return { ok: false, status: 401, error: 'Missing bearer token.' }

  const { data, error } = await adminClient.auth.getUser(token)
  if (error || !data?.user?.email) {
    return { ok: false, status: 401, error: 'Invalid auth token.' }
  }

  const email = data.user.email.toLowerCase()
  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('id,email,name')
    .eq('email', email)
    .single()

  if (profileError || !profile) {
    return { ok: false, status: 404, error: 'Profile not found.' }
  }

  return { ok: true, adminClient, profileId: String(profile.id), email, name: String(profile.name ?? '') }
}

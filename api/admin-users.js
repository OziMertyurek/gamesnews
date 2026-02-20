import { checkRateLimit, withCors } from './_security.js'
import { createAdminClient, readBearerToken, requireAdmin } from './_admin.js'

function json(res, status, payload) {
  res.status(status).json(payload)
}

export default async function handler(req, res) {
  withCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  const rl = checkRateLimit(req, 'admin-users', { limit: 30, windowMs: 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { error: 'Too many requests.' })
  }

  try {
    const adminClient = createAdminClient()
    const token = readBearerToken(req)
    const requester = await requireAdmin(adminClient, token)
    if (!requester.ok) return json(res, requester.status, { error: requester.error })

    const { data, error } = await adminClient
      .from('profiles')
      .select('name,email,role')
      .order('email', { ascending: true })

    if (error) return json(res, 500, { error: error.message })
    return json(res, 200, { users: data ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.'
    return json(res, 500, { error: message })
  }
}

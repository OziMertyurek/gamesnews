import { checkRateLimit, withCors } from './_security.js'
import { createAdminClient, readBearerToken, requireAdmin } from './_admin.js'

function json(res, status, payload) {
  res.status(status).json(payload)
}

export default async function handler(req, res) {
  withCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  const rl = checkRateLimit(req, 'admin-dashboard-stats', { limit: 40, windowMs: 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { error: 'Too many requests.' })
  }

  try {
    const adminClient = createAdminClient()
    const token = readBearerToken(req)
    const requester = await requireAdmin(adminClient, token)
    if (!requester.ok) return json(res, requester.status, { error: requester.error })

    const { count: totalUsers, error: countError } = await adminClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (countError) return json(res, 500, { error: countError.message })

    const now = Date.now()
    const activeWindowMs = 15 * 60 * 1000
    let page = 1
    const perPage = 200
    let activeUsers = 0
    let keep = true

    while (keep) {
      const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage })
      if (error) return json(res, 500, { error: error.message })

      const users = data?.users ?? []
      for (const user of users) {
        const ts = user.last_sign_in_at ? Date.parse(user.last_sign_in_at) : NaN
        if (!Number.isNaN(ts) && now - ts <= activeWindowMs) activeUsers += 1
      }

      if (users.length < perPage) {
        keep = false
      } else {
        page += 1
      }
    }

    return json(res, 200, {
      totalUsers: totalUsers ?? 0,
      activeUsers,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.'
    return json(res, 500, { error: message })
  }
}
